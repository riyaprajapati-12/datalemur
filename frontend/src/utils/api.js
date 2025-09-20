// src/utils/api.js
import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:8081/api",
  timeout: 5000, // optional: timeout
});

// Generic GET request
export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    throw err;
  }
};

// Generic POST request
export const postData = async (endpoint, payload) => {
  try {
    const response = await api.post(endpoint, payload);
    return response.data;
  } catch (err) {
    console.error(`Error posting to ${endpoint}:`, err);
    throw err;
  }
};



