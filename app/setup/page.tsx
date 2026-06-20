'use client'
import { useState } from 'react'

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')

  const run = async () => {
    setStatus('running')
    const res = await fetch('/api/migrate', { method: 'POST' })
    setStatus(res.ok ? 'done' : 'error')
  }

  return (
    <main className="min-h-screen bg-[#071210] flex items-center justify-center">
      <div className="p-8 rounded-xl border border-[#2a4a35] bg-[#0d1f15] text-center max-w-sm w-full">
        <h1 className="text-lg font-semibold text-[#f0f7f1] mb-2">初期セットアップ</h1>
        <p className="text-sm text-[#4a6a55] mb-6">
          Neonにテーブルを作成します。<br />初回デプロイ後に一度だけ実行してください。
        </p>
        <button
          onClick={run}
          disabled={status !== 'idle'}
          className="px-6 py-2 rounded-md bg-[#b5e48c]/20 text-[#b5e48c] border border-[#b5e48c]/30 hover:bg-[#b5e48c]/30 disabled:opacity-40 transition-colors"
        >
          {status === 'idle' && 'テーブルを作成する'}
          {status === 'running' && '実行中…'}
          {status === 'done' && '✓ 完了しました'}
          {status === 'error' && '× エラーが発生しました'}
        </button>
        {status === 'done' && (
          <p className="mt-4 text-sm text-[#4a6a55]">
            <a href="/" className="text-[#b5e48c] hover:underline">トップページへ →</a>
          </p>
        )}
      </div>
    </main>
  )
}
