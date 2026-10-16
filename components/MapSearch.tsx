"use client";
import React, { useState } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';

// Define the bounds type for convenience
export type Bounds = {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
};

/**
 * MapSearch component allows the user to draw a rectangular bounding box on the map.
 * When the rectangle is drawn (by clicking two opposite corners), the component calls
 * `onBoundsSelected` with the chosen bounds.
 */
export function MapSearch() {
  const router = useRouter();
  const [rect, setRect] = useState<Bounds | null>(null);
  const [firstClick, setFirstClick] = useState<{ lat: number; lng: number } | null>(null);

  const handleBoundsSelected = (bounds: Bounds) => {
    const params = new URLSearchParams();
    params.set('swLat', bounds.sw.lat.toString());
    params.set('swLng', bounds.sw.lng.toString());
    params.set('neLat', bounds.ne.lat.toString());
    params.set('neLng', bounds.ne.lng.toString());
    router.replace(`?${params.toString()}`);
  };

  // Hook into map clicks
  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (!firstClick) {
          setFirstClick({ lat, lng });
          setRect(null);
        } else {
          const sw = { lat: Math.min(firstClick.lat, lat), lng: Math.min(firstClick.lng, lng) };
          const ne = { lat: Math.max(firstClick.lat, lat), lng: Math.max(firstClick.lng, lng) };
          const bounds = { sw, ne };
          setRect(bounds);
          setFirstClick(null);
          handleBoundsSelected(bounds);
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[6.5244, 3.3792]} // Default centre – Lagos
      zoom={10}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <ClickHandler />
      {rect && (
        <Rectangle
          bounds={[
            [rect.sw.lat, rect.sw.lng],
            [rect.ne.lat, rect.ne.lng],
          ]}
          pathOptions={{ color: 'blue' }}
        />
      )}
    </MapContainer>
  );
}
