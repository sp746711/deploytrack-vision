import api from "./axios";

/**
 * Incidents API Functions
 * Handles incident/alert related API calls
 */

// Get all incidents
export const getIncidents = () =>
  api.get("/incidents");

// Get incidents for a specific project
export const getProjectIncidents = (projectId) =>
  api.get(`/incidents?projectId=${projectId}`);

// Create a new incident/alert
export const createIncident = (data) =>
  api.post("/incidents", data);

// Update incident status
export const updateIncident = (id, data) =>
  api.put(`/incidents/${id}`, data);
