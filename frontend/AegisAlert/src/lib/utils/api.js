// Fetch disaster alerts from Django backend
export async function fetchDisaster() {
  const url = "http://localhost:8000/disasters/disaster-list/"; // Replace with your Django backend URL
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.map((alert) => ({
          id: alert.id,
          message: alert.name,
          location: parseLocation(alert.location), // Parse the location field
          affectedRadius: alert.affected_radius,
          active: alert.active,
          polygon: parsePolygon(alert.polygon), // Parse the polygon field
      }));
  } catch (error) {
      console.error("Error fetching Django alerts:", error);
      return [];
  }
}

// Helper function to parse location (POINT) from Django response
function parseLocation(location) {
  if (!location) return null;
  const matches = location.match(/POINT \(([^ ]+) ([^ ]+)\)/);
  if (matches && matches.length === 3) {
      return {
          longitude: parseFloat(matches[1]),
          latitude: parseFloat(matches[2]),
      };
  }
  return null;
}

// Helper function to parse polygon from Django response
function parsePolygon(polygon) {
  if (!polygon) return null;
  const matches = polygon.match(/POLYGON \(\(([^)]+)\)\)/);
  if (matches && matches.length === 2) {
      const points = matches[1].split(", ").map((point) => {
          const [longitude, latitude] = point.split(" ");
          return {
              longitude: parseFloat(longitude),
              latitude: parseFloat(latitude),
          };
      });
      return points;
  }
  return null;
}