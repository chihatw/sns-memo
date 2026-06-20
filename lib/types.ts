export type Tag = {
  id: string
  name: string
}

export type Note = {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  tags: Tag[]
}

export type NoteInput = {
  title: string
  content: string
  tags: string[]  // タグ名の配列
}
