import { getDb } from './db'
import { Note, Tag } from './types'

export async function migrate() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title      TEXT NOT NULL DEFAULT '',
      content    TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS tags (
      id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS note_tags (
      note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
      tag_id  UUID NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
      PRIMARY KEY (note_id, tag_id)
    )
  `
}

export async function getNotes(params: {
  from?: string
  to?: string
  tagIds?: string[]
  q?: string
}): Promise<Note[]> {
  const sql = getDb()
  const { from, to, tagIds, q } = params
  const fromVal = from || null
  const toVal   = to   || null
  const qVal    = q    || ''

  if (tagIds && tagIds.length > 0) {
    const rows = await sql`
      SELECT
        n.id, n.title, n.content,
        n.created_at, n.updated_at,
        COALESCE(
          json_agg(json_build_object('id', t.id, 'name', t.name))
          FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM notes n
      LEFT JOIN note_tags nt ON nt.note_id = n.id
      LEFT JOIN tags t ON t.id = nt.tag_id
      WHERE n.id IN (
        SELECT note_id FROM note_tags WHERE tag_id = ANY(${tagIds}::uuid[])
      )
      AND (${fromVal}::timestamptz IS NULL OR n.created_at >= ${fromVal}::timestamptz)
      AND (${toVal}::timestamptz   IS NULL OR n.created_at <= (${toVal}::timestamptz + interval '1 day'))
      AND (${qVal} = '' OR n.title ILIKE ${'%' + qVal + '%'} OR n.content ILIKE ${'%' + qVal + '%'})
      GROUP BY n.id
      ORDER BY n.created_at DESC
    `
    return rows as Note[]
  }

  const rows = await sql`
    SELECT
      n.id, n.title, n.content,
      n.created_at, n.updated_at,
      COALESCE(
        json_agg(json_build_object('id', t.id, 'name', t.name))
        FILTER (WHERE t.id IS NOT NULL), '[]'
      ) AS tags
    FROM notes n
    LEFT JOIN note_tags nt ON nt.note_id = n.id
    LEFT JOIN tags t ON t.id = nt.tag_id
    WHERE (${fromVal}::timestamptz IS NULL OR n.created_at >= ${fromVal}::timestamptz)
    AND   (${toVal}::timestamptz   IS NULL OR n.created_at <= (${toVal}::timestamptz + interval '1 day'))
    AND   (${qVal} = '' OR n.title ILIKE ${'%' + qVal + '%'} OR n.content ILIKE ${'%' + qVal + '%'})
    GROUP BY n.id
    ORDER BY n.created_at DESC
  `
  return rows as Note[]
}

export async function getNoteById(id: string): Promise<Note | null> {
  const sql = getDb()
  const rows = await sql`
    SELECT
      n.id, n.title, n.content,
      n.created_at, n.updated_at,
      COALESCE(
        json_agg(json_build_object('id', t.id, 'name', t.name))
        FILTER (WHERE t.id IS NOT NULL), '[]'
      ) AS tags
    FROM notes n
    LEFT JOIN note_tags nt ON nt.note_id = n.id
    LEFT JOIN tags t ON t.id = nt.tag_id
    WHERE n.id = ${id}
    GROUP BY n.id
  `
  return (rows[0] as Note) ?? null
}

export async function createNote(title: string, content: string, tagNames: string[]): Promise<Note> {
  const sql = getDb()
  const [note] = await sql`
    INSERT INTO notes (title, content) VALUES (${title}, ${content})
    RETURNING id
  `
  if (tagNames.length > 0) await syncTags(note.id, tagNames)
  return getNoteById(note.id) as Promise<Note>
}

export async function updateNote(id: string, title: string, content: string, tagNames: string[]): Promise<Note> {
  const sql = getDb()
  await sql`
    UPDATE notes SET title = ${title}, content = ${content}, updated_at = now()
    WHERE id = ${id}
  `
  await syncTags(id, tagNames)
  return getNoteById(id) as Promise<Note>
}

export async function deleteNote(id: string): Promise<void> {
  const sql = getDb()
  await sql`DELETE FROM notes WHERE id = ${id}`
}

export async function getAllTags(): Promise<Tag[]> {
  const sql = getDb()
  const rows = await sql`SELECT id, name FROM tags ORDER BY name`
  return rows as Tag[]
}

async function syncTags(noteId: string, tagNames: string[]): Promise<void> {
  const sql = getDb()
  await sql`DELETE FROM note_tags WHERE note_id = ${noteId}`
  if (tagNames.length === 0) return
  for (const name of tagNames) {
    const trimmed = name.trim()
    if (!trimmed) continue
    const [tag] = await sql`
      INSERT INTO tags (name) VALUES (${trimmed})
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `
    await sql`
      INSERT INTO note_tags (note_id, tag_id) VALUES (${noteId}, ${tag.id})
      ON CONFLICT DO NOTHING
    `
  }
}
