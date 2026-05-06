import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "利用規約 | TaruTaruTrade",
  description: "TaruTaruTradeの利用規約",
};

export default function TermsPage() {
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
          <p className="text-sm font-medium text-stone-500">Terms of Service</p>
          <h1 className="mt-1 text-3xl font-semibold text-stone-950">利用規約</h1>
          <p className="mt-3 text-sm text-stone-600">最終更新日: 2026年5月6日</p>
        </header>

        <p className="leading-7">
          本規約は、TaruTaruTrade（以下「本サービス」）の提供条件および運営者と利用者との間の権利義務関係を定めるものです。本サービスを利用する方（以下「利用者」）は、本規約および
          <Link href="/privacy" className="underline underline-offset-4">
            プライバシーポリシー
          </Link>
          に同意したものとみなします。
        </p>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第1条（サービス内容）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              本サービスは、ウイスキーボトルの交換相手を探すためのマッチング・告知機能を提供するものです。
            </li>
            <li>
              本サービスは取引相手の発見および連絡先（X ID）の交換のみを支援するものであり、ボトルの売買仲介、配送代行、エスクロー、品質保証、真贋鑑定等は行いません。
            </li>
            <li>
              ボトルの引き渡し、対価の授受、配送等の具体的な取引は、利用者間の自己責任で行うものとします。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第2条（アカウント）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              本サービスのアカウントは、姉妹サービス
              <a
                href="https://maltperi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                MaltPeri
              </a>
              と共通です。本サービスでの登録によりMaltPeriにもログイン可能となり、退会した場合は同じメールアドレスではいずれにもログインできなくなります。
            </li>
            <li>
              利用者は、登録情報を正確かつ最新に保つものとします。
            </li>
            <li>
              利用者は、自身の認証情報を厳重に管理する責任を負います。アカウントの不正利用に起因する損害について、運営者は責任を負いません。
            </li>
            <li>
              本サービスは20歳以上の方を対象とします。日本国内法で酒類取引が許可される年齢に満たない方は利用できません。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第3条（有料機能・サブスクリプション）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              本サービスは、将来的に一部の機能を有料化またはサブスクリプション制（以下「有料プラン」）として提供することがあります。
            </li>
            <li>
              有料プランの料金、決済方法、提供内容、解約条件等は、別途定める案内に従うものとします。
            </li>
            <li>
              有料プランの料金は、事前の告知をもって変更することがあります。
            </li>
            <li>
              利用者都合による解約の場合、原則として既払い料金の返金は行いません。ただし、法令に別段の定めがある場合はこの限りではありません。
            </li>
            <li>
              決済に関するトラブルについては、利用者と決済事業者の間で解決するものとし、運営者は責任を負いません。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第4条（投稿および利用者の責任）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              利用者は、自身が投稿した交換投稿、ボトル情報、画像、補足条件等の内容について一切の責任を負います。
            </li>
            <li>
              利用者は、自身が適法に所有しているボトルのみを掲載するものとし、盗品、模造品、その他適法に取引できないボトルを掲載してはなりません。
            </li>
            <li>
              本サービス上のやり取りは原則として一般に公開されることを理解し、機微な情報を投稿しないものとします。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第5条（投稿コンテンツのライセンス）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              利用者は、本サービスに投稿した画像・テキスト等のコンテンツ（以下「投稿コンテンツ」）について、自身が適法な権利を有することを保証します。
            </li>
            <li>
              利用者は、運営者に対し、投稿コンテンツを本サービスの提供・運営・改善・プロモーションに必要な範囲で、無償かつ非独占的に利用する権利を許諾します。
            </li>
            <li>
              前項の許諾は、利用者が当該投稿コンテンツを削除またはアカウントを退会した時点で終了します。ただし、技術的な都合上、削除後も一定期間サーバー上に残存することがあります。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第6条（禁止事項）</h2>
          <p className="leading-7">利用者は、以下の行為を行ってはなりません。</p>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>法令または公序良俗に反する行為</li>
            <li>20歳未満の者への酒類の譲渡その他、酒類関連法令に違反する行為</li>
            <li>反復継続的・営利目的の販売行為であって、酒類販売業免許を取得していないもの</li>
            <li>盗品、模造品、表示と異なるボトルの掲載</li>
            <li>他人へのなりすまし、虚偽情報の登録、複数アカウントの不正使用</li>
            <li>他の利用者への嫌がらせ、迷惑行為、ハラスメント</li>
            <li>本サービスの運営を妨害する行為、不正アクセス、自動化されたスクレイピング</li>
            <li>知的財産権、プライバシー権、肖像権その他の第三者の権利を侵害する行為</li>
            <li>本サービスを通じて知り得た他者のX ID等を、当該取引と関係のない目的で利用すること</li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第7条（反社会的勢力の排除）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              利用者は、現在および将来にわたり、反社会的勢力（暴力団、暴力団員、暴力団関係企業・団体、総会屋、社会運動標榜ゴロ、特殊知能暴力集団等）に該当しないことを表明し、保証します。
            </li>
            <li>
              利用者が前項の表明・保証に反することが判明した場合、運営者は事前の通知なく当該利用者のアカウントを停止・削除することができます。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第8条（X IDの開示）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              X IDは、交換投稿に対する興味ありを受け取った投稿者が「相談開始」を選択した時点で、相談相手にのみ開示されます。
            </li>
            <li>
              X IDが開示された後の連絡・条件交渉は、X上のダイレクトメッセージ等、本サービスの外で利用者間の自己責任で行うものとします。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第9条（取引の見送りについて）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              ユーザーは、Xアカウント開示後であっても、自己の判断により取引相談を中断し、または見送ることができます。
            </li>
            <li>
              見送りの理由は問いません。体調・家庭の事情・その他さまざまな事情があることをご理解ください。相手方への理由の説明は不要です。
            </li>
            <li>
              取引を見送られた場合も、嫌がらせ・晒し行為・誹謗中傷・執拗な連絡などはご遠慮ください。気持ちよく使える場をみんなで守っていきましょう。
            </li>
            <li>
              やむを得ず悪質と判断される行為があった場合は、運営にて対応させていただくことがあります。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第10条（運営者の免責）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              運営者は、利用者間の取引、配送、金銭の授受、ボトルの品質・真贋・状態、引き渡しの遅延・不履行、破損、紛失、その他取引に起因する一切のトラブルについて責任を負いません。
            </li>
            <li>
              運営者は、本サービスの内容、提供される情報、ボトルの相場情報の正確性・完全性・有用性等について保証しません。
            </li>
            <li>
              運営者は、本サービスの中断、停止、終了、データの消失等によって利用者に生じた損害について、運営者の故意または重過失による場合を除き責任を負いません。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第11条（投稿の取り扱い・アカウント停止）</h2>
          <ol className="grid list-decimal gap-2 pl-5 leading-7">
            <li>
              運営者は、本規約違反のおそれがあると判断した場合、利用者への事前通知なく、投稿の非公開化、アカウントの停止、本サービスの利用制限を行うことができます。
            </li>
            <li>
              利用者はマイページから自身の交換投稿を非公開化・終了することができます。また、退会機能によりアカウントを削除することができます。
            </li>
          </ol>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第12条（サービスの変更・終了）</h2>
          <p className="leading-7">
            運営者は、利用者への事前の通知をもって、本サービスの内容を変更し、または提供を停止・終了することができます。緊急の場合は通知なく行うことがあります。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第13条（事業譲渡等）</h2>
          <p className="leading-7">
            運営者は、合併、会社分割、事業譲渡その他の組織再編または事業承継を行う場合、これに関連して利用者情報（個人情報を含む）を当該取引の相手方に開示・移転することができます。この場合、運営者は可能な範囲でその旨を事前に告知するよう努めますが、事前の告知が困難な場合は事後に通知することがあります。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第14条（規約の変更）</h2>
          <p className="leading-7">
            運営者は、必要と判断した場合に本規約を変更することができます。変更後の規約は本ページに掲載した時点で効力を生じ、変更後に本サービスを継続利用した利用者は変更に同意したものとみなします。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第15条（準拠法・裁判管轄）</h2>
          <p className="leading-7">
            本規約は日本法に準拠し、本サービスに関連して紛争が生じた場合は、運営者の本店所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold text-stone-950">第16条（お問い合わせ）</h2>
          <p className="leading-7">
            本規約および本サービスに関するお問い合わせは、運営者までご連絡ください。連絡先は
            <Link href="/privacy" className="underline underline-offset-4">
              プライバシーポリシー
            </Link>
            に記載しています。
          </p>
        </section>
      </article>
    </PageShell>
  );
}
