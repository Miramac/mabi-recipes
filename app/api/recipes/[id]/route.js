import { NextResponse } from 'next/server'
import { getById, update, remove } from '../../../../lib/db.js'

export async function GET(request, { params }) {
  const recipe = getById(params.id)
  if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(recipe)
}

export async function PUT(request, { params }) {
  if (!getById(params.id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const data = await request.json()
  update(params.id, data)
  return NextResponse.json(getById(params.id))
}

export async function DELETE(request, { params }) {
  remove(params.id)
  return new Response(null, { status: 204 })
}
