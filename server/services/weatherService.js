/**
 * Weather & Environmental Context Service
 * Evaluates ambient conditions (day/night, precipitation, traffic)
 */

export function analyzeEnvironmentalContext(inputContext = {}) {
  const now = new Date();
  const currentHour = now.getHours();

  // Night condition: 7:00 PM (19) to 6:00 AM (6)
  const isNight = inputContext.isNight !== undefined 
    ? Boolean(inputContext.isNight) 
    : (currentHour >= 19 || currentHour < 6);

  // Rain condition: from input or heuristic simulation
  const isRaining = inputContext.isRaining !== undefined 
    ? Boolean(inputContext.isRaining) 
    : false;

  // Traffic density: low, moderate, heavy
  const trafficLevel = inputContext.trafficLevel || (
    (currentHour >= 8 && currentHour <= 11) || (currentHour >= 17 && currentHour <= 21)
      ? "heavy"
      : "moderate"
  );

  return {
    isNight,
    isRaining,
    trafficLevel,
    ambientLight: isNight ? "low" : "adequate",
    roadSurfaceCondition: isRaining ? "wet_slippery" : "dry"
  };
}
