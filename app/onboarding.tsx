"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { ArrowRight, Check } from "lucide-react-native"

const { width } = Dimensions.get("window")

export default function Onboarding() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Welcome to HalalBite",
      description: "Your complete guide to halal cooking with authentic recipes and Islamic food traditions.",
      image: require("../assets/images/logo.png"),
    },
    {
      title: "Discover Sunnah Foods",
      description:
        "Learn about foods mentioned in the Quran and Sunnah, their benefits, and how to use them in your cooking.",
      image: require("../assets/images/dates.png"),
    },
    {
      title: "Plan Your Meals",
      description: "Organize your weekly meals with our easy-to-use planner and save your favorite recipes.",
      image: require("../assets/images/honey.png"),
    },
    {
      title: "Halal Knowledge",
      description: "Understand halal guidelines, learn Arabic food terms, and discover Islamic table manners.",
      image: require("../assets/images/logo.png"),
    },
  ]

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem("onboardingComplete", "true")
      router.replace("/")
    } catch (error) {
      console.error("Error saving onboarding status:", error)
    }
  }

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      handleComplete()
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.slideContainer}>
        <Image source={slides[currentSlide].image} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
      </View>

      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <View key={index} style={[styles.paginationDot, currentSlide === index ? styles.paginationDotActive : {}]} />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {currentSlide === slides.length - 1 ? (
          <Pressable style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>Bismillah, Start Cooking</Text>
            <Check size={20} color="white" />
          </Pressable>
        ) : (
          <Pressable style={styles.button} onPress={nextSlide}>
            <Text style={styles.buttonText}>Next</Text>
            <ArrowRight size={20} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2A6049",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    marginBottom: 40,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1D1D1",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#2A6049",
    width: 20,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#2A6049",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
})
