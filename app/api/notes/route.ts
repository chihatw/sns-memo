import { NextRequest, NextResponse } from 'next/server'
import { getNotes, createNote } from '@/lib/queries'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const from   = searchParams.get('from')   ?? undefined
  const to     = searchParams.get('to')     ?? undefined
  const tagIds = searchParams.getAll('tagId')
  const q      = searchParams.get('q')      ?? ''

  const notes = await getNotes({ from, to, tagIds, q })
  return NextResponse.json(notes)
}

export async function POST(req: NextRequest) {
  const { title, content, tags } = await req.json()
  const note = await createNote(title ?? '', content ?? '', tags ?? [])
  return NextResponse.json(note, { status: 201 })
}
