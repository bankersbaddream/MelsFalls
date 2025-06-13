import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_MAPS_API_KEY } from '@env';

// Waterfall data type
interface WaterfallDetails {
  id: string;
  Name: string;
  Height?: string;
  Width?: string;
  Latitude?: number | null;
  Longitude?: number | null;
}

// Storage key generator
const getVisitKey = (id: string) => `visit_${id}`;

export default function DetailsScreen() {
  const params = useLocalSearchParams(); // Not using generic here to handle parsing manually
  const [waterfall, setWaterfall] = useState<WaterfallDetails | null>(null);
  const [visitDate, setVisitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios'); // Show inline for iOS by default
  const [journalNotes, setJournalNotes] = useState('');

  useEffect(() => {
    if (params && params.id && typeof params.id === 'string') {
      const wfId = params.id;
      const currentWaterfall: WaterfallDetails = {
        id: wfId,
        Name: (params.Name as string) || 'Unknown Waterfall',
        Height: params.Height as string,
        Width: params.Width as string,
        Latitude: params.Latitude ? parseFloat(params.Latitude as string) : null,
        Longitude: params.Longitude ? parseFloat(params.Longitude as string) : null,
      };
      setWaterfall(currentWaterfall);

      const loadVisitData = async () => {
        try {
          const visitKey = getVisitKey(wfId);
          const jsonValue = await AsyncStorage.getItem(visitKey);
          if (jsonValue != null) {
            const storedVisit = JSON.parse(jsonValue);
            if (storedVisit.visitDate) {
              setVisitDate(new Date(storedVisit.visitDate));
            }
            setJournalNotes(storedVisit.journalNotes || '');
          }
        } catch (e) {
          console.error("Failed to load visit data.", e);
          Alert.alert("Error", "Failed to load visit data.");
        }
      };
      loadVisitData();
    }
  }, [params]);

  const handleSaveVisit = async () => {
    if (!waterfall) return;
    try {
      const visitKey = getVisitKey(waterfall.id);
      const visitData = {
        visitDate: visitDate.toISOString(),
        journalNotes,
      };
      const jsonValue = JSON.stringify(visitData);
      await AsyncStorage.setItem(visitKey, jsonValue);
      Alert.alert('Success', 'Visit saved!');
      router.back();
    } catch (e) {
      console.error("Failed to save visit data.", e);
      Alert.alert("Error", "Failed to save visit data.");
    }
  };

  const handleDeleteVisit = async () => {
    if (!waterfall) return;
    try {
      const visitKey = getVisitKey(waterfall.id);
      await AsyncStorage.removeItem(visitKey);
      setVisitDate(new Date()); // Reset date
      setJournalNotes(''); // Reset notes
      Alert.alert('Success', 'Visit deleted!');
      router.back();
    } catch (e) {
      console.error("Failed to delete visit data.", e);
      Alert.alert("Error", "Failed to delete visit data.");
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || visitDate;
    if (Platform.OS === 'android') {
      setShowDatePicker(false); // Hide Android modal picker after selection
    }
    setVisitDate(currentDate);
  };

  if (!waterfall) {
    return <Text>Loading waterfall details...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{waterfall.Name}</Text>
      <Text>ID: {waterfall.id}</Text>
      {waterfall.Height && <Text>Height: {waterfall.Height}</Text>}
      {waterfall.Width && <Text>Width: {waterfall.Width}</Text>}

      <View style={styles.separator} />

      <Text style={styles.sectionTitle}>Visit Details</Text>

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Visit Date:</Text>
        {Platform.OS === 'android' && (
          <Button onPress={() => setShowDatePicker(true)} title={visitDate.toLocaleDateString()} />
        )}
        {(Platform.OS === 'ios' || (showDatePicker && Platform.OS === 'android')) && (
          <DateTimePicker
            testID="dateTimePicker"
            value={visitDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangeDate}
            style={Platform.OS === 'ios' ? styles.datePickerIOS : styles.datePickerAndroid}
          />
        )}
      </View>

      <TextInput
        style={styles.textInput}
        placeholder="Journal notes about your visit"
        value={journalNotes}
        onChangeText={setJournalNotes}
        multiline
      />

      {waterfall.Latitude && waterfall.Longitude ? (
        <MapView
          provider={Platform.OS === 'ios' ? PROVIDER_GOOGLE : undefined}
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          style={styles.map}
          initialRegion={{
            latitude: waterfall.Latitude,
            longitude: waterfall.Longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: waterfall.Latitude, longitude: waterfall.Longitude }}
            title={waterfall.Name}
            description={`Height: ${waterfall.Height || 'N/A'}`}
          />
        </MapView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text>Map data not available for this waterfall.</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Save Visit" onPress={handleSaveVisit} />
        <Button title="Delete Visit" onPress={handleDeleteVisit} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  separator: {
    marginVertical: 15,
    height: 1,
    backgroundColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: Platform.OS === 'ios' ? 10 : 5, // More space for inline picker
  },
  datePickerIOS: {
    // width: '100%', // Or specific width
    // height: 150, // Adjust as needed for inline picker
  },
  datePickerAndroid: {
    // Android default picker doesn't need much styling here as it's a modal
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  map: {
    height: 250,
    marginBottom: 15,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
  // Ensure all styles referenced are defined
});
