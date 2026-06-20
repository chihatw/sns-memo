'use client'
import { useState } from 'react'
import { Tag } from '@/lib/types'
import TagInput from './TagInput'
import { Plus } from 'lucide-react'

type Props = {
  allTags: Tag[]
  onSave: (title: string, content: string, tags: string[]) => Promise<void>
}

export default function NoteForm({ allTags, onSave }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle]     = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags]       = useState<string[]>([])
  const [saving, setSaving]   = useState(false)

  const reset = () => {
    setTitle(''); setContent(''); setTags([]); setExpanded(false)
  }

  const handleSave = async () => {
    if (!content.trim() && !title.trim()) return
    setSaving(true)
    await onSave(title, content, tags)
    setSaving(false)
    reset()
  }

  return (
    <div className="rounded-xl border border-[#2a4a35] bg-[#0d1f15] shadow-lg overflow-hidden transition-all">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-[#4a6a55] hover:text-[#b5e48c]/70 transition-colors group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
          <span className="text-sm">メモを書く…</span>
        </button>
      ) : (
        <div className="p-4 flex flex-col gap-3">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="タイトル（任意）"
            className="w-full bg-transparent text-[#f0f7f1] font-medium text-base placeholder:text-[#3a5a45] outline-none"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="内容を入力…"
            rows={4}
            className="w-full bg-transparent text-sm text-[#d4e8d8] placeholder:text-[#3a5a45] outline-none resize-none leading-relaxed"
          />
          <TagInput value={tags} onChange={setTags} suggestions={allTags} />
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={reset}
              className="px-4 py-1.5 text-sm text-[#4a6a55] hover:text-[#d4e8d8] transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (!content.trim() && !title.trim())}
              className="px-4 py-1.5 text-sm font-medium rounded-md bg-[#b5e48c]/20 text-[#b5e48c] border border-[#b5e48c]/30 hover:bg-[#b5e48c]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
