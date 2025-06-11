import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Waterfall } from '@/types/waterfall';

interface WaterfallCardProps {
  waterfall: Waterfall;
}

const WaterfallCard: React.FC<WaterfallCardProps> = ({ waterfall }) => {
  const [isChecked, setChecked] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{waterfall.Name}</Text>
      <Text>Height: {waterfall.Height}</Text>
      <Text>Width: {waterfall.Width}</Text>
      <View style={styles.checkboxContainer}>
        <CheckBox value={isChecked} onValueChange={setChecked} />
        <Text style={styles.checkboxLabel}>Visited</Text>
      </View>
    </View>
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
