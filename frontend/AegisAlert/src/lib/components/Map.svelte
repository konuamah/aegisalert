<script>
  import { onMount, onDestroy } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';

  // Set your Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1Ijoia29maW93dXN1IiwiYSI6ImNsdzNsZjliejB2amgycXBoZ29xdW02MXMifQ.nhGy0P351t8p3GYMQxHWpg';

  // Props for the component
  export let center = [-0.186964, 5.603717]; // Default center (Ghana)
  export let zoom = 5.5; // Default zoom level
  export let safeZones = null; // Safe zones GeoJSON data
  export let disaster = null; // Disaster data (location and polygon)

  let mapContainer; // Reference to the map container
  let map; // Map instance

  // Fetch safe zones from the backend
  async function fetchSafeZones() {
    try {
      const response = await fetch('http://localhost:8000/safezones/safezones-list/');
      if (!response.ok) {
        throw new Error('Failed to fetch safe zones');
      }
      const data = await response.json();
      return data; // This should be a GeoJSON FeatureCollection
    } catch (error) {
      console.error('Error fetching safe zones:', error);
      return null;
    }
  }

  onMount(async () => {
    // Fetch safe zones from the backend
    safeZones = await fetchSafeZones();

    // Initialize the map
    map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom,
      attributionControl: false, // Disable the default attribution control
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    // Wait for the map to load before adding layers
    map.on('load', () => {
      // Add safe zones if provided
      if (safeZones) {
        map.addSource('safe-zones', {
          type: 'geojson',
          data: safeZones,
        });

        map.addLayer({
          id: 'safe-zones',
          type: 'circle',
          source: 'safe-zones',
          paint: {
            'circle-radius': 8,
            'circle-color': '#00FF00', // Green color for safe zones
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF', // White border
          },
        });

        map.addLayer({
          id: 'safe-zone-labels',
          type: 'symbol',
          source: 'safe-zones',
          layout: {
            'text-field': ['get', 'name'], // Display the name property
            'text-size': 12,
            'text-offset': [0, 1.5],
            'text-anchor': 'top',
          },
          paint: {
            'text-color': '#000000', // Black text
            'text-halo-color': '#FFFFFF', // White halo for better visibility
            'text-halo-width': 2,
          },
        });
      }

      // Add disaster data if provided
      if (disaster) {
        const center = parseLocation(disaster.location);
        const polygonCoordinates = parsePolygon(disaster.polygon);

        if (center && polygonCoordinates) {
          // Add a marker for the disaster location
          new mapboxgl.Marker()
            .setLngLat(center)
            .addTo(map);

          // Add the disaster polygon
          map.addSource('disaster-polygon', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [polygonCoordinates],
              },
            },
          });

          map.addLayer({
            id: 'disaster-polygon',
            type: 'fill',
            source: 'disaster-polygon',
            layout: {},
            paint: {
              'fill-color': '#FF0000', // Red color for disaster polygon
              'fill-opacity': 0.4,
            },
          });

          // Automatically pan and zoom to the disaster location
          map.flyTo({
            center: center,
            zoom: 12, // Adjust the zoom level as needed
            essential: true, // Ensures the animation is not interrupted
          });
        }
      }
    });
  });

  onDestroy(() => {
    if (map) map.remove(); // Clean up the map when the component is destroyed
  });

  // Function to extract coordinates from the location string
  function parseLocation(location) {
    const regex = /POINT \(([-\d.]+) ([-\d.]+)\)/;
    const match = location.match(regex);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    return null;
  }

  // Function to extract polygon coordinates from the polygon string
  function parsePolygon(polygon) {
    const regex = /POLYGON \(\(([^)]+)\)\)/;
    const match = polygon.match(regex);
    if (match) {
      const coords = match[1].split(',').map(coord => {
        const [lng, lat] = coord.trim().split(' ');
        return [parseFloat(lng), parseFloat(lat)];
      });
      return coords;
    }
    return null;
  }
</script>

<style>
  .map-container {
    width: 100%;
    height: 500px;
  }
</style>

<div bind:this={mapContainer} class="map-container" />