/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
// 正しいインポートパス: /mapbox を追加
import { Map, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, MAP_STYLE, DEFAULT_VIEW, getVibeHSL, VIBE_TYPES } from '@/lib/mapbox';

interface Area {
  area_id: string;
  name: string;
  location: { lat: number; lng: number };
  top_vibe: string;
  top_score: number;
  vibes_for_time: Record<string, number>;
}

interface VibeMapWrapperProps {
  areas: Area[];
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  selectedVibes: string[];
  onAreaClick?: (area: Area) => void;
}

export default function VibeMapWrapper({ areas, timeOfDay, selectedVibes, onAreaClick }: VibeMapWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-sm text-gray-400 tracking-wider mb-2">Loading map...</div>
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const filteredAreas = areas.filter((area) => selectedVibes.includes(area.top_vibe));

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={DEFAULT_VIEW}
      style={{ width: '100%', height: '100%' }}
      mapStyle={MAP_STYLE}
    >
      {filteredAreas.map((area) => {
        const vibeType = area.top_vibe;
        const color = getVibeHSL(vibeType, area.top_score, timeOfDay);
        const size = 20 + (area.top_score / 100) * 30;

        return (
          <Marker
            key={area.area_id}
            longitude={area.location.lng}
            latitude={area.location.lat}
            anchor="center"
          >
            <div
              onClick={() => onAreaClick?.(area)}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                border: '2px solid white',
                borderRadius: '50%',
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              className="hover:opacity-100 hover:scale-110"
              title={area.name}
            />
          </Marker>
        );
      })}
    </Map>
  );
}