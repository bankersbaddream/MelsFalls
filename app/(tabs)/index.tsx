import React from 'react';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import WaterfallCard from '@/components/WaterfallCard';
import { Text, View } from '@/components/Themed';
import waterfallsData from '@/assets/waterfalls.json';
import { Waterfall } from '@/types/waterfall';

export default function TabOneScreen() {
  const waterfalls: Waterfall[] = waterfallsData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  listContentContainer: {
    paddingVertical: 8,
  },
});
