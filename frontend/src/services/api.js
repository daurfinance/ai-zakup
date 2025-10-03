const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('accessToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(token) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Companies
  async getCompany() {
    return this.request('/companies/profile');
  }

  async updateCompany(companyData) {
    return this.request('/companies/profile', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async verifyCompany() {
    return this.request('/companies/verify', {
      method: 'POST',
    });
  }

  // Tenders/Lots
  async getTenders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/lots${queryString ? `?${queryString}` : ''}`);
  }

  async getTender(id) {
    return this.request(`/lots/${id}`);
  }

  async createTender(tenderData) {
    return this.request('/lots', {
      method: 'POST',
      body: JSON.stringify(tenderData),
    });
  }

  async updateTender(id, tenderData) {
    return this.request(`/lots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tenderData),
    });
  }

  async deleteTender(id) {
    return this.request(`/lots/${id}`, {
      method: 'DELETE',
    });
  }

  async publishTender(id) {
    return this.request(`/lots/${id}/publish`, {
      method: 'POST',
    });
  }

  async closeTender(id) {
    return this.request(`/lots/${id}/close`, {
      method: 'POST',
    });
  }

  async selectWinner(id) {
    return this.request(`/lots/${id}/select-winner`, {
      method: 'POST',
    });
  }

  async getMyTenders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/lots/my${queryString ? `?${queryString}` : ''}`);
  }

  // Bids
  async getBids(lotId) {
    return this.request(`/bids/lot/${lotId}`);
  }

  async getMyBids(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bids/my${queryString ? `?${queryString}` : ''}`);
  }

  async createBid(bidData) {
    return this.request('/bids', {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  }

  async updateBid(id, bidData) {
    return this.request(`/bids/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bidData),
    });
  }

  async deleteBid(id) {
    return this.request(`/bids/${id}`, {
      method: 'DELETE',
    });
  }

  // Files
  async uploadFile(file, entityType, entityId, category = 'general') {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(`/files/upload?entityType=${entityType}&entityId=${entityId}&category=${category}`, {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async uploadMultipleFiles(files, entityType, entityId, category = 'general') {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.request(`/files/upload-multiple?entityType=${entityType}&entityId=${entityId}&category=${category}`, {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async getFile(id) {
    return this.request(`/files/${id}`);
  }

  async getFilesByEntity(entityType, entityId, category) {
    const params = new URLSearchParams({ entityType, entityId });
    if (category) params.append('category', category);
    return this.request(`/files/entity/${entityType}/${entityId}?${params.toString()}`);
  }

  async deleteFile(id) {
    return this.request(`/files/${id}`, {
      method: 'DELETE',
    });
  }

  // Escrow
  async getEscrowAccount(lotId) {
    return this.request(`/escrow/lot/${lotId}`);
  }

  async createEscrowAccount(escrowData) {
    return this.request('/escrow', {
      method: 'POST',
      body: JSON.stringify(escrowData),
    });
  }

  async updateEscrowAccount(id, escrowData) {
    return this.request(`/escrow/${id}`, {
      method: 'PUT',
      body: JSON.stringify(escrowData),
    });
  }

  // Statistics and Analytics
  async getDashboardStats() {
    return this.request('/stats/dashboard');
  }

  async getTenderStats(id) {
    return this.request(`/stats/tender/${id}`);
  }

  // Search and Filters
  async searchTenders(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.request(`/search/tenders?${params.toString()}`);
  }

  async getRegions() {
    return this.request('/reference/regions');
  }

  async getCategories() {
    return this.request('/reference/categories');
  }

  // Notifications
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications${queryString ? `?${queryString}` : ''}`);
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'POST',
    });
  }

  // Utility methods
  getFileUrl(fileId) {
    const token = localStorage.getItem('accessToken');
    return `${this.baseURL}/files/${fileId}?token=${token}`;
  }

  getFilePreviewUrl(fileId) {
    const token = localStorage.getItem('accessToken');
    return `${this.baseURL}/files/${fileId}/preview?token=${token}`;
  }

  // Error handling helper
  handleApiError(error) {
    if (error.message.includes('401')) {
      // Unauthorized - redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return;
    }
    
    // Return user-friendly error message
    return error.message || 'Произошла ошибка при выполнении запроса';
  }
}

export default new ApiService();
