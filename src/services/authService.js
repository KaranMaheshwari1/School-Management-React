import api from './api'

export const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials)
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData)
  },

  logout: async () => {
    return await api.post('/auth/logout')
  },

  changePassword: async (passwordData) => {
    return await api.post('/settings/change-password', passwordData)
  }
}