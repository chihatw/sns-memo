'use client';
import { Tag } from '@/lib/types';
import { X } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions: Tag[];
};

export default function TagInput({ value, onChange, suggestions }: Props) {
  const [input, setInput] = useState('');

  const addTag = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const removeTag = (name: string) => {
    onChange(value.filter((t) => t !== name));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const filtered = suggestions
    .filter(
      (s) =>
        s.name.toLowerCase().includes(input.toLowerCase()) &&
        !value.includes(s.name),
    )
    .slice(0, 6);

  return (
    <div className='relative'>
      <div className='flex flex-wrap gap-1.5 items-center min-h-[36px] px-2 py-1.5 rounded-md bg-white border border-gray-400 focus-within:border-gray-600/60 transition-colors'>
        {value.map((tag) => (
          <span
            key={tag}
            className='flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600/15 text-gray-600 border border-gray-600/30'
          >
            {tag}
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='hover:text-gray-950 transition-colors'
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? 'タグを入力… Enter で追加' : ''}
          className='flex-1 min-w-[120px] bg-transparent text-sm text-gray-900 placeholder:text-gray-700 outline-none'
        />
      </div>

      {input && filtered.length > 0 && (
        <ul className='absolute z-10 top-full mt-1 w-full rounded-md border border-gray-400 bg-white shadow-lg overflow-hidden'>
          {filtered.map((s) => (
            <li key={s.id}>
              <button
                type='button'
                onClick={() => addTag(s.name)}
                className='w-full text-left px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-600/10 transition-colors'
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
