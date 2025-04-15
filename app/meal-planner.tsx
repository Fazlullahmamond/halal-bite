"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, FlatList } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Plus, X, AlertTriangle } from "lucide-react-native"
import recipesData from "../data/recipes.json"

export default function MealPlanner() {
  type MealPlan = {
    [day: string]: {
      [mealType: string]: string | null
    }
  }

  const [mealPlan, setMealPlan] = useState<MealPlan>({})
  const [showModal, setShowModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedMealType, setSelectedMealType] = useState("")
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const mealTypes = ["Breakfast", "Lunch", "Dinner"]

  useEffect(() => {
    loadMealPlan()
  }, [])

  const loadMealPlan = async () => {
    try {
      const storedMealPlan = await AsyncStorage.getItem("mealPlan")
      if (storedMealPlan) {
        setMealPlan(JSON.parse(storedMealPlan))
      } else {
        // Initialize empty meal plan
        const emptyPlan: MealPlan = {}
        days.forEach((day) => {
          emptyPlan[day] = {
            Breakfast: null,
            Lunch: null,
            Dinner: null,
          }
        })
        setMealPlan(emptyPlan)
        await AsyncStorage.setItem("mealPlan", JSON.stringify(emptyPlan))
      }
    } catch (error) {
      console.error("Error loading meal plan:", error)
    }
  }

  const saveMealPlan = async (newPlan: MealPlan) => {
    try {
      await AsyncStorage.setItem("mealPlan", JSON.stringify(newPlan))
      setMealPlan(newPlan)
    } catch (error) {
      console.error("Error saving meal plan:", error)
    }
  }

  const openRecipeSelector = (day: string, mealType: string) => {
    setSelectedDay(day)
    setSelectedMealType(mealType)
    setShowModal(true)
  }

  const selectRecipe = (recipeId: string) => {
    const newPlan = { ...mealPlan }
    newPlan[selectedDay][selectedMealType] = recipeId
    saveMealPlan(newPlan)
    setShowModal(false)
  }

  const removeRecipe = (day: string, mealType: string) => {
    const newPlan = { ...mealPlan }
    newPlan[day][mealType] = null
    saveMealPlan(newPlan)
  }

  const resetMealPlan = async () => {
    try {
      const emptyPlan: MealPlan = {}
      days.forEach((day) => {
        emptyPlan[day] = {
          Breakfast: null,
          Lunch: null,
          Dinner: null,
        }
      })
      await AsyncStorage.setItem("mealPlan", JSON.stringify(emptyPlan))
      setMealPlan(emptyPlan)
      setShowConfirmReset(false)
    } catch (error) {
      console.error("Error resetting meal plan:", error)
    }
  }

  const getRecipeName = (recipeId: number) => {
    if (!recipeId) return null
    const recipe = recipesData.find((r) => r.id.toString() === recipeId.toString())
    return recipe ? recipe.name : "Unknown Recipe"
  }

  type Recipe = {
    id: number
    name: string
    prepTime: number
    categories: string[]
  }

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <Pressable style={styles.recipeItem} onPress={() => selectRecipe(item.id.toString())}>
      <Text style={styles.recipeItemName}>{item.name}</Text>
      <Text style={styles.recipeItemMeta}>
        {item.prepTime} min • {item.categories[0]}
      </Text>
    </Pressable>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Planner</Text>
        <Text style={styles.subtitle}>Plan your weekly meals</Text>
      </View>

      <ScrollView contentContainerStyle={styles.plannerContainer}>
        {days.map((day) => (
          <View key={day} style={styles.dayCard}>
            <Text style={styles.dayTitle}>{day}</Text>

            {mealTypes.map((mealType) => (
              <View key={mealType} style={styles.mealRow}>
                <Text style={styles.mealType}>{mealType}</Text>

                {mealPlan[day] && mealPlan[day][mealType] ? (
                  <View style={styles.selectedMeal}>
                    <Text style={styles.selectedMealText}>{getRecipeName(Number(mealPlan[day][mealType]))}</Text>
                    <Pressable style={styles.removeMealButton} onPress={() => removeRecipe(day, mealType)}>
                      <X size={16} color="#666" />
                    </Pressable>
                  </View>
                ) : (
                  <Pressable style={styles.addMealButton} onPress={() => openRecipeSelector(day, mealType)}>
                    <Plus size={16} color="#2A6049" />
                    <Text style={styles.addMealText}>Add Meal</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        ))}

        <Pressable style={styles.resetButton} onPress={() => setShowConfirmReset(true)}>
          <Text style={styles.resetButtonText}>Reset Meal Plan</Text>
        </Pressable>
      </ScrollView>

      {/* Recipe Selection Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {selectedMealType} for {selectedDay}
              </Text>
              <Pressable style={styles.closeModalButton} onPress={() => setShowModal(false)}>
                <X size={24} color="#2A6049" />
              </Pressable>
            </View>

            <FlatList
              data={recipesData}
              renderItem={renderRecipeItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.recipesList}
            />
          </View>
        </View>
      </Modal>

      {/* Confirm Reset Modal */}
      <Modal visible={showConfirmReset} animationType="fade" transparent={true}>
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <AlertTriangle size={32} color="#E74C3C" style={styles.confirmIcon} />
            <Text style={styles.confirmTitle}>Reset Meal Plan?</Text>
            <Text style={styles.confirmText}>
              This will clear all meals from your weekly plan. This action cannot be undone.
            </Text>

            <View style={styles.confirmButtons}>
              <Pressable style={[styles.confirmButton, styles.cancelButton]} onPress={() => setShowConfirmReset(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable style={[styles.confirmButton, styles.resetConfirmButton]} onPress={resetMealPlan}>
                <Text style={styles.resetConfirmButtonText}>Reset</Text>
              </Pressable>
            </View>
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
  plannerContainer: {
    padding: 20,
    paddingTop: 0,
  },
  dayCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A6049",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 8,
  },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  mealType: {
    fontSize: 16,
    color: "#444",
    width: 80,
  },
  addMealButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7F4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addMealText: {
    fontSize: 14,
    color: "#2A6049",
    marginLeft: 4,
  },
  selectedMeal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EAF4F4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  selectedMealText: {
    fontSize: 14,
    color: "#2A6049",
    flex: 1,
  },
  removeMealButton: {
    padding: 4,
  },
  resetButton: {
    backgroundColor: "#F8D7DA",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  resetButtonText: {
    color: "#721C24",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A6049",
  },
  closeModalButton: {
    padding: 4,
  },
  recipesList: {
    padding: 16,
  },
  recipeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  recipeItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2A6049",
    marginBottom: 4,
  },
  recipeItemMeta: {
    fontSize: 14,
    color: "#666",
  },
  confirmModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  confirmIcon: {
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A6049",
    marginBottom: 12,
  },
  confirmText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#444",
    fontWeight: "600",
  },
  resetConfirmButton: {
    backgroundColor: "#E74C3C",
    marginLeft: 8,
  },
  resetConfirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
})
