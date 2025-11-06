/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { Map, Marker, Layer, Source } from 'react-map-gl/mapbox';
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

// 円を描画するための関数（半径mをピクセルに変換）
function createCircle(center: [number, number], radiusInMeters: number, points: number = 64) {
  const coords = [];
  const distanceX = radiusInMeters / (111320 * Math.cos((center[1] * Math.PI) / 180));
  const distanceY = radiusInMeters / 110574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center[0] + x, center[1] + y]);
  }
  coords.push(coords[0]); // 閉じる

  return coords;
}

export default function VibeMapWrapper({ areas, timeOfDay, selectedVibes, onAreaClick }: VibeMapWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef(null);

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

  // GeoJSONデータを生成（円形エリア）
  const circleGeoJSON = {
    type: 'FeatureCollection',
    features: filteredAreas.map((area) => {
      const vibeInfo = VIBE_TYPES[area.top_vibe];
      const radiusInMeters = 300 + (area.top_score / 100) * 700; // 300m〜1000m
      
      return {
        type: 'Feature',
        properties: {
          area_id: area.area_id,
          name: area.name,
          vibe: area.top_vibe,
          score: area.top_score,
          color: vibeInfo?.hex || '#10b981',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [createCircle([area.location.lng, area.location.lat], radiusInMeters)],
        },
      };
    }),
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={DEFAULT_VIEW}
      style={{ width: '100%', height: '100%' }}
      mapStyle={MAP_STYLE}
    >
      {/* 円形グラデーションレイヤー（雨雲レーダー風） */}
      <Source id="vibe-circles" type="geojson" data={circleGeoJSON}>
        <Layer
          id="vibe-circles-layer"
          type="fill"
          paint={{
            'fill-color': ['get', 'color'],
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['get', 'score'],
              0, 0.05,
              50, 0.15,
              100, 0.25
            ],
          }}
        />
        {/* 円の境界線 */}
        <Layer
          id="vibe-circles-outline"
          type="line"
          paint={{
            'line-color': ['get', 'color'],
            'line-width': 2,
            'line-opacity': 0.6,
          }}
        />
      </Source>

      {/* マーカー（アイコン） */}
  {/* エリア名ラベル */}
      {filteredAreas.map((area) => {
        const vibeInfo = VIBE_TYPES[area.top_vibe];
        
        return (
          <Marker
            key={`label-${area.area_id}`}
            longitude={area.location.lng}
            latitude={area.location.lat}
            anchor="center"
          >
            <div
              onClick={() => onAreaClick?.(area)}
              style={{
                cursor: 'pointer',
                pointerEvents: 'none', // クリックは中央のアイコンで
                textAlign: 'center',
                marginTop: '60px', // アイコンの下に表示
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: `2px solid ${vibeInfo?.hex}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  whiteSpace: 'nowrap',
                }}
              >
                {area.name}
                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                  {vibeInfo?.name_ja} {Math.round(area.top_score)}%
                </div>
              </div>
            </div>
          </Marker>
        );
      })}
    </Map>
  );
}