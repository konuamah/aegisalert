<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';
  import { fetchSafeZones } from '../utils/api'; // Fetch function for safe zones

  // Mapbox access token and default settings
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  export let center: [number, number] = [-0.186964, 5.603717]; // Default center (Accra, Ghana)
  export let zoom: number = 5.5; // Default zoom level
  export let safeZones: GeoJSON.FeatureCollection | null = null; // Safe zones GeoJSON
  export let disaster: { location: string; polygon: string } | null = null; // Disaster details

  let mapContainer: HTMLElement; // Map container element
  let map: mapboxgl.Map; // Map instance

  onMount(async () => {
    safeZones = await fetchSafeZones(); // Fetch safe zones data

    // Initialize the map
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11', 
      center,
      zoom,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl()); // Add zoom and rotation controls

    map.on('load', () => {
      // Add safe zones to the map
      if (safeZones) {
        map.addSource('safe-zones', { type: 'geojson', data: safeZones });
        map.addLayer({
          id: 'safe-zones',
          type: 'circle',
          source: 'safe-zones',
          paint: { 'circle-radius': 8, 'circle-color': '#00FF00', 'circle-stroke-width': 2, 'circle-stroke-color': '#FFFFFF' },
        });
        map.addLayer({
          id: 'safe-zone-labels',
          type: 'symbol',
          source: 'safe-zones',
          layout: { 'text-field': ['get', 'name'], 'text-size': 12, 'text-offset': [0, 1.5], 'text-anchor': 'top' },
          paint: { 'text-color': '#000000', 'text-halo-color': '#FFFFFF', 'text-halo-width': 2 },
        });
      }

      // Add disaster data if available
      if (disaster) {
        const center = parseLocation(disaster.location);
        const polygonCoordinates = parsePolygon(disaster.polygon);

        if (center && polygonCoordinates) {
          new mapboxgl.Marker().setLngLat(center).addTo(map); // Add disaster location marker
          map.addSource('disaster-polygon', {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [polygonCoordinates] }, properties: {} },
          });
          map.addLayer({
            id: 'disaster-polygon',
            type: 'fill',
            source: 'disaster-polygon',
            paint: { 'fill-color': '#FF0000', 'fill-opacity': 0.4 },
          });
          map.flyTo({ center, zoom: 12, essential: true }); // Focus on the disaster area
        }
      }
    });
  });

  onDestroy(() => {
    if (map) map.remove(); // Clean up map resources
  });

  // Parse location string into coordinates
  function parseLocation(location: string): [number, number] | null {
    const match = location.match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
    return match ? [parseFloat(match[1]), parseFloat(match[2])] : null;
  }

  // Parse polygon string into coordinate array
  function parsePolygon(polygon: string): [number, number][] | null {
    const match = polygon.match(/POLYGON \(\(([^)]+)\)\)/);
    return match
      ? match[1].split(',').map(coord => {
          const [lng, lat] = coord.trim().split(' ');
          return [parseFloat(lng), parseFloat(lat)];
        })
      : null;
  }
</script>

<style>
  .map-container {
    width: 100%;
    height: 500px;
  }
</style>

<div bind:this={mapContainer} class="map-container"></div>
