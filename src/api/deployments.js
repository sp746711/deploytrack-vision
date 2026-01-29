import api from "./axios";

/**
 * Deployments API Functions
 * Handles deployment-related API calls
 */

// Get all deployments for a specific project
export const getDeployments = (projectId) =>
  api.get(`/deployments/${projectId}`);

// Create a new deployment
export const createDeployment = (data) =>
  api.post("/deployments", data);

// Get deployment status/details
export const getDeploymentDetails = (deploymentId) =>
  api.get(`/deployments/${deploymentId}`);
