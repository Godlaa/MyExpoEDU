export type MarkerType = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  images: ImageType[];
}

export type MarkerTypeUrl = {
  id: string;
  latitude: string;
  longitude: string;
  title: string;
  description: string;
  images: string[];
}

export type MarkerContextType = {
  markers: MarkerType[];
  addMarker: (marker: MarkerType) => void;
  getMarker: (id: string) => MarkerType | undefined;
};

export type ImageListTypeUrl = {
  images: string;
  marker: string;
}

export type ImageListType = {
  images: ImageType[];
  marker: MarkerType;
}

export type ImageType = {
  id: string;
  uri: string;
}

