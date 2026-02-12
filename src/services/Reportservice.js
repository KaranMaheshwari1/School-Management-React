import api from './api'

/**
 * NEW: Service for report generation and export
 * File: frontend/src/services/reportService.js
 */
export const reportService = {
  
  /**
   * Download student list as PDF
   */
  downloadStudentsPDF: async (schoolId, classSectionId = null, searchTerm = null) => {
    try {
      const params = { schoolId }
      if (classSectionId) params.classSectionId = classSectionId
      if (searchTerm) params.searchTerm = searchTerm

      const response = await api.get('/reports/students/pdf', {
        params,
        responseType: 'blob'
      })

      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `students_report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      throw error
    }
  },

  /**
   * Download student list as Excel
   */
  downloadStudentsExcel: async (schoolId, classSectionId = null, searchTerm = null) => {
    try {
      const params = { schoolId }
      if (classSectionId) params.classSectionId = classSectionId
      if (searchTerm) params.searchTerm = searchTerm

      const response = await api.get('/reports/students/excel', {
        params,
        responseType: 'blob'
      })

      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `students_report_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error('Error downloading Excel:', error)
      throw error
    }
  },

  /**
   * Download individual student report card as PDF
   */
  downloadStudentReportCard: async (studentId) => {
    try {
      const response = await api.get(`/reports/students/${studentId}/report-card/pdf`, {
        responseType: 'blob'
      })

      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report_card_${studentId}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error('Error downloading report card:', error)
      throw error
    }
  },

  /**
   * Download attendance report as PDF
   */
  downloadAttendancePDF: async (studentId, startDate, endDate) => {
    try {
      const response = await api.get(`/reports/students/${studentId}/attendance/pdf`, {
        params: { startDate, endDate },
        responseType: 'blob'
      })

      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `attendance_report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error('Error downloading attendance PDF:', error)
      throw error
    }
  },

  /**
   * Download attendance report as Excel
   */
  downloadAttendanceExcel: async (studentId, startDate, endDate) => {
    try {
      const response = await api.get(`/reports/students/${studentId}/attendance/excel`, {
        params: { startDate, endDate },
        responseType: 'blob'
      })

      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      console.error('Error downloading attendance Excel:', error)
      throw error
    }
  }
}