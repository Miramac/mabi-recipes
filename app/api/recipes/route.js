import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getAll, insert } from '../../../lib/db.js'
import { auth } from '../../../lib/auth.js'

export async function GET() {
  return NextResponse.json(getAll())
}

export async function POST(request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const recipe = { ...data, id: crypto.randomUUID(), createdAt: Date.now(), updatedAt: Date.now(), createdBy: session.user.name }
  insert(recipe)
  return NextResponse.json(recipe, { status: 201 })
}
