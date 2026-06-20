import { NextResponse } from 'next/server'
import { migrate } from '@/lib/queries'

export async function POST() {
  await migrate()
  return NextResponse.json({ ok: true })
}
