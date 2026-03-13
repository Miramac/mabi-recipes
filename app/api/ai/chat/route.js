import { NextResponse } from 'next/server'
import { AI_MODEL, AI_API_VERSION } from '../../../../lib/aiConfig'

export async function POST(request) {
  const { messages, recipes = [], lang = 'en' } = await request.json()

  const langInstruction = lang === 'de'
    ? ' Always respond in German.'
    : ' Always respond in English.'

  const recipeList = recipes
    .map(r => `- ${r.title} (${r.category}, ${r.time} min, ${r.servings} servings): ${r.description || ''}`)
    .join('\n')

  const systemPrompt = `You are a helpful cooking assistant for Mabi Recipes. You know the following recipes:\n\n${recipeList}\n\nHelp users with cooking questions, suggest recipes from the list, answer questions about ingredients or preparation, and give cooking tips.${langInstruction} Keep answers concise.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': AI_API_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    let error = 'unknown'
    try { error = JSON.parse(body).error?.type ?? 'unknown' } catch {}
    return NextResponse.json({ error }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json({ reply: data.content[0].text })
}
