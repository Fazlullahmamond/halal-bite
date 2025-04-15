"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native"
import { Link, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Heart, Trash2 } from "lucide-react-native"
import recipesData from "../data/recipes.json"
import { getImage } from "@/utils/getImage"

type Recipe = {
  id: number
  name: string
  description: string
  image: string
  prepTime: number
  categories: string[]
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const router = useRouter()

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites")
      if (storedFavorites) {
        const favoritesArray = JSON.parse(storedFavorites)
        setFavorites(favoritesArray)

        // Get recipe details for each favorite
        const recipes = recipesData.filter((recipe) => favoritesArray.includes(recipe.id.toString()))
        setFavoriteRecipes(recipes)
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const removeFavorite = async (recipeId: { toString: () => string }) => {
    try {
      const updatedFavorites = favorites.filter((id) => id !== recipeId.toString())
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setFavorites(updatedFavorites)
      setFavoriteRecipes(favoriteRecipes.filter((recipe) => recipe.id.toString() !== recipeId.toString()))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  const renderFavoriteItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeCard}>
      <Link href={`./recipes/${item.id}`} asChild>
        <Pressable style={styles.recipeImageContainer}>
          <Image source={getImage(item.image)} style={styles.recipeImage} resizeMode="cover" />
        </Pressable>
      </Link>
      <View style={styles.recipeInfo}>
        <View style={styles.recipeNameContainer}>
          <Link href={`./recipes/${item.id}`} asChild>
            <Pressable>
              <Text style={styles.recipeName}>{item.name}</Text>
            </Pressable>
          </Link>
          <Pressable style={styles.removeButton} onPress={() => removeFavorite(item.id)}>
            <Trash2 size={18} color="#E74C3C" />
          </Pressable>
        </View>
        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.recipeMetaContainer}>
          <Text style={styles.recipeMeta}>{item.prepTime} min</Text>
          <View style={styles.categoryContainer}>
            {item.categories.slice(0, 2).map((category: string, index: number) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your saved recipes</Text>
      </View>

      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.recipesList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Heart size={64} color="#D1D1D1" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>Save your favorite recipes by tapping the heart icon on any recipe page.</Text>
          <Pressable style={styles.browseButton} onPress={() => router.push("./recipes")}>
            <Text style={styles.browseButtonText}>Browse Recipes</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2A6049",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  recipesList: {
    padding: 20,
    paddingTop: 0,
  },
  recipeCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImageContainer: {
    width: "100%",
    height: 160,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  recipeInfo: {
    padding: 16,
  },
  recipeNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A6049",
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeMeta: {
    fontSize: 14,
    color: "#666",
  },
  categoryContainer: {
    flexDirection: "row",
  },
  categoryTag: {
    backgroundColor: "#EAF4F4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#2A6049",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A6049",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#2A6049",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
