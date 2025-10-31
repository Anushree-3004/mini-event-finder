import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useEffect, useMemo, useState } from 'react'
import type { LatLngExpression } from 'leaflet'
import type { LeafletMouseEvent } from 'leaflet'

interface Coords { lat: number; lng: number }
interface Props {
  value: Coords | null
  onChange: (value: Coords | null) => void
  height?: number
  center?: Coords
  zoom?: number
}

function ClickHandler({ onPick }: { onPick: (p: Coords) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function MapPicker({ value, onChange, height = 280, center, zoom = 12 }: Props) {
  const [current, setCurrent] = useState<Coords | null>(value)

  useEffect(() => { setCurrent(value) }, [value])

  // Try to center on user location once
  const [initialCenter, setInitialCenter] = useState<Coords | null>(center ?? null)
  useEffect(() => {
    if (initialCenter) return
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      setInitialCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    }, () => {
      setInitialCenter({ lat: 37.7749, lng: -122.4194 }) // fallback: SF
    }, { enableHighAccuracy: true, timeout: 5000 })
  }, [initialCenter])

  const mapCenter = useMemo<LatLngExpression>(() => {
    const c = current || initialCenter || { lat: 37.7749, lng: -122.4194 }
    return [c.lat, c.lng]
  }, [current, initialCenter])

  return (
    <div style={{ height, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <MapContainer center={mapCenter} zoom={current ? zoom : 11} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={(p) => { setCurrent(p); onChange(p) }} />
        {current && <Marker position={[current.lat, current.lng]} />}
      </MapContainer>
    </div>
  )
}
