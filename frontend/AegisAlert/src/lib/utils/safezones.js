export const safeZones = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          name: 'Safe Zone 1',
          type: 'Evacuation Center',
        },
        geometry: {
          type: 'Point',
          coordinates: [-118.2437, 34.0522], // Los Angeles
        },
      },
      {
        type: 'Feature',
        properties: {
          name: 'Safe Zone 2',
          type: 'Shelter',
        },
        geometry: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749], // San Francisco
        },
      },
      {
        type: 'Feature',
        properties: {
          name: 'Safe Zone 3',
          type: 'Designated Safe Area',
        },
        geometry: {
          type: 'Point',
          coordinates: [-121.4944, 38.5816], // Sacramento
        },
      },
    ],
  };
