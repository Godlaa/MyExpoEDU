import React, { useEffect, useState } from 'react';
import { ScrollView, Image, StyleSheet, Text, Alert, View, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Crypto from 'expo-crypto';
import { useDatabase } from "@/contexts/DatabaseContext";
import { MarkerImages } from '@/types';

type Props = {
  markerId: number;
}

export default function ImageList({ markerId }: Props) {
  const [imagesArray, setImages] = useState<MarkerImages[]>([]);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const { getMarkerImages, addImage } = useDatabase();

  if (status === null) {
    requestPermission();
  }

  useEffect(() => {
    const fetchImages = async (id: number) => {
      const images = await getMarkerImages(id);
      setImages(images);
    };

    fetchImages(markerId);
  }, [markerId]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(prev => [
        ...prev,
        { id: Date.now(), uri: result.assets[0].uri, markerId: markerId },
      ]);

      addImage(markerId, result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const deleteImage = (uri: string) => {
    Alert.alert(
      "Удалить изображение?",
      "Вы уверены, что хотите удалить это изображение?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", onPress: () => setImages(prev => prev.filter(img => img.uri !== uri)) },
      ]
    );
  };

  const renderImageItem = (uri: string) => (
    <View style={styles.item}>
      <Image source={{ uri }} style={styles.itemPhoto} resizeMode="cover" />
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(uri)}>
        <Text style={styles.deleteButtonText}>Удалить</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        {imagesArray.length > 0 ? (
          <FlatList<MarkerImages>
            data={imagesArray}
            renderItem={({ item }) => renderImageItem(item.uri)}
            keyExtractor={({ id }) => id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.noImagesText}>Изображения отсутствуют</Text>
        )}
        <TouchableOpacity style={styles.addButton} onPress={pickImageAsync}>
          <Text style={styles.addButtonText}>Добавить изображение</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    margin: 10,
  },
  itemPhoto: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(255,0,0,0.7)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#afd33d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noImagesText: {
    fontStyle: 'italic',
    color: 'gray',
  },
});