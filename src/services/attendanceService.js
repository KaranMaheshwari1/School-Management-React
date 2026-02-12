import api from './api'

export const attendanceService = {
  markAttendance: async (attendanceData) => {
    return await api.post('/attendance', attendanceData)
  },

  getClassAttendance: async (classSectionId, date) => {
    return await api.get(`/attendance/class/${classSectionId}`, {
      params: { date }
    })
  },

  getStudentAttendance: async (studentId, startDate, endDate) => {
    return await api.get(`/attendance/student/${studentId}`, {
      params: { startDate, endDate }
    })
  },

  getAttendanceReport: async (params) => {
    return await api.get('/attendance/report', { params })
  }
}