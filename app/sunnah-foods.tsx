"use client"
import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native"
import { Link, useRouter } from "expo-router"
import { ChevronRight } from "lucide-react-native"
import sunnahFoodsDataRaw from "../data/sunnahFoods.json"

// Transform relatedRecipes to be an array of strings
const sunnahFoodsData = sunnahFoodsDataRaw.map((item) => ({
  ...item,
  relatedRecipes: item.relatedRecipes?.map((recipe) => recipe.name) || [],
}));
import { getImage } from '../utils/getImage';

export default function SunnahFoods() {
  const router = useRouter()

  const renderSunnahFoodItem = ({ item }: { item: { id: number; name: string; arabicName: string; image: string; reference: string; benefits: string; relatedRecipes?: string[] } }) => (
    <View style={styles.foodCard}>
      <Image source={getImage(item.image)} style={styles.foodImage} resizeMode="cover" />
      <View style={styles.foodInfo}>
        <View style={styles.foodNameContainer}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodArabicName}>{item.arabicName}</Text>
        </View>

        <View style={styles.referenceContainer}>
          <Text style={styles.referenceTitle}>Reference:</Text>
          <Text style={styles.referenceText}>{item.reference}</Text>
        </View>

        <Text style={styles.benefitsTitle}>Benefits:</Text>
        <Text style={styles.benefitsText}>{item.benefits}</Text>

        {item.relatedRecipes && item.relatedRecipes.length > 0 && (
            <View style={styles.relatedRecipesContainer}>
              <Text style={styles.relatedRecipesTitle}>Related Recipes:</Text>
              {item.relatedRecipes.map((recipeName: string, index: number) => (
              <Pressable
                style={styles.relatedRecipeItem}
                key={index}
                onPress={() => router.push(`/recipes/${item.id}`)}
              >
                <Text style={styles.relatedRecipeText}>{recipeName}</Text>
                <ChevronRight size={16} color="#2A6049" />
              </Pressable>
              ))}
            </View>
        )}
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sunnah Foods</Text>
        <Text style={styles.subtitle}>Foods mentioned in the Quran and Sunnah</Text>
      </View>

      <FlatList
        data={sunnahFoodsData}
        renderItem={renderSunnahFoodItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.foodsList}
        showsVerticalScrollIndicator={false}
      />
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
  foodsList: {
    padding: 20,
    paddingTop: 0,
  },
  foodCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodImage: {
    width: "100%",
    height: 180,
  },
  foodInfo: {
    padding: 16,
  },
  foodNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  foodName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A6049",
  },
  foodArabicName: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  referenceContainer: {
    backgroundColor: "#EAF4F4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  referenceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2A6049",
    marginBottom: 4,
  },
  referenceText: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
    lineHeight: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A6049",
    marginBottom: 8,
  },
  benefitsText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 16,
  },
  relatedRecipesContainer: {
    marginTop: 8,
  },
  relatedRecipesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A6049",
    marginBottom: 8,
  },
  relatedRecipeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  relatedRecipeText: {
    fontSize: 15,
    color: "#444",
  },
})
