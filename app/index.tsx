"use client"

import { useEffect } from "react"
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from "react-native"
import { Link, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { Book, Calendar, Coffee, Heart, Info, Settings } from "lucide-react-native"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const onboardingComplete = await AsyncStorage.getItem("onboardingComplete")
      if (onboardingComplete !== "true") {
        router.replace("./onboarding")
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      router.replace("./onboarding")
    }
  }

  const menuItems = [
    { title: "Recipes", icon: <Coffee size={24} color="#5C8D89" />, route: "/recipes" },
    { title: "Sunnah Foods", icon: <Coffee size={24} color="#5C8D89" />, route: "/sunnah-foods" },
    { title: "Halal Tips", icon: <Info size={24} color="#5C8D89" />, route: "/halal-tips" },
    { title: "Meal Planner", icon: <Calendar size={24} color="#5C8D89" />, route: "/meal-planner" },
    { title: "Favorites", icon: <Heart size={24} color="#5C8D89" />, route: "/favorites" },
    { title: "Glossary", icon: <Book size={24} color="#5C8D89" />, route: "/glossary" },
    { title: "Settings", icon: <Settings size={24} color="#5C8D89" />, route: "/settings" },
  ]

  const quotes = [
    'Eat of what is lawful and good on earth." - Quran 2:168',
    'The believer eats in one intestine, whereas the disbeliever eats in seven intestines." - Sahih Bukhari',
    'Eat together and not separately, for the blessing is associated with the company." - Ibn Majah',
    'He is not a believer who eats his fill while his neighbor beside him goes hungry." - Al-Adab Al-Mufrad',
  ]

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>HalalBite</Text>
          <Text style={styles.subtitle}>Halal Cooking Made Easy</Text>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{randomQuote}</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <Link href={item.route as any} asChild key={index}>
              <Pressable style={styles.menuItem}>
                <View style={styles.menuIconContainer}>{item.icon}</View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  quoteContainer: {
    backgroundColor: "#EAF4F4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#5C8D89",
  },
  quoteText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#2A6049",
    lineHeight: 22,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuItem: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2A6049",
  },
})
