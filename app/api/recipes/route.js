import { NextResponse } from 'next/server'
import { getAll, insert } from '../../../lib/db.js'

export async function GET() {
  return NextResponse.json(getAll())
}

export async function POST(request) {
  const data = await request.json()
  const recipe = { ...data, id: crypto.randomUUID(), createdAt: Date.now() }
  insert(recipe)
  return NextResponse.json(recipe, { status: 201 })
}
