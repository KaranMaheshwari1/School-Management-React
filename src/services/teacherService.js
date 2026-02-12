import api from './api'

export const teacherService = {
  getAllTeachers: async (params = {}) => {
    return await api.get('/teachers', { params })
  },

  getTeacherById: async (id) => {
    return await api.get(`/teachers/${id}`)
  },

  createTeacher: async (teacherData) => {
    return await api.post('/teachers', teacherData)
  },

  updateTeacher: async (id, teacherData) => {
    return await api.put(`/teachers/${id}`, teacherData)
  },

  deleteTeacher: async (id) => {
    return await api.delete(`/teachers/${id}`)
  },

  getTeacherSchedule: async (id) => {
    return await api.get(`/teachers/${id}/schedule`)
  },

  getTeacherSubjects: async (id) => {
    return await api.get(`/teachers/${id}/subjects`)
  }
}