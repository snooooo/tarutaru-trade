import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type NotifyPostInterestReceivedInput = {
  interestId: string | null;
  requesterDisplayName: string;
  requesterUserId: string;
  targetPostId: string;
  proposalBottleNames: string[];
};

type TradePostNotificationRow = {
  id: string;
  title: string | null;
  user_id: string;
};

type InterestNotificationRow = {
  id: string;
  requester_user_id: string;
  receiver_user_id: string;
  target_trade_post_id: string | null;
};

type TradeProfileNotificationRow = {
  user_id: string;
  display_name: string;
};

const resendEndpoint = "https://api.resend.com/emails";

function appUrl(path: string) {
  const configuredUrl =
    process.env.TARUTARU_TRADE_APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  const baseUrl = configuredUrl?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${baseUrl}${path}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function textList(values: string[]) {
  if (values.length === 0) {
    return "候補ボトルの詳細は届いた興味あり画面で確認してください。";
  }

  return values.map((value) => `- ${value}`).join("\n");
}

function htmlList(values: string[]) {
  if (values.length === 0) {
    return "<p>候補ボトルの詳細は届いた興味あり画面で確認してください。</p>";
  }

  return `<ul>${values.map((value) => `<li>${escapeHtml(value)}</li>`).join("")}</ul>`;
}

async function sendResendEmail(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("Skipping interest email: RESEND_API_KEY or RESEND_FROM_EMAIL is not set.");
    return;
  }

  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${errorText}`);
  }
}

function otherParticipant(interest: InterestNotificationRow, actorUserId: string) {
  if (interest.requester_user_id === actorUserId) return interest.receiver_user_id;
  if (interest.receiver_user_id === actorUserId) return interest.requester_user_id;
  return null;
}

async function getUserEmail(
  adminSupabase: NonNullable<ReturnType<typeof createAdminSupabaseClient>>,
  userId: string,
) {
  const {
    data: { user },
    error,
  } = await adminSupabase.auth.admin.getUserById(userId);

  if (error || !user?.email) {
    console.error("Failed to load user email for trade notification.", error);
    return null;
  }

  return user.email;
}

async function getInterestContext(interestId: string) {
  const adminSupabase = createAdminSupabaseClient();

  if (!adminSupabase) {
    console.warn("Skipping trade email: Supabase service role is not configured.");
    return null;
  }

  const { data: interest, error: interestError } = await adminSupabase
    .from("trade_interests")
    .select("id,requester_user_id,receiver_user_id,target_trade_post_id")
    .eq("id", interestId)
    .single<InterestNotificationRow>();

  if (interestError || !interest) {
    console.error("Failed to load interest for trade email.", interestError);
    return null;
  }

  const profileUserIds = [interest.requester_user_id, interest.receiver_user_id];
  const [{ data: profiles, error: profilesError }, postResult] = await Promise.all([
    adminSupabase
      .from("trade_profiles")
      .select("user_id,display_name")
      .in("user_id", profileUserIds),
    interest.target_trade_post_id
      ? adminSupabase
          .from("trade_posts")
          .select("id,title,user_id")
          .eq("id", interest.target_trade_post_id)
          .single<TradePostNotificationRow>()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (profilesError) {
    console.error("Failed to load profiles for trade email.", profilesError);
  }

  const profileMap = new Map(
    ((profiles ?? []) as TradeProfileNotificationRow[]).map((profile) => [
      profile.user_id,
      profile.display_name,
    ]),
  );

  return {
    adminSupabase,
    interest,
    post: postResult.data,
    postError: postResult.error,
    profileMap,
  };
}

function displayName(
  profileMap: Map<string, string>,
  userId: string,
  fallback = "相手",
) {
  return profileMap.get(userId) ?? fallback;
}

function postTitle(post: TradePostNotificationRow | null) {
  return post?.title?.trim() || "トレード案件";
}

export async function notifyPostInterestReceived(input: NotifyPostInterestReceivedInput) {
  try {
    const adminSupabase = createAdminSupabaseClient();

    if (!adminSupabase) {
      console.warn("Skipping interest email: Supabase service role is not configured.");
      return;
    }

    const { data: post, error: postError } = await adminSupabase
      .from("trade_posts")
      .select("id,title,user_id")
      .eq("id", input.targetPostId)
      .single<TradePostNotificationRow>();

    if (postError || !post) {
      console.error("Failed to load post for interest email.", postError);
      return;
    }

    if (post.user_id === input.requesterUserId) {
      return;
    }

    const {
      data: { user: receiver },
      error: receiverError,
    } = await adminSupabase.auth.admin.getUserById(post.user_id);

    if (receiverError || !receiver?.email) {
      console.error("Failed to load receiver email for interest email.", receiverError);
      return;
    }

    const receivedUrl = appUrl("/mypage/interests/received");
    const postTitle = post.title?.trim() || "あなたのトレード案件";
    const subject = `【TaruTaruTrade】「${postTitle}」に興味ありが届きました`;
    const safePostTitle = escapeHtml(postTitle);
    const safeRequesterName = escapeHtml(input.requesterDisplayName);

    await sendResendEmail({
      to: receiver.email,
      subject,
      text: [
        `${input.requesterDisplayName}さんが「${postTitle}」に興味ありを送りました。`,
        "",
        "候補ボトル:",
        textList(input.proposalBottleNames),
        "",
        "届いた興味ありを確認する:",
        receivedUrl,
        "",
        input.interestId ? `Interest ID: ${input.interestId}` : null,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
      html: [
        `<p>${safeRequesterName}さんが「${safePostTitle}」に興味ありを送りました。</p>`,
        "<p>候補ボトル:</p>",
        htmlList(input.proposalBottleNames),
        `<p><a href="${escapeHtml(receivedUrl)}">届いた興味ありを確認する</a></p>`,
      ].join(""),
    });
  } catch (error) {
    console.error("Failed to send interest email notification.", error);
  }
}

export async function notifyConsultingStarted(input: {
  interestId: string;
  actorUserId: string;
}) {
  try {
    const context = await getInterestContext(input.interestId);
    if (!context) return;

    const recipientUserId = otherParticipant(context.interest, input.actorUserId);
    if (!recipientUserId) return;

    const recipientEmail = await getUserEmail(context.adminSupabase, recipientUserId);
    if (!recipientEmail) return;

    if (context.postError) {
      console.error("Failed to load post for consulting email.", context.postError);
    }

    const title = postTitle(context.post);
    const actorName = displayName(context.profileMap, input.actorUserId);
    const tradeUrl = appUrl(`/trades/${input.interestId}`);

    await sendResendEmail({
      to: recipientEmail,
      subject: `【TaruTaruTrade】「${title}」の相談が開始されました`,
      text: [
        `${actorName}さんが「${title}」のトレード相談を開始しました。`,
        "",
        "取引詳細を確認する:",
        tradeUrl,
      ].join("\n"),
      html: [
        `<p>${escapeHtml(actorName)}さんが「${escapeHtml(title)}」のトレード相談を開始しました。</p>`,
        `<p><a href="${escapeHtml(tradeUrl)}">取引詳細を確認する</a></p>`,
      ].join(""),
    });
  } catch (error) {
    console.error("Failed to send consulting email notification.", error);
  }
}

export async function notifyTradeCompletionUpdated(input: {
  interestId: string;
  actorUserId: string;
  status: string | null;
}) {
  try {
    const context = await getInterestContext(input.interestId);
    if (!context) return;

    if (context.postError) {
      console.error("Failed to load post for completion email.", context.postError);
    }

    const title = postTitle(context.post);
    const actorName = displayName(context.profileMap, input.actorUserId);
    const tradeUrl = appUrl(`/trades/${input.interestId}`);

    if (input.status === "completed") {
      const recipients = await Promise.all(
        [context.interest.requester_user_id, context.interest.receiver_user_id].map(
          async (userId) => ({
            userId,
            email: await getUserEmail(context.adminSupabase, userId),
          }),
        ),
      );

      await Promise.all(
        recipients
          .filter((recipient): recipient is { userId: string; email: string } =>
            Boolean(recipient.email),
          )
          .map((recipient) =>
            sendResendEmail({
              to: recipient.email,
              subject: `【TaruTaruTrade】「${title}」のトレードが完了しました`,
              text: [
                `「${title}」の双方の完了確認が揃い、トレードが完了しました。`,
                "",
                "取引詳細を確認する:",
                tradeUrl,
              ].join("\n"),
              html: [
                `<p>「${escapeHtml(title)}」の双方の完了確認が揃い、トレードが完了しました。</p>`,
                `<p><a href="${escapeHtml(tradeUrl)}">取引詳細を確認する</a></p>`,
              ].join(""),
            }),
          ),
      );
      return;
    }

    if (input.status === "completion_requested") {
      const recipientUserId = otherParticipant(context.interest, input.actorUserId);
      if (!recipientUserId) return;

      const recipientEmail = await getUserEmail(context.adminSupabase, recipientUserId);
      if (!recipientEmail) return;

      await sendResendEmail({
        to: recipientEmail,
        subject: `【TaruTaruTrade】「${title}」の完了確認が届きました`,
        text: [
          `${actorName}さんが「${title}」の完了確認をしました。`,
          "内容を確認して、問題なければあなたも完了確認をしてください。",
          "",
          "取引詳細を確認する:",
          tradeUrl,
        ].join("\n"),
        html: [
          `<p>${escapeHtml(actorName)}さんが「${escapeHtml(title)}」の完了確認をしました。</p>`,
          "<p>内容を確認して、問題なければあなたも完了確認をしてください。</p>",
          `<p><a href="${escapeHtml(tradeUrl)}">取引詳細を確認する</a></p>`,
        ].join(""),
      });
    }
  } catch (error) {
    console.error("Failed to send trade completion email notification.", error);
  }
}
