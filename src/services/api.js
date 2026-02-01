// Base API service for making HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL

// Determine whether to use mock API (default to false if not set)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Debug: Log the API URL
console.log('API_BASE_URL:', API_BASE_URL);
console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL is not defined in environment variables');
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }
  return response.json();
};

// Mock data for authentication
const mockAuthData = {
  users: [
    { email: 'admin@example.com', password: 'password123', role: 'admin' },
    { email: 'user@example.com', password: 'password123', role: 'user' }
  ]
};

// Authentication services
export const authService = {
  login: async (email, password, remember = false) => {
    // If mock API is enabled
    if (USE_MOCK_API) {
      console.log('Using mock authentication');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock data
      const user = mockAuthData.users.find(
        u => u.email === email && u.password === password
      );
      
      if (user) {
        return {
          access_token: `mock-token-${Date.now()}`,
          user: {
            id: 1,
            email: user.email,
            role: user.role
          }
        };
      } else {
        throw new Error('Invalid email or password');
      }
    }
    
    // Real API call
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password,
        remember_me: remember 
      }),
    });
    return handleResponse(response);
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('remember_token');
    localStorage.removeItem('rememberedEmail');
  },

  loginWithToken: async (email, token) => {
    const response = await fetch(`${API_BASE_URL}/login/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        remember_token: token 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Token login failed');
    }
    
    return response.json();
  }
};

// Archetype services
export const archetypeService = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/archetypes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/archetypes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
};

// Look services
export const lookService = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/looks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/looks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  getByArchetype: async (archetypeId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/archetypes/${archetypeId}/looks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
};

// Product services
export const productService = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  getByLook: async (lookId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/looks/${lookId}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
};

// Consultations services
export const consultationService = {
  getUserConsultations: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/consultations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
  
  getConsultationById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/consultations/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  }
};

// Admin services
export const adminService = {
  // Archetypes
  addArchetypesBulk: async (archetypesData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/archetypes/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(archetypesData),
    });
    return handleResponse(response);
  },
  
  // Products
  addProductsBulk: async (productsData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/products/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productsData),
    });
    return handleResponse(response);
  },
  
  // Looks
  addLooksBulk: async (looksData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/looks/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(looksData),
    });
    return handleResponse(response);
  },
  
  // Associations
  associateArchetypeLooks: async (associationData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/archetypes/bulk-associate-looks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(associationData),
    });
    return handleResponse(response);
  },
  
  associateLookProducts: async (lookId, productIds) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/looks/${lookId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product_ids: productIds }),
    });
    return handleResponse(response);
  }
};

export const fetchData = async (endpoint, options = {}) => {
  try {
    // Use the API_BASE_URL from environment variables
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Get token for authorization
    const token = localStorage.getItem('token');
    
    // Set up default options with authorization header
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    
    // Merge default options with provided options
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {})
      }
    };
    
    const response = await fetch(url, fetchOptions);
    return handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export { API_BASE_URL }; 