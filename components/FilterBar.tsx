'use client';
import { Tag } from '@/lib/types';
import { Search, X } from 'lucide-react';

type Props = {
  from: string;
  to: string;
  selectedTagIds: string[];
  q: string;
  allTags: Tag[];
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onTagToggle: (id: string) => void;
  onQChange: (v: string) => void;
  onClear: () => void;
};

export default function FilterBar({
  from,
  to,
  selectedTagIds,
  q,
  allTags,
  onFromChange,
  onToChange,
  onTagToggle,
  onQChange,
  onClear,
}: Props) {
  const hasFilter = from || to || selectedTagIds.length > 0 || q;

  return (
    <div className='flex flex-col gap-3'>
      {/* 検索・期間行 */}
      <div className='flex flex-wrap gap-2 items-center'>
        {/* 全文検索 */}
        <div className='relative flex-1 min-w-[180px]'>
          <Search
            size={13}
            className='absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-700'
          />
          <input
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            placeholder='タイトル・本文を検索'
            className='w-full pl-8 pr-3 py-1.5 rounded-md bg-white border border-gray-400 text-sm text-gray-900 placeholder:text-gray-700 outline-none focus:border-gray-600/50 transition-colors'
          />
        </div>

        {/* 期間 */}
        <div className='flex items-center gap-1.5'>
          <input
            type='date'
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className='px-2 py-1.5 rounded-md bg-white border border-gray-400 text-sm text-gray-900 outline-none focus:border-gray-600/50 transition-colors [color-scheme:light]'
          />
          <span className='text-gray-700 text-xs'>〜</span>
          <input
            type='date'
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className='px-2 py-1.5 rounded-md bg-white border border-gray-400 text-sm text-gray-900 outline-none focus:border-gray-600/50 transition-colors [color-scheme:light]'
          />
        </div>

        {/* クリアボタン */}
        {hasFilter && (
          <button
            onClick={onClear}
            className='flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs text-gray-700 hover:text-gray-900 border border-gray-400 hover:border-gray-700 transition-colors'
          >
            <X size={11} /> クリア
          </button>
        )}
      </div>

      {/* タグフィルター */}
      {allTags.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {allTags.map((tag) => {
            const active = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                  active
                    ? 'bg-gray-600/25 text-gray-600 border-gray-600/50'
                    : 'bg-transparent text-gray-700 border-gray-400 hover:border-gray-600/30 hover:text-gray-600/60'
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
