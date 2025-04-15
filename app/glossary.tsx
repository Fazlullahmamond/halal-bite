"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native"
import { Search } from "lucide-react-native"
import glossaryData from "../data/glossary.json"

type GlossaryItem = {
  term: string
  arabicTerm: string
  definition: string
}

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTerms, setFilteredTerms] = useState(glossaryData)

  const handleSearch = (text: string) => {
    setSearchQuery(text)
  if (text) {
    const filtered = glossaryData.filter((item: GlossaryItem) =>
      item.term.toLowerCase().includes(text.toLowerCase()) ||
      item.arabicTerm.toLowerCase().includes(text.toLowerCase()) ||
      item.definition.toLowerCase().includes(text.toLowerCase())
    )
    setFilteredTerms(filtered)
  } else {
    setFilteredTerms(glossaryData)
  }
  }

  const renderGlossaryItem = ({ item }: { item: GlossaryItem }) => (
    <View style={styles.glossaryItem}>
      <View style={styles.termContainer}>
        <Text style={styles.term}>{item.term}</Text>
        <Text style={styles.arabicTerm}>{item.arabicTerm}</Text>
      </View>
      <Text style={styles.definition}>{item.definition}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Glossary</Text>
        <Text style={styles.subtitle}>Islamic and Arabic cooking terms</Text>

        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search terms..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredTerms}
        renderItem={renderGlossaryItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.glossaryList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No terms found</Text>
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
  glossaryList: {
    padding: 20,
    paddingTop: 0,
  },
  glossaryItem: {
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
  termContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  term: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A6049",
  },
  arabicTerm: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  definition: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
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
