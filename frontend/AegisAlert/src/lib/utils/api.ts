// Constants from environment variables
const BASE_URL: string = import.meta.env.VITE_BASE_URL;
const WEATHER_API_KEY: string = import.meta.env.VITE_WEATHER_API_KEY;

// Types
interface WeatherData {
  current: {
    temp_c: number; // Temperature in Celsius
    humidity: number; // Humidity in percentage
    wind_kph: number; // Wind speed in km/h
    condition: {
      text: string; // Weather condition (e.g., "Sunny")
    };
  };
}

interface WeatherMetrics {
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  condition: string | null;
}

interface DisasterAlert {
  id: number;
  name: string;
  location: string | null;
  affected_radius: number;
  active: boolean;
  polygon: string | null;
}

interface Location {
  longitude: number;
  latitude: number;
}

type Polygon = Location[];

interface Disaster {
  id: number;
  message: string;
  location: Location | null;
  affectedRadius: number;
  active: boolean;
  polygon: Polygon | null;
  timestamp: string;
}

// Helper functions
const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch data');
  }
  return response.json();
};

const parseLocation = (location: string | null): Location | null => {
  if (!location) return null;
  const matches = location.match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
  if (matches && matches.length === 3) {
    return {
      longitude: parseFloat(matches[1]),
      latitude: parseFloat(matches[2]),
    };
  }
  return null;
};

const parsePolygon = (polygon: string | null): Polygon | null => {
  if (!polygon) return null;
  const matches = polygon.match(/POLYGON \(\(([^)]+)\)\)/);
  if (matches && matches.length === 2) {
    return matches[1].split(', ').map((point) => {
      const [longitude, latitude] = point.split(' ');
      return {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      };
    });
  }
  return null;
};

// API functions
export const fetchSafeZones = async (): Promise<GeoJSON.FeatureCollection | null> => {
  try {
    const response = await fetch(`${BASE_URL}/safezones/safezones-list/`);
    if (!response.ok) throw new Error('Failed to fetch safe zones');
    return await response.json();
  } catch (error) {
    console.error('Error fetching safe zones:', error);
    return null;
  }
};

export const fetchWeatherData = async (city: string = 'Accra'): Promise<WeatherMetrics> => {
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`;

  try {
    const response = await fetch(apiUrl);
    const data: WeatherData = await handleResponse(response);

    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      condition: data.current.condition.text,
    };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchDisasters = async (): Promise<Disaster[]> => {
  const response = await fetch(`${BASE_URL}/disasters/disaster-list/`);
  const data: DisasterAlert[] = await handleResponse(response);

  return data.map((alert) => ({
    id: alert.id,
    message: alert.name,
    location: parseLocation(alert.location),
    affectedRadius: alert.affected_radius,
    active: alert.active,
    polygon: parsePolygon(alert.polygon),
    timestamp: new Date().toLocaleString(),
  }));
};