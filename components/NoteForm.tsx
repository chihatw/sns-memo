'use client';
import { Tag } from '@/lib/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import TagInput from './TagInput';

type Props = {
  allTags: Tag[];
  onSave: (title: string, content: string, tags: string[]) => Promise<void>;
};

export default function NoteForm({ allTags, onSave }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setTitle('');
    setContent('');
    setTags([]);
    setExpanded(false);
  };

  const handleSave = async () => {
    if (!content.trim() && !title.trim()) return;
    setSaving(true);
    await onSave(title, content, tags);
    setSaving(false);
    reset();
  };

  return (
    <div className='rounded-xl border border-gray-400 bg-white shadow-lg overflow-hidden transition-all'>
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className='w-full flex items-center gap-3 px-4 py-3.5 text-left text-gray-700 hover:text-gray-600/70 transition-colors group'
        >
          <Plus
            size={16}
            className='group-hover:rotate-90 transition-transform duration-200'
          />
          <span className='text-sm'>メモを書く…</span>
        </button>
      ) : (
        <div className='p-4 flex flex-col gap-3'>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='タイトル（任意）'
            className='w-full bg-transparent text-gray-950 font-medium text-base placeholder:text-gray-600 outline-none'
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='内容を入力…'
            rows={4}
            className='w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-600 outline-none resize-none leading-relaxed'
          />
          <TagInput value={tags} onChange={setTags} suggestions={allTags} />
          <div className='flex justify-end gap-2 pt-1'>
            <button
              onClick={reset}
              className='px-4 py-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors'
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (!content.trim() && !title.trim())}
              className='px-4 py-1.5 text-sm font-medium rounded-md bg-gray-600/20 text-gray-600 border border-gray-600/30 hover:bg-gray-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
            >
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
