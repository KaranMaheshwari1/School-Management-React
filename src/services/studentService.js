import api from './api'

/**
 * UPDATED: Added search method
 * File: frontend/src/services/studentService.js
 */
export const studentService = {
  getAllStudents: async (params = {}) => {
    return await api.get('/students', { params })
  },

  /**
   * NEW: Search students with filters
   */
  searchStudents: async (params = {}) => {
    return await api.get('/students/search', { params })
  },

  getStudentById: async (id) => {
    return await api.get(`/students/${id}`)
  },

  createStudent: async (studentData) => {
    return await api.post('/students', studentData)
  },

  updateStudent: async (id, studentData) => {
    return await api.put(`/students/${id}`, studentData)
  },

  deleteStudent: async (id) => {
    return await api.delete(`/students/${id}`)
  },

  getStudentPerformance: async (id) => {
    return await api.get(`/students/${id}/performance`)
  },

  getStudentResults: async (id, params = {}) => {
    return await api.get(`/students/${id}/results`, { params })
  }
}
