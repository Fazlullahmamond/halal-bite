"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Switch, Pressable, Modal } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { Moon, Sun, AlertTriangle } from "lucide-react-native"

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [resetType, setResetType] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const darkMode = await AsyncStorage.getItem("darkMode")
      if (darkMode === "true") {
        setIsDarkMode(true)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode
      await AsyncStorage.setItem("darkMode", newMode.toString())
      setIsDarkMode(newMode)
    } catch (error) {
      console.error("Error saving dark mode setting:", error)
    }
  }

  const showResetConfirmation = (type: "onboarding" | "favorites" | "mealPlan" | "all") => {
    setResetType(type)
    setShowConfirmReset(true)
  }

  const handleReset = async () => {
    try {
      switch (resetType) {
        case "onboarding":
          await AsyncStorage.setItem("onboardingComplete", "false")
          router.replace("./onboarding")
          break
        case "favorites":
          await AsyncStorage.setItem("favorites", JSON.stringify([]))
          break
        case "mealPlan":
          const emptyPlan: { [key: string]: { Breakfast: null; Lunch: null; Dinner: null } } = {}
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
          days.forEach((day) => {
            emptyPlan[day] = {
              Breakfast: null,
              Lunch: null,
              Dinner: null,
            }
          })
          await AsyncStorage.setItem("mealPlan", JSON.stringify(emptyPlan))
          break
        case "all":
          await AsyncStorage.clear()
          router.replace("./onboarding")
          break
      }
      setShowConfirmReset(false)
    } catch (error) {
      console.error("Error resetting:", error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your app experience</Text>
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingCard}>
          <Text style={styles.settingTitle}>Appearance</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              {isDarkMode ? <Moon size={20} color="#666" /> : <Sun size={20} color="#666" />}
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#D1D1D1", true: "#5C8D89" }}
              thumbColor={isDarkMode ? "#2A6049" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingTitle}>Data Management</Text>

          <Pressable style={styles.resetButton} onPress={() => showResetConfirmation("onboarding")}>
            <Text style={styles.resetButtonText}>Reset Onboarding</Text>
          </Pressable>

          <Pressable style={styles.resetButton} onPress={() => showResetConfirmation("favorites")}>
            <Text style={styles.resetButtonText}>Clear Favorites</Text>
          </Pressable>

          <Pressable style={styles.resetButton} onPress={() => showResetConfirmation("mealPlan")}>
            <Text style={styles.resetButtonText}>Clear Meal Plan</Text>
          </Pressable>

          <Pressable style={[styles.resetButton, styles.resetAllButton]} onPress={() => showResetConfirmation("all")}>
            <Text style={[styles.resetButtonText, styles.resetAllButtonText]}>Reset All Data</Text>
          </Pressable>
        </View>

        <View style={styles.settingCard}>
          <Text style={styles.settingTitle}>About</Text>
          <Text style={styles.aboutText}>
            HalalBite v1.0.0{"\n"}
            An offline Islamic halal cooking app
          </Text>
        </View>
      </View>

      {/* Confirm Reset Modal */}
      <Modal visible={showConfirmReset} animationType="fade" transparent={true}>
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <AlertTriangle size={32} color="#E74C3C" style={styles.confirmIcon} />
            <Text style={styles.confirmTitle}>
              {resetType === "onboarding"
                ? "Reset Onboarding?"
                : resetType === "favorites"
                  ? "Clear Favorites?"
                  : resetType === "mealPlan"
                    ? "Clear Meal Plan?"
                    : "Reset All Data?"}
            </Text>
            <Text style={styles.confirmText}>
              {resetType === "onboarding"
                ? "This will show the onboarding screens again the next time you open the app."
                : resetType === "favorites"
                  ? "This will remove all your favorite recipes."
                  : resetType === "mealPlan"
                    ? "This will clear your entire meal plan."
                    : "This will reset all app data including favorites, meal plans, and settings. You will need to go through onboarding again."}
            </Text>

            <View style={styles.confirmButtons}>
              <Pressable style={[styles.confirmButton, styles.cancelButton]} onPress={() => setShowConfirmReset(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable style={[styles.confirmButton, styles.resetConfirmButton]} onPress={handleReset}>
                <Text style={styles.resetConfirmButtonText}>{resetType === "all" ? "Reset All" : "Confirm"}</Text>
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
  settingsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  settingCard: {
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
  settingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A6049",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "#444",
    marginLeft: 12,
  },
  resetButton: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resetButtonText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  resetAllButton: {
    backgroundColor: "#F8D7DA",
    marginTop: 8,
  },
  resetAllButtonText: {
    color: "#721C24",
  },
  aboutText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
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
