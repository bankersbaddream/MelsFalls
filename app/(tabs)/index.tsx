import React from 'react';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import WaterfallCard from '@/components/WaterfallCard';
import { View } from '@/components/Themed';
import waterfallsData from '@/assets/waterfalls.json';
import { Waterfall } from '@/types/waterfall';

export default function TabOneScreen() {
  const waterfalls: Waterfall[] = waterfallsData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Static header from `main` branch */}
        <Text style={styles.title}>Hamilton Falls</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="app/(tabs)/index.tsx" />

        {/* Dynamic list from `feat/waterfall-list` branch */}
        <FlatList
          data={waterfalls}
          renderItem={({ item }) => <WaterfallCard waterfall={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Or your desired background color
  },
  container: {
    flex: 1,
  },
  listContentContainer: {
    paddingVertical: 8,
  },
});
