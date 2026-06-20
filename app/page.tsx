'use client';
import FilterBar from '@/components/FilterBar';
import NoteCard from '@/components/NoteCard';
import NoteForm from '@/components/NoteForm';
import { Note, Tag } from '@/lib/types';
import { Sprout } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    const res = await fetch('/api/tags');
    setAllTags(await res.json());
  }, []);

  const fetchNotes = useCallback(async () => {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    selectedTagIds.forEach((id) => params.append('tagId', id));
    if (q) params.set('q', q);

    setLoading(true);
    const res = await fetch(`/api/notes?${params}`);
    setNotes(await res.json());
    setLoading(false);
  }, [from, to, selectedTagIds, q]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = async (
    title: string,
    content: string,
    tags: string[],
  ) => {
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags }),
    });
    await fetchTags();
    await fetchNotes();
  };

  const handleUpdate = async (
    id: string,
    title: string,
    content: string,
    tags: string[],
  ) => {
    await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags }),
    });
    await fetchTags();
    await fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    await fetchNotes();
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const clearFilter = () => {
    setFrom('');
    setTo('');
    setSelectedTagIds([]);
    setQ('');
  };

  return (
    <main className='min-h-screen text-gray-900'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* ヘッダー */}
        <header className='flex items-center gap-2.5 mb-8'>
          <Sprout size={20} className='text-gray-600' />
          <h1 className='text-base font-semibold text-gray-950 tracking-widest uppercase'>
            sns memo
          </h1>
        </header>

        {/* 新規作成フォーム */}
        <div className='mb-6'>
          <NoteForm allTags={allTags} onSave={handleCreate} />
        </div>

        {/* フィルター */}
        <div className='mb-6 p-4 rounded-xl border border-gray-400 bg-white'>
          <FilterBar
            from={from}
            to={to}
            selectedTagIds={selectedTagIds}
            q={q}
            allTags={allTags}
            onFromChange={setFrom}
            onToChange={setTo}
            onTagToggle={toggleTag}
            onQChange={setQ}
            onClear={clearFilter}
          />
        </div>

        {/* メモ件数 */}
        <div className='mb-4 text-xs text-gray-600 tracking-wider'>
          {loading ? '読み込み中…' : `${notes.length} 件`}
        </div>

        {/* メモグリッド */}
        {!loading && notes.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-gray-200'>
            <Sprout size={32} className='mb-3 opacity-40' />
            <p className='text-sm'>メモがありません</p>
          </div>
        ) : (
          <div className='columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4'>
            {notes.map((note) => (
              <div key={note.id} className='break-inside-avoid'>
                <NoteCard
                  note={note}
                  allTags={allTags}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
