import { useState, useEffect } from 'react'
import { FaCalendar, FaCheck, FaTimes, FaClock, FaSave } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { attendanceService } from '../../services/attendanceService'
import api from '../../services/api'
import './AttendanceManagement.css'

/**
 * Attendance Management Page
 * File: frontend/src/pages/attendance/AttendanceManagement.jsx
 */
const AttendanceManagement = () => {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass, selectedDate])

  const fetchClasses = async () => {
    try {
      const response = await api.get('/class-sections', {
        params: { schoolId: user.schoolId }
      })
      if (response.success) {
        setClasses(response.data || [
          { id: 1, classEntity: { className: '5' }, section: { sectionName: 'A' } },
          { id: 2, classEntity: { className: '5' }, section: { sectionName: 'B' } },
          { id: 3, classEntity: { className: '6' }, section: { sectionName: 'A' } }
        ])
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/students', {
        params: {
          schoolId: user.schoolId,
          classSectionId: selectedClass,
          size: 100
        }
      })

      if (response.success) {
        const studentList = response.data.content || []
        setStudents(studentList)

        // Initialize attendance state
        const attendanceState = {}
        studentList.forEach(student => {
          attendanceState[student.id] = 'PRESENT'
        })
        setAttendance(attendanceState)

        // Fetch existing attendance for the date
        fetchExistingAttendance(studentList)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExistingAttendance = async (studentList) => {
    try {
      const response = await api.get(`/attendance/class/${selectedClass}`, {
        params: { date: selectedDate }
      })

      if (response.success && response.data.length > 0) {
        const existingAttendance = {}
        response.data.forEach(record => {
          existingAttendance[record.user.id] = record.status
        })
        setAttendance(existingAttendance)
      }
    } catch (error) {
      console.error('Error fetching existing attendance:', error)
    }
  }

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleMarkAll = (status) => {
    const newAttendance = {}
    students.forEach(student => {
      newAttendance[student.id] = status
    })
    setAttendance(newAttendance)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedClass) {
      alert('Please select a class')
      return
    }

    setSaving(true)

    try {
      const attendanceList = students.map(student => ({
        studentId: student.user.id,
        status: attendance[student.id] || 'PRESENT',
        remarks: ''
      }))

      await attendanceService.markAttendance({
        classSectionId: parseInt(selectedClass),
        attendanceDate: selectedDate,
        attendanceList
      })

      alert('Attendance marked successfully!')
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Failed to mark attendance')
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT': return 'success'
      case 'ABSENT': return 'danger'
      case 'LATE': return 'warning'
      case 'HALF_DAY': return 'info'
      case 'LEAVE': return 'secondary'
      default: return 'primary'
    }
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <h1>Attendance Management</h1>
            <p className="text-secondary">Mark daily attendance for students</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              {/* Filters */}
              <div className="attendance-filters">
                <div className="filter-group">
                  <label>Date</label>
                  <div className="input-with-icon">
                    <FaCalendar className="input-icon" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="filter-group">
                  <label>Class/Section</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        Class {cls.classEntity?.className || ''} {cls.section?.sectionName || ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="quick-actions">
                  <button 
                    type="button" 
                    onClick={() => handleMarkAll('PRESENT')}
                    className="btn btn-success btn-sm"
                  >
                    <FaCheck /> Mark All Present
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleMarkAll('ABSENT')}
                    className="btn btn-danger btn-sm"
                  >
                    <FaTimes /> Mark All Absent
                  </button>
                </div>
              </div>

              {/* Student List */}
              {loading ? (
                <LoadingSpinner />
              ) : students.length > 0 ? (
                <>
                  <div className="attendance-list">
                    {students.map((student, index) => (
                      <div key={student.id} className="attendance-item">
                        <div className="student-info">
                          <span className="student-number">{index + 1}</span>
                          <div className="student-details">
                            <strong>
                              {student.user.firstName} {student.user.lastName}
                            </strong>
                            <small>Roll No: {student.rollNumber || '-'}</small>
                          </div>
                        </div>

                        <div className="status-buttons">
                          {['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE'].map(status => (
                            <button
                              key={status}
                              type="button"
                              className={`status-btn ${attendance[student.id] === status ? 'active' : ''} ${getStatusColor(status)}`}
                              onClick={() => handleAttendanceChange(student.id, status)}
                            >
                              {status.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="attendance-summary">
                    <div className="summary-item">
                      <span className="summary-label">Total Students:</span>
                      <span className="summary-value">{students.length}</span>
                    </div>
                    <div className="summary-item success">
                      <span className="summary-label">Present:</span>
                      <span className="summary-value">
                        {Object.values(attendance).filter(s => s === 'PRESENT').length}
                      </span>
                    </div>
                    <div className="summary-item danger">
                      <span className="summary-label">Absent:</span>
                      <span className="summary-value">
                        {Object.values(attendance).filter(s => s === 'ABSENT').length}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={saving}
                    >
                      <FaSave /> {saving ? 'Saving...' : 'Save Attendance'}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-secondary">
                  {selectedClass ? 'No students found in this class' : 'Please select a class'}
                </p>
              )}
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AttendanceManagement