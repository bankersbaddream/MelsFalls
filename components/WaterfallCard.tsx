import React, { useState, useEffect } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import { router } from 'expo-router';
import { Waterfall } from '@/types/waterfall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

// Storage key generator
const getVisitKey = (id: string | number) => `visit_${id}`;

interface WaterfallCardProps {
  waterfall: Waterfall; // Ensure waterfall.id is available and is string or number
}

const WaterfallCard: React.FC<WaterfallCardProps> = ({ waterfall }) => {
  const [isVisited, setIsVisited] = useState(false);
  const isFocused = useIsFocused();

  // Filter out any potential non-serializable parts if necessary.
  // Ensure id is correctly passed if it's part of 'flow' or 'lastUpdated' in some edge cases,
  // but standard 'Waterfall' type should have 'id' directly.
  const { flow, lastUpdated, ...serializableParams } = waterfall;

  useEffect(() => {
    // Ensure waterfall.id is a string for getVisitKey, as defined in Waterfall type
    if (isFocused && waterfall.id && typeof waterfall.id === 'string') {
      const checkVisitStatus = async () => {
        try {
          const visitKey = getVisitKey(waterfall.id);
          const jsonValue = await AsyncStorage.getItem(visitKey);
          setIsVisited(jsonValue != null);
        } catch (e) {
          console.error("Failed to load visit status for card.", e);
          setIsVisited(false); // Default to not visited on error
        }
      };
      checkVisitStatus();
    } else if (isFocused && waterfall.id && typeof waterfall.id === 'number') {
        // Handle if ID is number, though current Waterfall type defines string
        const checkVisitStatus = async () => {
            try {
              const visitKey = getVisitKey(waterfall.id.toString());
              const jsonValue = await AsyncStorage.getItem(visitKey);
              setIsVisited(jsonValue != null);
            } catch (e) {
              console.error("Failed to load visit status for card (numeric ID).", e);
              setIsVisited(false); // Default to not visited on error
            }
          };
          checkVisitStatus();
    }
  }, [isFocused, waterfall.id]); // Rerun when screen focus changes or waterfall.id changes

  return (
    <Pressable onPress={() => router.push({ pathname: '/details', params: { ...serializableParams } })}>
      <View style={styles.card}>
        <Text style={styles.name}>{waterfall.Name}</Text>
        <Text>Height: {waterfall.Height}</Text>
        <Text>Width: {waterfall.Width}</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox value={isVisited} disabled={true} />
          <Text style={styles.checkboxLabel}>Visited</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
});

export default WaterfallCard;
