/**
 * Client Location & Geolocation Service
 */

export const DELHI_DEFAULT_COORDS = {
  latitude: 28.6139,
  longitude: 77.2090,
  label: "New Delhi Center (Demo Fallback)",
  isFallback: true
};

/**
 * Get current browser GPS location with automatic fallback
 */
export function getCurrentCoordinates() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("[Location] Geolocation not supported by browser. Using demo fallback.");
      resolve({ ...DELHI_DEFAULT_COORDS, error: "Geolocation unsupported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: Number(position.coords.latitude.toFixed(5)),
          longitude: Number(position.coords.longitude.toFixed(5)),
          accuracy: position.coords.accuracy,
          isFallback: false
        });
      },
      (err) => {
        console.warn(`[Location] GPS permission denied or timed out (${err.message}). Using Delhi demo coordinates.`);
        resolve({
          ...DELHI_DEFAULT_COORDS,
          error: err.message
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000
      }
    );
  });
}

/**
 * Calculate distance between two GPS points using Haversine formula
 */
export function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
