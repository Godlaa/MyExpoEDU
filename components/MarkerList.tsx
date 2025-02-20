import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImageList from './ImageList';
import { useLocalSearchParams } from 'expo-router';
import { MarkerTypeUrl } from '@/types';

export default function MarkerList() {

    const params = useLocalSearchParams<MarkerTypeUrl>();

    const marker = {
      id: params.id,
      title: params.title,
      description: params.description,
      latitude: parseFloat(params.latitude),
      longitude: parseFloat(params.longitude),
      images: params.images,
    };

  return (
    <View>
      <Text style={styles.title}>{marker.title}</Text>
      <Text style={styles.description}>{marker.description}</Text>
      <Text style={styles.coordinates}>
        Координаты: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
      </Text>
      <Text style={styles.subTitle}>Изображения:</Text>
      <ImageList />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },
  description: {
    fontSize: 16,
    marginBottom: 5
  },
  coordinates: {
    fontSize: 14,
    marginBottom: 15,
    color: 'gray'
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10
  },
});