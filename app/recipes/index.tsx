"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Image, Pressable, TextInput } from "react-native"
import { Link } from "expo-router"
import { Search, Clock, Tag } from "lucide-react-native"
import recipesData from "../../data/recipes.json"
import { getImage } from "@/utils/getImage"

export default function RecipesIndex() {
  const [recipes, setRecipes] = useState(recipesData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Main Dish", "Appetizer", "Dessert", "Sunnah", "Eid"]

  useEffect(() => {
    filterRecipes()
  }, [searchQuery, selectedCategory])

  const filterRecipes = () => {
    let filtered = recipesData

    if (searchQuery) {
      filtered = filtered.filter((recipe) => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((recipe) => recipe.categories.includes(selectedCategory))
    }

    setRecipes(filtered)
  }

  const renderRecipeItem = ({ item }: { item: { id: number; name: string; image: string; prepTime: number; categories: string[] } }) => (
    <Link href={`./recipes/${item.id}`} asChild>
      <Pressable style={styles.recipeCard}>
        <Image source={getImage(item.image)} style={styles.recipeImage} resizeMode="cover" />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <View style={styles.recipeMetaContainer}>
            <View style={styles.recipeMeta}>
              <Clock size={14} color="#666" />
              <Text style={styles.recipeMetaText}>{item.prepTime} min</Text>
            </View>
            <View style={styles.categoryContainer}>
              {item.categories.slice(0, 2).map((category: string, index: number) => (
                <View key={index} style={styles.categoryTag}>
                  <Tag size={12} color="#5C8D89" />
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.categoryButton, selectedCategory === item && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === item && styles.categoryButtonTextActive]}>
                {item}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.recipesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found</Text>
          </View>
        }
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
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2A6049",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EAF4F4",
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: "#2A6049",
  },
  categoryButtonText: {
    color: "#2A6049",
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "white",
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
  recipeImage: {
    width: "100%",
    height: 180,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A6049",
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeMetaText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  categoryContainer: {
    flexDirection: "row",
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7F4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#5C8D89",
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
})
