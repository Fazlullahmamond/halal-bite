"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Modal } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Heart, Clock, ChevronLeft, Minus, Plus, PlayCircle, X } from "lucide-react-native"
import recipesData from "../../data/recipes.json"
import { StatusBar } from "expo-status-bar"
import { getImage } from "@/utils/getImage"

export default function RecipeDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const recipe = recipesData.find((r) => r.id.toString() === id)

  const [isFavorite, setIsFavorite] = useState(false)
  const [servings, setServings] = useState(recipe?.servings || 4)
  const [showCookingMode, setShowCookingMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    checkIfFavorite()
  }, [])

  const checkIfFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites")
      if (favorites) {
        const favoritesArray = JSON.parse(favorites)
        setIsFavorite(favoritesArray.includes(id))
      }
    } catch (error) {
      console.error("Error checking favorites:", error)
    }
  }

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites")
      let favoritesArray = favorites ? JSON.parse(favorites) : []

      if (isFavorite) {
        favoritesArray = favoritesArray.filter((favId: string | string[]) => favId !== id)
      } else {
        favoritesArray.push(id)
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray))
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error updating favorites:", error)
    }
  }

  const adjustServings = (increment: number) => {
    const newServings = servings + increment
    if (newServings >= 1) {
      setServings(newServings)
    }
  }

  const getAdjustedAmount = (amount: number) => {
    const originalServings = recipe?.servings || 4
    return ((amount * servings) / originalServings).toFixed(1).replace(/\.0$/, "")
  }

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={getImage(recipe.image)} style={styles.recipeImage} resizeMode="cover" />
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="white" />
          </Pressable>
          <Pressable
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={toggleFavorite}
          >
            <Heart size={24} color={isFavorite ? "white" : "#2A6049"} fill={isFavorite ? "white" : "transparent"} />
          </Pressable>
        </View>

        <View style={styles.recipeContent}>
          <Text style={styles.recipeName}>{recipe.name}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={16} color="#666" />
              <Text style={styles.metaText}>{recipe.prepTime} min</Text>
            </View>
            {recipe.categories.map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{recipe.description}</Text>

          <View style={styles.servingsContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.servingsAdjuster}>
              <Text style={styles.servingsText}>Servings: {servings}</Text>
              <View style={styles.servingsButtons}>
                <Pressable style={styles.servingButton} onPress={() => adjustServings(-1)} disabled={servings <= 1}>
                  <Minus size={16} color={servings <= 1 ? "#CCC" : "#2A6049"} />
                </Pressable>
                <Pressable style={styles.servingButton} onPress={() => adjustServings(1)}>
                  <Plus size={16} color="#2A6049" />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>
                  {getAdjustedAmount(ingredient.amount)} {ingredient.unit} {ingredient.name}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsList}>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.startCookingButton} onPress={() => setShowCookingMode(true)}>
            <PlayCircle size={20} color="white" />
            <Text style={styles.startCookingText}>Start Cooking</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Cooking Mode Modal */}
      <Modal visible={showCookingMode} animationType="slide" transparent={false}>
        <View style={styles.cookingModeContainer}>
          <Pressable
            style={styles.closeCookingMode}
            onPress={() => {
              setShowCookingMode(false)
              setCurrentStep(0)
            }}
          >
            <X size={24} color="#2A6049" />
          </Pressable>

          <View style={styles.cookingModeContent}>
            <Text style={styles.cookingModeTitle}>
              Step {currentStep + 1} of {recipe.instructions.length}
            </Text>
            <Text style={styles.cookingModeInstruction}>{recipe.instructions[currentStep]}</Text>
          </View>

          <View style={styles.cookingModeNavigation}>
            <Pressable
              style={[styles.cookingModeButton, currentStep === 0 && styles.cookingModeButtonDisabled]}
              onPress={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <Text style={[styles.cookingModeButtonText, currentStep === 0 && styles.cookingModeButtonTextDisabled]}>
                Previous
              </Text>
            </Pressable>

            {currentStep < recipe.instructions.length - 1 ? (
              <Pressable style={styles.cookingModeButton} onPress={() => setCurrentStep(currentStep + 1)}>
                <Text style={styles.cookingModeButtonText}>Next</Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.cookingModeButton}
                onPress={() => {
                  setShowCookingMode(false)
                  setCurrentStep(0)
                }}
              >
                <Text style={styles.cookingModeButtonText}>Finish</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButtonActive: {
    backgroundColor: "#2A6049",
  },
  recipeContent: {
    padding: 20,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2A6049",
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  categoryTag: {
    backgroundColor: "#EAF4F4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#2A6049",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A6049",
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 20,
  },
  servingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  servingsAdjuster: {
    flexDirection: "row",
    alignItems: "center",
  },
  servingsText: {
    fontSize: 14,
    color: "#444",
    marginRight: 8,
  },
  servingsButtons: {
    flexDirection: "row",
  },
  servingButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  ingredientsList: {
    marginBottom: 20,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2A6049",
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 16,
    color: "#444",
  },
  instructionsList: {
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2A6049",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  startCookingButton: {
    backgroundColor: "#2A6049",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  startCookingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  cookingModeContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  closeCookingMode: {
    alignSelf: "flex-end",
    padding: 8,
  },
  cookingModeContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cookingModeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A6049",
    marginBottom: 24,
  },
  cookingModeInstruction: {
    fontSize: 22,
    color: "#444",
    lineHeight: 32,
    textAlign: "center",
  },
  cookingModeNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  cookingModeButton: {
    backgroundColor: "#2A6049",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: "center",
  },
  cookingModeButtonDisabled: {
    backgroundColor: "#D1D1D1",
  },
  cookingModeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cookingModeButtonTextDisabled: {
    color: "#888",
  },
})
