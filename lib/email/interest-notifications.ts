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
