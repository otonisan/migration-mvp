'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

if (typeof window !== 'undefined') {
  const icon = L.Icon.Default.prototype as unknown;
  delete (icon as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface Property {
  id: string;
  title: string;
  prefecture: string;
  city: string;
  rent: number;
  layout: string;
  lat: number;
  lng: number;
}

interface PropertyMapProps {
  properties: Property[];
  onMarkerClick?: (propertyId: string) => void;
}

function MapBounds(props: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (props.properties.length > 0) {
      const bounds = L.latLngBounds(
        props.properties.map(function(p) {
          return [p.lat, p.lng] as [number, number];
        })
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [props.properties, map]);

  return null;
}

export default function PropertyMap(props: PropertyMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(function() {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white">地図を読み込み中</p>
      </div>
    );
  }

  const center: [number, number] = [36.2048, 138.2529];
  const minHeight = '500px';

  return (
    <MapContainer center={center} zoom={5} style={{ height: '100%', minHeight: minHeight }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {props.properties.map(function(property) {
        return (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            eventHandlers={{
              click: function() {
                if (props.onMarkerClick) {
                  props.onMarkerClick(property.id);
                }
              },
            }}
          >
            <Popup>
              <div>
                <h3>{property.title}</h3>
                <p>{property.prefecture} {property.city}</p>
                <p>{property.rent.toLocaleString()}円</p>
                <p>間取り: {property.layout}</p>
                <a href={`/properties/${property.id}`}>詳細を見る</a>
              </div>
            </Popup>
          </Marker>
        );
      })}
      <MapBounds properties={props.properties} />
    </MapContainer>
  );
}