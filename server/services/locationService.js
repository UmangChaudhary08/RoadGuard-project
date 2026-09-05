/**
 * Location Service
 * Implements Haversine distance calculations and location utilities.
 */

// Earth's radius in meters
const EARTH_RADIUS_METERS = 6371000;

/**
 * Converts degrees to radians
 */
function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates great-circle distance between two points using the Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in meters
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Filter and sort potholes within a given radius
 * @param {Array} potholes 
 * @param {number} userLat 
 * @param {number} userLon 
 * @param {number} radiusMeters 
 * @returns {Array} Potholes with distance property, sorted by distance
 */
export function getNearbyPotholes(potholes, userLat, userLon, radiusMeters = 5000) {
  return potholes
    .map(pothole => {
      const distance = calculateHaversineDistance(
        userLat,
        userLon,
        pothole.latitude,
        pothole.longitude
      );
      return {
        ...pothole,
        distanceMeters: distance,
        distanceText: distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(1)} km`
      };
    })
    .filter(p => p.distanceMeters <= radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/**
 * Fallback coordinates when browser geolocation is denied or unavailable
 */
export const DEMO_DEFAULT_LOCATION = {
  latitude: 28.6139,
  longitude: 77.2090,
  locationName: "New Delhi Central Corridor (Demo)",
  isDemoFallback: true
};
