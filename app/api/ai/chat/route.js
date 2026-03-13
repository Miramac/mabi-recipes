import { NextResponse } from 'next/server'
import { AI_MODEL, AI_API_VERSION } from '../../../../lib/aiConfig'

export async function POST(request) {
  const { messages, recipes = [], currentRecipe = null, lang = 'en' } = await request.json()

  const langInstruction = lang === 'de'
    ? ' Always respond in German.'
    : ' Always respond in English.'

  const currentRecipeSection = currentRecipe
    ? `The user is currently viewing this recipe — treat it as the primary context:\n\nTitle: ${currentRecipe.title}\nCategory: ${currentRecipe.category}\nTime: ${currentRecipe.time} min\nServings: ${currentRecipe.servings}\nDescription: ${currentRecipe.description || '—'}\nIngredients:\n${currentRecipe.ingredients.map(i => `  - ${i}`).join('\n')}\nSteps:\n${currentRecipe.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}\n\n`
    : ''

  const recipeList = recipes
    .filter(r => !currentRecipe || r.id !== currentRecipe.id)
    .map(r => `- ${r.title} (${r.category}, ${r.time} min)`)
    .join('\n')

  const otherRecipesSection = recipeList
    ? `Other available recipes:\n${recipeList}\n\n`
    : ''

  const systemPrompt = `You are a helpful cooking assistant for Mabi Recipes. ${currentRecipeSection}${otherRecipesSection}Help users with cooking questions, answer questions about ingredients or preparation, suggest substitutions, and give cooking tips.${langInstruction} Keep answers concise. Do not use markdown formatting — no asterisks, no bold, no bullet dashes, just plain text.`

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
