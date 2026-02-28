'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ destination, destinations }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !destination) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([36.8, 10.2], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add marker for selected destination
    if (destination.location?.latitude && destination.location?.longitude) {
      const marker = L.marker([destination.location.latitude, destination.location.longitude], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .bindPopup(
          `<div class="font-semibold text-[#5d4037]">${destination.name}</div>${
            destination.description ? `<p class="text-sm text-gray-600 mt-1">${destination.description}</p>` : ''
          }`
        )
        .addTo(map);

      marker.openPopup();
      map.setView([destination.location.latitude, destination.location.longitude], 10);
    }

    // Add markers for other destinations
    if (destinations && destinations.length > 0) {
      destinations.forEach((dest) => {
        if (
          dest.location?.latitude &&
          dest.location?.longitude &&
          dest._id !== destination._id
        ) {
          L.marker([dest.location.latitude, dest.location.longitude], {
            icon: L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          })
            .bindPopup(`<div class="font-semibold text-[#5d4037]">${dest.name}</div>`)
            .addTo(map);
        }
      });
    }
  }, [destination, destinations]);

  return (
    <div ref={mapRef} style={{ height: '400px', width: '100%' }} className="rounded-lg z-0" />
  );
}
