class RestaurantAPI {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('authToken');
  }
  setAuthToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }
  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }
  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearAuthToken();
    }
  }
  async getMenuItems() {
    return this.request('/menu/items');
  }
  async createMenuItem(item) {
    return this.request('/menu/items', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  }
  async updateMenuItem(id, item) {
    return this.request(`/menu/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item)
    });
  }
  async deleteMenuItem(id) {
    return this.request(`/menu/items/${id}`, {
      method: 'DELETE'
    });
  }
  async getCategories() {
    return this.request('/menu/categories');
  }
  async getStatistics() {
    return this.request('/admin/statistics');
  }
}
window.restaurantAPI = new RestaurantAPI();
