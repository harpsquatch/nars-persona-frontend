import appConfig from '../config/appConfig';

/**
 * Mock Authentication Service
 * 
 * This service simulates authentication operations for frontend development
 * without requiring a real backend connection.
 */
const mockAuthService = {
  /**
   * Simulates a login request
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Returns a promise that resolves with mock user data or rejects with an error
   */
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Check if credentials match any valid mock credentials
        const validUser = appConfig.mockAuth.validCredentials.find(
          cred => cred.email === email && cred.password === password
        );

        if (validUser) {
          // Successful login
          resolve({
            access_token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
            user: {
              id: 1,
              email: email,
              name: email.split('@')[0],
              role: email.includes('admin') ? 'admin' : 'user'
            }
          });
        } else {
          // Failed login
          reject(new Error('Invalid email or password'));
        }
      }, appConfig.mockAuth.responseDelay);
    });
  },

  /**
   * Simulates checking if a user is authenticated
   * @returns {boolean} - Returns true if a token exists in localStorage
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Simulates logging out a user
   */
  logout: () => {
    localStorage.removeItem('token');
  }
};

export default mockAuthService; 