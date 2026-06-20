import { NextRequest, NextResponse } from 'next/server'
import { updateNote, deleteNote } from '@/lib/queries'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { title, content, tags } = await req.json()
  const note = await updateNote(id, title ?? '', content ?? '', tags ?? [])
  return NextResponse.json(note)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteNote(id)
  return NextResponse.json({ ok: true })
}
