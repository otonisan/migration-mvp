'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 text-center">
          {/* キャンセルアイコン */}
          <div className="text-8xl mb-6">❌</div>

          {/* タイトル */}
          <h1 className="text-5xl font-bold text-white mb-4">
            決済がキャンセルされました
          </h1>

          <p className="text-2xl text-purple-200 mb-8">
            お支払いは完了していません
          </p>

          {/* メッセージ */}
          <div className="bg-white/5 rounded-2xl p-6 mb-8">
            <p className="text-purple-100 mb-4">
              決済処理がキャンセルされました。アカウントから料金は引き落とされていません。
            </p>
            <p className="text-purple-100">
              再度購入をご希望の場合は、料金プランページからお手続きください。
            </p>
          </div>

          {/* よくある質問 */}
          <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-xl font-bold text-white mb-4">よくある質問</h3>
            <div className="space-y-4">
              <div>
                <p className="text-purple-200 font-semibold mb-1">決済情報は保存されますか？</p>
                <p className="text-purple-100 text-sm">いいえ、キャンセルされた決済情報は保存されません。</p>
              </div>
              <div>
                <p className="text-purple-200 font-semibold mb-1">料金は請求されますか？</p>
                <p className="text-purple-100 text-sm">いいえ、キャンセルされた場合は一切請求されません。</p>
              </div>
              <div>
                <p className="text-purple-200 font-semibold mb-1">再度購入できますか？</p>
                <p className="text-purple-100 text-sm">はい、いつでも料金プランページから再度お申し込みいただけます。</p>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-4">
            <Link
              href="/pricing"
              className="block w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
            >
              料金プランを見る
            </Link>
            <Link
              href="/"
              className="block w-full py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              ホームに戻る
            </Link>
          </div>

          {/* サポート情報 */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-purple-200 text-sm">
              決済に関するご質問は、
              <Link href="/dashboard/support" className="text-white hover:underline ml-1">
                サポートページ
              </Link>
              からお問い合わせください
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}