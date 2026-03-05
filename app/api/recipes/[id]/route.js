import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getById, update, remove } from '../../../../lib/db.js'
import { auth } from '../../../../lib/auth.js'

export async function GET(request, { params }) {
  const { id } = await params
  const recipe = getById(id)
  if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(recipe)
}

export async function PUT(request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (!getById(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const data = await request.json()
  update(id, data)
  return NextResponse.json(getById(id))
}

export async function DELETE(request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  remove(id)
  return new Response(null, { status: 204 })
}
