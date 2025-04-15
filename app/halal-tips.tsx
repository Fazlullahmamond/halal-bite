"use client"

import { SetStateAction, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native"
import { ChevronDown, ChevronUp } from "lucide-react-native"

export default function HalalTips() {
  const [expandedTip, setExpandedTip] = useState<number | null>(null)

  const toggleTip = (index: number) => {
    if (expandedTip === index) {
      setExpandedTip(null)
    } else {
      setExpandedTip(index)
    }
  }

  const tips = [
    {
      title: "What is Halal?",
      content:
        'Halal is an Arabic word meaning "permissible" or "lawful." In the context of food, it refers to what is allowed for Muslims to consume according to Islamic law (Shariah). The opposite of halal is haram, which means "forbidden" or "unlawful."',
      hadith:
        "The lawful is clear and the unlawful is clear, and between them are matters that are doubtful which many people do not know...",
    },
    {
      title: "Haram Ingredients to Avoid",
      content:
        "Muslims should avoid: \n\n• Pork and pork by-products\n• Blood and blood products\n• Alcohol (including cooking wines)\n• Animals not slaughtered according to Islamic law\n• Gelatin (unless from halal sources)\n• Enzymes and emulsifiers from animal sources\n• L-cysteine (often from human hair or duck feathers)\n• Carmine/cochineal (red food coloring from insects)",
      hadith:
        "Allah has only forbidden you dead animals, blood, the flesh of swine, and that which has been dedicated to other than Allah.",
    },
    {
      title: "E-Numbers to Watch For",
      content:
        "Some E-numbers may be derived from non-halal sources:\n\n• E120 (Carmine) - from insects\n• E441 (Gelatin) - often from pork\n• E542 (Bone phosphate) - may be from non-halal animals\n• E570-E599 (Various fatty acids) - may be animal-derived\n• E631, E627 (Disodium inosinate, disodium guanylate) - may be from non-halal meat\n\nAlways look for halal certification or contact manufacturers if unsure.",
    },
    {
      title: "Halal Meat Requirements",
      content:
        "For meat to be halal:\n\n• The animal must be healthy at the time of slaughter\n• The slaughter must be performed by a Muslim\n• Allah's name must be pronounced during slaughter\n• The animal's throat must be cut swiftly with a sharp knife\n• Blood must be drained completely\n• The animal should not see other animals being slaughtered",
      hadith: "Eat of that (meat) over which the name of Allah has been mentioned, if you are believers in His signs.",
    },
    {
      title: "Reading Halal Certification Labels",
      content:
        'Look for these trusted halal certification symbols:\n\n• HMC (Halal Monitoring Committee)\n• IFANCA (Islamic Food and Nutrition Council of America)\n• JAKIM (Department of Islamic Development Malaysia)\n• MUI (Indonesian Ulema Council)\n• SANHA (South African National Halal Authority)\n\nBe aware that some products may claim to be "suitable for Muslims" without proper certification.',
    },
    {
      title: "Sunnah Table Etiquette",
      content:
        '• Wash hands before and after eating\n• Say "Bismillah" (In the name of Allah) before eating\n• Eat with the right hand\n• Eat from what is nearest to you on the plate\n• Do not waste food\n• Eat while sitting, not standing\n• Do not criticize food\n• Share food with others\n• Say "Alhamdulillah" (All praise is due to Allah) after eating',
      hadith:
        "The food of one person is sufficient for two, the food of two persons is sufficient for four persons, and the food of four persons is sufficient for eight persons.",
    },
    {
      title: "Traveling and Eating Halal",
      content:
        "When traveling:\n\n• Research halal restaurants beforehand\n• Look for vegetarian options when halal is unavailable\n• Seafood is generally permissible across all Islamic schools of thought\n• Carry halal snacks when traveling to areas with limited halal options\n• Use halal restaurant finder apps\n• When in doubt, ask about ingredients and preparation methods",
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Halal Tips</Text>
        <Text style={styles.subtitle}>Guidelines for halal eating and food preparation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.tipsContainer}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <Pressable style={styles.tipHeader} onPress={() => toggleTip(index)}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              {expandedTip === index ? (
                <ChevronUp size={20} color="#2A6049" />
              ) : (
                <ChevronDown size={20} color="#2A6049" />
              )}
            </Pressable>

            {expandedTip === index && (
              <View style={styles.tipContent}>
                <Text style={styles.tipText}>{tip.content}</Text>
                {tip.hadith && (
                  <View style={styles.hadithContainer}>
                    <Text style={styles.hadithText}>{tip.hadith} - Sahih Bukhari and Muslim</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
  tipsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  tipCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2A6049",
  },
  tipContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  tipText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  hadithContainer: {
    backgroundColor: "#EAF4F4",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  hadithText: {
    fontSize: 14,
    color: "#2A6049",
    fontStyle: "italic",
    lineHeight: 20,
  },
})
