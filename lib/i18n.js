const translations = {
  en: {
    // Layout
    appName: 'Mabi Recipes',
    allRecipes: 'All Recipes',
    addRecipe: 'Add Recipe',
    navRecipes: 'Recipes',
    navAdd: 'Add',

    // Categories
    catAll: 'All',
    catBreakfast: 'Breakfast',
    catLunch: 'Lunch',
    catDinner: 'Dinner',
    catDessert: 'Dessert',
    catSnack: 'Snack',

    // HomePage
    heroTitle: 'Your Recipes',
    recipeCount: (n) => `${n} recipe${n !== 1 ? 's' : ''} saved`,
    searchPlaceholder: 'Search recipes...',
    noRecipesFound: 'No recipes found',
    noRecipesHint: 'Try a different search or category',

    // DetailPage
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    servings: 'servings',
    edit: 'Edit',
    recipeNotFound: 'Recipe not found',
    backToRecipes: '← Back to recipes',
    deleteConfirm: (title) => `Delete "${title}"?`,
    createdBy: (name) => `Added by ${name}`,
    updatedBy: (name, date) => `Last edited by ${name} on ${date}`,

    // FormPage
    newRecipe: 'New Recipe',
    editRecipe: 'Edit Recipe',
    labelTitle: 'Title *',
    labelDescription: 'Description',
    labelImage: 'Image URL',
    labelCategory: 'Category',
    labelTime: 'Time (min) *',
    labelServings: 'Servings *',
    labelIngredients: 'Ingredients *',
    labelInstructions: 'Instructions *',
    addIngredient: 'Add ingredient',
    addStep: 'Add step',
    saveChanges: 'Save Changes',
    saveRecipe: 'Save Recipe',
    generateWithAI: 'Generate with AI',
    generating: 'Generating…',
    fixWithAI: 'Fix with AI',
    placeholderTitle: 'e.g. Spaghetti Carbonara',
    placeholderDescription: 'A short description of the dish...',
    placeholderImage: 'https://...',
    placeholderTime: '30',
    placeholderServings: '4',
    errorTitle: 'Title is required.',
    errorTime: 'Please enter a valid time in minutes.',
    errorServings: 'Please enter a valid number of servings.',
    errorIngredients: 'Add at least one ingredient.',
    errorSteps: 'Add at least one step.',
    aiErrorOverloaded: 'AI is busy — please try again in a moment.',
    aiErrorAuth: 'Invalid API key. Check your .env file.',
    aiErrorNetwork: 'Network error. Check your connection.',
    aiErrorGeneric: 'AI request failed. Please try again.',

    // Auth
    loginTitle: 'Sign In',
    registerTitle: 'Create Account',
    labelName: 'Name',
    labelEmail: 'Email',
    labelEmailOrUsername: 'Email or Username',
    labelPassword: 'Password',
    loginSubmit: 'Sign In',
    registerSubmit: 'Create Account',
    errorUsernameTaken: 'This username is already taken.',
    loginLink: 'Already have an account? Sign in',
    registerLink: "Don't have an account? Register",
    logoutButton: 'Sign Out',
    authRequired: 'Please sign in to continue.',
  },

  de: {
    // Layout
    appName: 'Mabi Rezepte',
    allRecipes: 'Alle Rezepte',
    addRecipe: 'Rezept hinzufügen',
    navRecipes: 'Rezepte',
    navAdd: 'Neu',

    // Categories
    catAll: 'Alle',
    catBreakfast: 'Frühstück',
    catLunch: 'Mittagessen',
    catDinner: 'Abendessen',
    catDessert: 'Dessert',
    catSnack: 'Snack',

    // HomePage
    heroTitle: 'Deine Rezepte',
    recipeCount: (n) => `${n} Rezept${n !== 1 ? 'e' : ''} gespeichert`,
    searchPlaceholder: 'Rezepte suchen...',
    noRecipesFound: 'Keine Rezepte gefunden',
    noRecipesHint: 'Versuche eine andere Suche oder Kategorie',

    // DetailPage
    ingredients: 'Zutaten',
    instructions: 'Zubereitung',
    servings: 'Portionen',
    edit: 'Bearbeiten',
    recipeNotFound: 'Rezept nicht gefunden',
    backToRecipes: '← Zurück zu den Rezepten',
    deleteConfirm: (title) => `"${title}" löschen?`,
    createdBy: (name) => `Hinzugefügt von ${name}`,
    updatedBy: (name, date) => `Zuletzt bearbeitet von ${name} am ${date}`,

    // FormPage
    newRecipe: 'Neues Rezept',
    editRecipe: 'Rezept bearbeiten',
    labelTitle: 'Titel *',
    labelDescription: 'Beschreibung',
    labelImage: 'Bild-URL',
    labelCategory: 'Kategorie',
    labelTime: 'Zeit (Min) *',
    labelServings: 'Portionen *',
    labelIngredients: 'Zutaten *',
    labelInstructions: 'Zubereitung *',
    addIngredient: 'Zutat hinzufügen',
    addStep: 'Schritt hinzufügen',
    saveChanges: 'Änderungen speichern',
    saveRecipe: 'Rezept speichern',
    generateWithAI: 'Mit KI generieren',
    generating: 'Generiere…',
    fixWithAI: 'Mit KI verbessern',
    placeholderTitle: 'z.B. Spaghetti Carbonara',
    placeholderDescription: 'Eine kurze Beschreibung des Gerichts...',
    placeholderImage: 'https://...',
    placeholderTime: '30',
    placeholderServings: '4',
    errorTitle: 'Titel ist erforderlich.',
    errorTime: 'Bitte gib eine gültige Zeit in Minuten ein.',
    errorServings: 'Bitte gib eine gültige Portionenzahl ein.',
    errorIngredients: 'Füge mindestens eine Zutat hinzu.',
    errorSteps: 'Füge mindestens einen Schritt hinzu.',
    aiErrorOverloaded: 'KI ist ausgelastet – bitte kurz warten und erneut versuchen.',
    aiErrorAuth: 'Ungültiger API-Schlüssel. Prüfe deine .env-Datei.',
    aiErrorNetwork: 'Netzwerkfehler. Prüfe deine Verbindung.',
    aiErrorGeneric: 'KI-Anfrage fehlgeschlagen. Bitte erneut versuchen.',

    // Auth
    loginTitle: 'Anmelden',
    registerTitle: 'Konto erstellen',
    labelName: 'Name',
    labelEmail: 'E-Mail',
    labelEmailOrUsername: 'E-Mail oder Benutzername',
    labelPassword: 'Passwort',
    loginSubmit: 'Anmelden',
    registerSubmit: 'Konto erstellen',
    errorUsernameTaken: 'Dieser Benutzername ist bereits vergeben.',
    loginLink: 'Bereits ein Konto? Anmelden',
    registerLink: 'Noch kein Konto? Registrieren',
    logoutButton: 'Abmelden',
    authRequired: 'Bitte anmelden, um fortzufahren.',
  },
}

export function t(lang, key, ...args) {
  const val = translations[lang]?.[key] ?? translations.en[key] ?? key
  return typeof val === 'function' ? val(...args) : val
}

// Maps English category values (stored in data) to translation keys
export const CATEGORY_KEYS = {
  All: 'catAll',
  Breakfast: 'catBreakfast',
  Lunch: 'catLunch',
  Dinner: 'catDinner',
  Dessert: 'catDessert',
  Snack: 'catSnack',
}
