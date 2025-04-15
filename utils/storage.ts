import AsyncStorage from "@react-native-async-storage/async-storage"

// Generic get function with type safety
export async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return JSON.parse(value) as T
    }
    return defaultValue
  } catch (error) {
    console.error(`Error getting item ${key} from storage:`, error)
    return defaultValue
  }
}

// Generic set function
export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting item ${key} in storage:`, error)
    return false
  }
}

// Remove a specific item
export async function removeItem(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing item ${key} from storage:`, error)
    return false
  }
}

// Clear all storage (use with caution)
export async function clearAll(): Promise<boolean> {
  try {
    await AsyncStorage.clear()
    return true
  } catch (error) {
    console.error("Error clearing storage:", error)
    return false
  }
}

// Specific helper functions for the app

// Onboarding
export async function isOnboardingComplete(): Promise<boolean> {
  return getItem<boolean>("onboardingComplete", false)
}

export async function setOnboardingComplete(complete: boolean): Promise<boolean> {
  return setItem("onboardingComplete", complete)
}

// Favorites
export async function getFavorites(): Promise<string[]> {
  return getItem<string[]>("favorites", [])
}

export async function addFavorite(recipeId: string): Promise<boolean> {
  const favorites = await getFavorites()
  if (!favorites.includes(recipeId)) {
    favorites.push(recipeId)
    return setItem("favorites", favorites)
  }
  return true
}

export async function removeFavorite(recipeId: string): Promise<boolean> {
  const favorites = await getFavorites()
  const newFavorites = favorites.filter((id) => id !== recipeId)
  return setItem("favorites", newFavorites)
}

export async function isFavorite(recipeId: string): Promise<boolean> {
  const favorites = await getFavorites()
  return favorites.includes(recipeId)
}

// Theme
export async function isDarkMode(): Promise<boolean> {
  return getItem<boolean>("darkMode", false)
}

export async function setDarkMode(isDark: boolean): Promise<boolean> {
  return setItem("darkMode", isDark)
}

// Meal Plan
export type MealPlanType = {
  [day: string]: {
    Breakfast: string | null
    Lunch: string | null
    Dinner: string | null
  }
}

export async function getMealPlan(): Promise<MealPlanType> {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const defaultPlan: MealPlanType = {}

  days.forEach((day) => {
    defaultPlan[day] = {
      Breakfast: null,
      Lunch: null,
      Dinner: null,
    }
  })

  return getItem<MealPlanType>("mealPlan", defaultPlan)
}

export async function setMealPlan(plan: MealPlanType): Promise<boolean> {
  return setItem("mealPlan", plan)
}

export async function resetMealPlan(): Promise<boolean> {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const emptyPlan: MealPlanType = {}

  days.forEach((day) => {
    emptyPlan[day] = {
      Breakfast: null,
      Lunch: null,
      Dinner: null,
    }
  })

  return setItem("mealPlan", emptyPlan)
}
