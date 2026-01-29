import api from "./axios";

/**
 * Logs API Functions
 * Handles deployment logs and real-time logging
 * Socket.io can be used for real-time updates
 */

// Get logs for a specific deployment
export const getDeploymentLogs = (deploymentId) =>
  api.get(`/logs/${deploymentId}`);

// Stream logs for real-time monitoring (non-WebSocket endpoint)
export const streamDeploymentLogs = (deploymentId) =>
  api.get(`/logs/${deploymentId}?stream=true`);

// Create a log entry
export const createLog = (data) =>
  api.post("/logs", data);
