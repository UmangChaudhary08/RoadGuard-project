/**
 * Frontend API Service
 * Interacts with ROADGUARD Express API server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Upload road photo to AI detection endpoint
 */
export async function detectRoadImage(file, metadata = {}) {
  const formData = new FormData();
  formData.append('image', file);

  if (metadata.latitude) formData.append('latitude', metadata.latitude);
  if (metadata.longitude) formData.append('longitude', metadata.longitude);
  if (metadata.isNight !== undefined) formData.append('isNight', metadata.isNight);
  if (metadata.isRaining !== undefined) formData.append('isRaining', metadata.isRaining);
  if (metadata.trafficLevel) formData.append('trafficLevel', metadata.trafficLevel);

  const res = await fetch(`${API_BASE_URL}/detect`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Detection failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Save new pothole hazard report
 */
export async function submitPotholeReport(reportData) {
  const role = localStorage.getItem('roadguard_role') || 'driver';

  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': role
    },
    body: JSON.stringify(reportData)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit report');
  }

  return res.json();
}

/**
 * Get all pothole reports with filters
 */
export async function fetchReports(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.severity && filters.severity !== 'ALL') queryParams.append('severity', filters.severity);
  if (filters.status && filters.status !== 'ALL') queryParams.append('status', filters.status);
  if (filters.waterPresent !== undefined && filters.waterPresent !== '') queryParams.append('waterPresent', filters.waterPresent);
  if (filters.minDangerScore) queryParams.append('minDangerScore', filters.minDangerScore);

  const url = `${API_BASE_URL}/reports?${queryParams.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch reports: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get hazards nearby given coordinates
 */
export async function fetchNearbyReports(latitude, longitude, radius = 5000) {
  const res = await fetch(`${API_BASE_URL}/reports/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch nearby hazards: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Update report status (Authority action: VERIFIED, RESOLVED, PENDING)
 */
export async function updateReportStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'authority'
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update report status');
  }

  return res.json();
}

/**
 * Fetch statistics for Authority dashboard
 */
export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) {
    throw new Error(`Failed to load stats: ${res.statusText}`);
  }
  return res.json();
}
