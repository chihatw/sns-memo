'use client'
import { useState } from 'react'
import { Note, Tag } from '@/lib/types'
import TagInput from './TagInput'
import { Trash2, Pencil, Check, X } from 'lucide-react'

type Props = {
  note: Note
  allTags: Tag[]
  onUpdate: (id: string, title: string, content: string, tags: string[]) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function NoteCard({ note, allTags, onUpdate, onDelete }: Props) {
  const [editing, setEditing]   = useState(false)
  const [title, setTitle]       = useState(note.title)
  const [content, setContent]   = useState(note.content)
  const [tags, setTags]         = useState<string[]>(note.tags.map(t => t.name))
  const [saving, setSaving]     = useState(false)
  const [confirming, setConfirming] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(note.id, title, content, tags)
    setSaving(false)
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags.map(t => t.name))
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); return }
    await onDelete(note.id)
  }

  const dateStr = new Date(note.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })

  return (
    <div className="group relative rounded-xl border border-[#2a4a35] bg-[#0d1f15] hover:border-[#b5e48c]/40 transition-all duration-200 overflow-hidden">
      {/* アクションボタン */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-1.5 rounded-md bg-[#b5e48c]/20 text-[#b5e48c] hover:bg-[#b5e48c]/30 transition-colors"
            >
              <Check size={13} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-md text-[#4a6a55] hover:text-[#d4e8d8] transition-colors"
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-md text-[#4a6a55] hover:text-[#b5e48c] transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDelete}
              onBlur={() => setConfirming(false)}
              className={`p-1.5 rounded-md transition-colors ${
                confirming
                  ? 'bg-red-900/40 text-red-400 border border-red-700/50'
                  : 'text-[#4a6a55] hover:text-red-400'
              }`}
              title={confirming ? 'もう一度クリックで削除' : '削除'}
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2.5">
        {/* タイトル */}
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent text-[#f0f7f1] font-medium text-sm outline-none border-b border-[#2a4a35] pb-1 pr-16"
            placeholder="タイトル（任意）"
          />
        ) : (
          note.title && (
            <p className="text-sm font-semibold text-[#f0f7f1] leading-snug pr-16 tracking-wide">
              {note.title}
            </p>
          )
        )}

        {/* 本文 */}
        {editing ? (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            className="w-full bg-transparent text-sm text-[#d4e8d8] outline-none resize-none leading-relaxed"
          />
        ) : (
          <p className="text-sm text-[#8aab94] leading-relaxed whitespace-pre-wrap line-clamp-4">
            {note.content}
          </p>
        )}

        {/* タグ */}
        {editing ? (
          <TagInput value={tags} onChange={setTags} suggestions={allTags} />
        ) : (
          note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#b5e48c]/10 text-[#b5e48c]/80 border border-[#b5e48c]/20 hover:bg-[#b5e48c]/20 hover:border-[#b5e48c]/40 transition-colors cursor-default"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )
        )}

        {/* 作成日時 */}
        <p className="text-[10px] text-[#3a5a45] tracking-wider mt-0.5">{dateStr}</p>
      </div>
    </div>
  )
}
