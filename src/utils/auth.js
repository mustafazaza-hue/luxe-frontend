// /**
//  * Get authorization headers for API requests
//  * @returns {Object} Headers object with authorization token if available
//  */
// export function getAuthHeaders() {
//   const headers = {
//     "Content-Type": "application/json",
//   };

//   // Check if we're in the browser environment
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }
//   }

//   return headers;
// }

// /**
//  * Set the auth token in local storage
//  * @param {string} token - The authentication token
//  */
// export function setAuthToken(token) {
//   if (typeof window !== "undefined") {
//     localStorage.setItem("authToken", token);
//   }
// }

// /**
//  * Clear the auth token from local storage
//  */
// export function clearAuthToken() {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem("authToken");
//   }
// }

// /**
//  * Get the stored auth token
//  * @returns {string|null} The stored token or null
//  */
// export function getAuthToken() {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("authToken");
//   }
//   return null;
// }
