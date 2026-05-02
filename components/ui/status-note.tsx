import { AlertCircle, Database } from "lucide-react";

export function DataStatusNote({
  isConfigured,
  error,
}: {
  isConfigured: boolean;
  error: string | null;
}) {
  if (!error && isConfigured) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      {isConfigured ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      ) : (
        <Database className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      )}
      <p>
        {isConfigured
          ? `Supabase公開ビューの取得でエラーが発生しました: ${error}`
          : "Supabase環境変数が未設定です。.env.local に接続情報を入れると公開ビューから読み込みます。"}
      </p>
    </div>
  );
}
