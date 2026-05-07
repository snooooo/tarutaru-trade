import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "お問い合わせ | TaruTaruTrade",
  description:
    "TaruTaruTradeへのお問い合わせはこちらから。ご質問・ご要望・不具合のご報告をお受けしています。",
};

export default function ContactPage() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-lg gap-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-950"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            トップに戻る
          </Link>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-500">Contact</p>
          <h1 className="mt-1 text-3xl font-semibold text-stone-950">
            お問い合わせ
          </h1>
          <p className="mt-3 leading-7 text-stone-600">
            サービスに関するご質問・ご要望・不具合のご報告などは、以下のフォームよりご連絡ください。
          </p>
        </div>

        <ContactForm />
      </section>
    </PageShell>
  );
}
