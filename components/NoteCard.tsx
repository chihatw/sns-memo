'use client';
import { Note, Tag } from '@/lib/types';
import { Check, ChevronDown, ChevronUp, Pencil, Trash2, X } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import TagInput from './TagInput';

type Props = {
  note: Note;
  allTags: Tag[];
  onUpdate: (
    id: string,
    title: string,
    content: string,
    tags: string[],
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function NoteCard({ note, allTags, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags.map((t) => t.name));
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // 本文の展開/折りたたみ
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false); // 実際に4行を超えて省略されているか
  const contentRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (editing || expanded) return;
    const el = contentRef.current;
    if (!el) return;
    // 折りたたみ状態でscrollHeightとclientHeightを比較し、省略の有無を判定
    setClamped(el.scrollHeight - el.clientHeight > 1);
  }, [note.content, editing, expanded]);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(note.id, title, content, tags);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.map((t) => t.name));
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    await onDelete(note.id);
  };

  const dateStr = new Date(note.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className='group relative rounded-xl border border-gray-400 bg-white hover:border-gray-600/40 transition-all duration-200 overflow-hidden'>
      {/* アクションボタン */}
      <div className='absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity'>
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className='p-1.5 rounded-md bg-gray-600/20 text-gray-600 hover:bg-gray-600/30 transition-colors'
            >
              <Check size={13} />
            </button>
            <button
              onClick={handleCancel}
              className='p-1.5 rounded-md text-gray-700 hover:text-gray-900 transition-colors'
            >
              <X size={13} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className='p-1.5 rounded-md text-gray-700 hover:text-gray-600 transition-colors'
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={handleDelete}
              onBlur={() => setConfirming(false)}
              className={`p-1.5 rounded-md transition-colors ${
                confirming
                  ? 'bg-red-50 text-red-600 border border-red-300'
                  : 'text-gray-700 hover:text-red-500'
              }`}
              title={confirming ? 'もう一度クリックで削除' : '削除'}
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>

      <div className='p-4 flex flex-col gap-2.5'>
        {/* タイトル */}
        {editing ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full bg-transparent text-gray-950 font-medium text-sm outline-none border-b border-gray-400 pb-1 pr-16'
            placeholder='タイトル（任意）'
          />
        ) : (
          note.title && (
            <p className='text-sm font-semibold text-gray-950 leading-snug pr-16 tracking-wide'>
              {note.title}
            </p>
          )
        )}

        {/* 本文 */}
        {editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className='w-full bg-transparent text-sm text-gray-900 outline-none resize-none leading-relaxed'
          />
        ) : (
          <div>
            <p
              ref={contentRef}
              onClick={() => clamped && setExpanded((v) => !v)}
              className={`text-sm text-gray-800 leading-relaxed whitespace-pre-wrap ${
                expanded ? '' : 'line-clamp-4'
              } ${clamped ? 'cursor-pointer' : ''}`}
            >
              {note.content}
            </p>
            {clamped && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className='flex items-center gap-0.5 text-xs text-gray-600 hover:text-gray-600/70 transition-colors mt-1'
              >
                {expanded ? (
                  <>
                    折りたたむ <ChevronUp size={12} />
                  </>
                ) : (
                  <>
                    続きを読む <ChevronDown size={12} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* タグ */}
        {editing ? (
          <TagInput value={tags} onChange={setTags} suggestions={allTags} />
        ) : (
          note.tags.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {note.tags.map((tag) => (
                <span
                  key={tag.id}
                  className='px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600/10 text-gray-600/80 border border-gray-600/20 hover:bg-gray-600/20 hover:border-gray-600/40 transition-colors cursor-default'
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )
        )}

        {/* 作成日時 */}
        <p className='text-[10px] text-gray-600 tracking-wider mt-0.5'>
          {dateStr}
        </p>
      </div>
    </div>
  );
}
