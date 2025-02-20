import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator, Alert, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { DEFAULT_REGION } from '@/consts';
import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { ImageType, MarkerType } from '@/types';

export default function Map() {

  const mapRef = useRef<MapView | null>(null);
  const router = useRouter();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 2500);
  };

  const markerClick = (marker: MarkerType) => {
    router.push({
      pathname: "/marker/[marker]",
      params: {
        marker: marker.id,
        title: marker.title,
        description: marker.description,
        latitude: marker.latitude.toString(),
        longitude: marker.longitude.toString(),
        images: JSON.stringify(marker.images),
      },
    });
  };

  const focusOnMe = async () => {
    try {
      setLoading(true);
      setError(null);
      const location = await Location.getCurrentPositionAsync();
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    } catch (err) {
      showError("Не удалось получить текущую локацию.");
    } finally {
      setLoading(false);
    }
  };

  const addNewMarker = (event: any) => {
    const coordinates = event.nativeEvent.coordinate;
    const newMarker: MarkerType = {
      id: Crypto.randomUUID() as string,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      title: "Новая метка",
      description: "Описание новой метки",
      images: new Array<ImageType>({id: Crypto.randomUUID() as string, uri: "https://example.com/image.jpg"}),
    };

    setMarkers([...markers, newMarker]);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showError("Нет доступа к локации.");
      }
    })();
  }, []);

  const clearMarkers = () => {
    setMarkers([]);
  }

  return (
    <>
      <TouchableOpacity style={[styles.transparantButton, styles.whereAmIButton]} onPress={focusOnMe}>
        <Text style={styles.transparantButtonText}>Где я?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.transparantButton, styles.clearMarkersButton]} onPress={clearMarkers}>
        <Text style={styles.transparantButtonText}>Очистить маркеры</Text>
      </TouchableOpacity>
      <MapView
        style={styles.map}
        region={DEFAULT_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        ref={mapRef}
        onLongPress={addNewMarker}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            title={marker.title}
            description={marker.description}
            onCalloutPress={() => markerClick(marker)}
          />
        ))}
      </MapView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%"
  },
  transparantButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  transparantButtonText: {
    color: 'white',
    fontSize: 16,
  },
  whereAmIButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  clearMarkersButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    top: 350,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});
