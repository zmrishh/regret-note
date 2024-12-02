import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: You do not have permission');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }
    }

    return Promise.reject(error);
  }
);

// Confession-related API methods
export interface ConfessionCreateDTO {
  content: string;
  audioContent?: string | null;
  emotions: string[];
  anonymityLevel: 'full' | 'location' | 'username';
  contentType: 'text' | 'audio';
  isPublic: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface ConfessionResponse {
  _id: string;
  content: string;
  audioContent?: string;
  emotions: string[];
  anonymityLevel: string;
  contentType: string;
  createdAt: Date;
  updatedAt: Date;
}

class ConfessionService {
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://localhost:5001/api';
  }

  async create(confessionData: ConfessionCreateDTO): Promise<ConfessionResponse> {
    try {
      // Attempt to get geolocation if not provided
      if (!confessionData.location) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 0
            });
          });

          confessionData.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (geoError) {
          console.warn('Geolocation not available:', geoError);
          // Optionally set a default location or remove location
          confessionData.location = undefined;
        }
      }

      const response = await api.post<ConfessionResponse>(`/confessions`, confessionData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating confession:', error);
      throw error;
    }
  }

  async getNearbyConfessions(
    latitude: number, 
    longitude: number, 
    radius: number = 100
  ): Promise<ConfessionResponse[]> {
    try {
      const response = await api.get<ConfessionResponse[]>(`/confessions/nearby`, {
        params: { latitude, longitude, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby confessions:', error);
      throw error;
    }
  }

  async getRecentConfessions(
    page: number = 1, 
    limit: number = 20
  ): Promise<ConfessionResponse[]> {
    try {
      const response = await api.get<ConfessionResponse[]>(`/confessions`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent confessions:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<ConfessionResponse> {
    try {
      const response = await api.get<ConfessionResponse>(`/confessions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get confession error:', error);
      throw error;
    }
  }

  async react(id: string, reactionType: 'empathy' | 'support' | 'relate'): Promise<any> {
    try {
      const response = await api.post(`/confessions/${id}/react`, { reactionType });
      return response.data;
    } catch (error) {
      console.error('Confession reaction error:', error);
      throw error;
    }
  }
}

export const confessionService = new ConfessionService();

// Authentication-related API methods
export const authService = {
  // User registration
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // User login
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Fetch profile error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export default api;
