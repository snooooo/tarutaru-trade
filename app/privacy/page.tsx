import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "プライバシーポリシー | TaruTaruTrade",
  description: "TaruTaruTradeのプライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto grid max-w-2xl gap-6 text-stone-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          トップに戻る
        </Link>
        <header>
          <p className="text-sm font-medium text-stone-500">Privacy Policy</p>
          <h1 className="mt-1 text-3xl font-semibold text-stone-950">プライバシーポリシー</h1>
          <p className="mt-3 text-sm text-stone-600">最終更新日: 2026年5月4日</p>
        </header>

        <p className="leading-7">
          TaruTaruTrade（以下「本サービス」）の運営者（以下「運営者」）は、利用者の個人情報の取り扱いについて、個人情報の保護に関する法律その他の関連法令を遵守し、本ポリシーに基づき適切に取り扱います。
        </p>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">1. 取得する情報</h2>
          <p className="leading-7">本サービスでは、以下の情報を取得します。</p>

          <h3 className="text-base font-semibold text-stone-950">(1) 利用者から提供いただく情報</h3>
          <ul className="grid list-disc gap-2 pl-5 leading-7">
            <li>メールアドレス（ログイン用。姉妹サービスMaltPeriと共通のアカウントとして取得します）</li>
            <li>表示名</li>
            <li>X（旧Twitter）のID</li>
            <li>Xフォロワー数のレンジ（自己申告）</li>
            <li>匿名配送の利用可否</li>
            <li>交換投稿の内容（出るボトル・求むボトル・補足条件・画像等）</li>
            <li>興味あり、相談開始、キャンセル、完了等の取引状態に関する情報</li>
            <li>取引完了後の評価・コメント</li>
          </ul>

          <h3 className="text-base font-semibold text-stone-950">(2) 利用に伴って自動的に取得される情報</h3>
          <ul className="grid list-disc gap-2 pl-5 leading-7">
            <li>アクセスログ（IPアドレス、ユーザーエージェント、リファラ、アクセス日時等）</li>
            <li>認証セッションを維持するためのCookie等</li>
          </ul>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">2. 利用目的</h2>
          <p className="leading-7">取得した情報は、以下の目的で利用します。</p>
          <ul className="grid list-disc gap-2 pl-5 leading-7">
            <li>本サービスの提供、認証、利用者への連絡</li>
            <li>交換投稿の表示、検索結果の提供、マッチングの仲介</li>
            <li>相談開始済みの相手に対するX IDの開示</li>
            <li>不正利用、規約違反、トラブル対応のための調査</li>
            <li>利用状況の集計分析、サービスの改善・開発</li>
            <li>お問い合わせへの対応</li>
            <li>法令に基づく対応</li>
          </ul>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">3. 公開・他の利用者への開示</h2>
          <p className="leading-7">
            本サービスの公開ページでは、以下の情報が他の利用者および未ログインの閲覧者に表示されます。
          </p>
          <ul className="grid list-disc gap-2 pl-5 leading-7">
            <li>表示名</li>
            <li>Xフォロワー数のレンジ</li>
            <li>匿名配送可否</li>
            <li>取引完了数、平均評価、評価件数、キャンセル率</li>
            <li>公開中の交換投稿の内容（ボトル名・状態・画像・補足条件等）</li>
          </ul>
          <p className="leading-7">
            X IDは公開ページには表示されず、交換投稿に対する興味ありに対し投稿者が「相談開始」を選択した時点で、相談の当事者間でのみ相互に開示されます。
          </p>
          <p className="leading-7">
            メールアドレスおよび内部ユーザーIDは、他の利用者には一切開示されません。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">4. 第三者提供</h2>
          <p className="leading-7">
            運営者は、次のいずれかに該当する場合を除き、利用者の個人情報を第三者に提供しません。
          </p>
          <ul className="grid list-disc gap-2 pl-5 leading-7">
            <li>利用者の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命・身体・財産の保護のために必要な場合</li>
            <li>事業の承継に伴って提供する場合（承継先でも本ポリシーの遵守を求めます）</li>
          </ul>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">5. 業務委託・外部サービスの利用</h2>
          <p className="leading-7">
            本サービスは、以下の外部サービスを利用しており、運営に必要な範囲で個人情報の取り扱いを委託しています。
          </p>
          <ul className="grid list-disc gap-2 pl-5 leading-7">
            <li>
              <span className="font-semibold">Supabase</span>
              （提供: Supabase, Inc. / 米国） — 認証、データベース、ストレージ。利用者データはSupabaseのサーバーに保存されます。
            </li>
            <li>
              <span className="font-semibold">姉妹サービスMaltPeri</span>
              （同一運営者） — アカウント基盤を共有しています。メールアドレスおよび認証情報はMaltPeriと共通です。
            </li>
          </ul>
          <p className="leading-7">
            外部サービスの利用にあたり、外国にある第三者への個人情報の提供が含まれる場合があります。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">6. 保存期間・退会時の取り扱い</h2>
          <p className="leading-7">
            個人情報は、利用目的の達成に必要な期間、本サービスを継続利用される間保有します。利用者が退会機能を利用してアカウントを削除した場合の取り扱いは以下のとおりです。
          </p>
          <ul className="grid list-disc gap-2 pl-5 leading-7">
            <li>表示名、X ID、フォロワー数レンジ等のプロフィール情報は削除されます。</li>
            <li>
              公開中の交換投稿は非公開となり、以降は他の利用者に表示されません。
            </li>
            <li>
              完了済みおよびキャンセル済みの取引履歴・評価は、相手方の取引記録としての必要性から残存しますが、退会した利用者の表示名は「退会したユーザー」となり、X IDは表示されなくなります。
            </li>
            <li>
              アクセスログ等のサーバ側ログは、不正調査・障害対応・法令対応のため、合理的な期間保持されることがあります。
            </li>
            <li>
              退会処理は即時に行われ、原則として取り消しや復元はできません。
            </li>
            <li>
              アカウントは姉妹サービスMaltPeriと共通のため、退会すると同じメールアドレスではいずれのサービスにもログインできなくなります。
            </li>
          </ul>
          <p className="leading-7">
            なお、相談中・完了確認中の取引が残っている場合は、相手方への影響を防ぐため退会できません。先に各取引を完了またはキャンセルしてからお手続きください。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">7. 利用者の権利</h2>
          <p className="leading-7">
            利用者は、自身の個人情報について以下の対応をとることができます。
          </p>
          <ul className="grid list-disc gap-2 pl-5 leading-7">
            <li>
              <span className="font-semibold">確認・訂正</span> — マイページの
              <Link href="/settings/profile" className="underline underline-offset-4">
                プロフィール編集画面
              </Link>
              から、表示名・X ID・フォロワー数レンジ等を確認・訂正できます。
            </li>
            <li>
              <span className="font-semibold">投稿の非公開化・終了</span> —
              マイページの自身の交換投稿一覧から、公開中の投稿を非公開または終了に変更できます。
            </li>
            <li>
              <span className="font-semibold">削除・退会</span> —
              <Link href="/settings/account/delete" className="underline underline-offset-4">
                退会ページ
              </Link>
              からアカウントを削除できます。
            </li>
            <li>
              <span className="font-semibold">その他の請求</span> — 個人情報保護法に定める開示・利用停止・第三者提供記録の開示等の請求は、お問い合わせ先までご連絡ください。
            </li>
          </ul>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">8. Cookie等の利用</h2>
          <p className="leading-7">
            本サービスは、ログインセッションの維持のためにCookie等を利用します。これらは本サービスの動作に必要なものであり、無効化するとログインが維持できなくなります。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">9. 安全管理措置</h2>
          <p className="leading-7">
            運営者は、個人情報の漏えい、滅失、毀損の防止その他の安全管理のため、利用者の認証、アクセス権限の制御、通信の暗号化、行レベルセキュリティ（RLS）による権限管理等、合理的な措置を講じます。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">10. 改定</h2>
          <p className="leading-7">
            本ポリシーは、法令の変更や本サービスの提供内容の変更に応じて改定することがあります。改定後の内容は本ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">11. お問い合わせ先</h2>
          <p className="leading-7">
            本ポリシーまたは個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
          </p>
          <dl className="grid gap-1 rounded-md border border-stone-200 bg-stone-50 p-4 text-sm leading-7">
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-stone-950">サービス名</dt>
              <dd>TaruTaruTrade</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-stone-950">運営者</dt>
              <dd>ス氏</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-stone-950">連絡先</dt>
              <dd>
                <a href="mailto:sushichallenger1215@gmail.com" className="underline underline-offset-4">
                  sushichallenger1215@gmail.com
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </article>
    </PageShell>
  );
}
