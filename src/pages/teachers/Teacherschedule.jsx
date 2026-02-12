import { useState, useEffect } from 'react'
import { FaCalendar, FaClock, FaBook, FaDownload, FaPlus, FaEdit } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './TeacherSchedule.css'

/**
 * Teacher Schedule Page - View and manage teacher's weekly schedule
 * File: frontend/src/pages/teachers/TeacherSchedule.jsx
 */
const TeacherSchedule = () => {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState({})
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  const timeSlots = [
    { id: 1, time: '08:00 - 08:45', label: 'Period 1' },
    { id: 2, time: '08:50 - 09:35', label: 'Period 2' },
    { id: 3, time: '09:40 - 10:25', label: 'Period 3' },
    { id: 4, time: '10:30 - 10:45', label: 'Break', isBreak: true },
    { id: 5, time: '10:45 - 11:30', label: 'Period 4' },
    { id: 6, time: '11:35 - 12:20', label: 'Period 5' },
    { id: 7, time: '12:25 - 13:10', label: 'Period 6' },
    { id: 8, time: '13:10 - 13:50', label: 'Lunch Break', isBreak: true },
    { id: 9, time: '13:50 - 14:35', label: 'Period 7' },
    { id: 10, time: '14:40 - 15:25', label: 'Period 8' }
  ]

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/teachers/${user.id}/schedule`)
      
      if (response.success) {
        setSchedule(response.data || getDemoSchedule())
      } else {
        setSchedule(getDemoSchedule())
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
      setSchedule(getDemoSchedule())
    } finally {
      setLoading(false)
    }
  }

  const getDemoSchedule = () => ({
    Monday: [
      { period: 1, className: '5A', subject: 'Mathematics', room: '201' },
      { period: 2, className: '6B', subject: 'Mathematics', room: '202' },
      { period: 3, className: '7A', subject: 'Mathematics', room: '203' },
      { period: 5, className: '5B', subject: 'Mathematics', room: '201' },
      { period: 6, className: '8A', subject: 'Mathematics', room: '204' },
      { period: 9, className: '9A', subject: 'Mathematics', room: '205' },
      { period: 10, className: '10B', subject: 'Mathematics', room: '206' }
    ],
    Tuesday: [
      { period: 1, className: '6A', subject: 'Mathematics', room: '202' },
      { period: 2, className: '7B', subject: 'Mathematics', room: '203' },
      { period: 3, className: '5A', subject: 'Mathematics', room: '201' },
      { period: 5, className: '8B', subject: 'Mathematics', room: '204' },
      { period: 6, className: '9A', subject: 'Mathematics', room: '205' },
      { period: 7, className: '10A', subject: 'Mathematics', room: '206' },
      { period: 9, type: 'MEETING', description: 'Department Meeting', room: 'Staff Room' }
    ],
    Wednesday: [
      { period: 1, className: '7A', subject: 'Mathematics', room: '203' },
      { period: 2, className: '5A', subject: 'Mathematics', room: '201' },
      { period: 3, className: '6A', subject: 'Mathematics', room: '202' },
      { period: 5, className: '9B', subject: 'Mathematics', room: '205' },
      { period: 6, className: '8A', subject: 'Mathematics', room: '204' },
      { period: 9, className: '10A', subject: 'Mathematics', room: '206' },
      { period: 10, className: '5B', subject: 'Mathematics', room: '201' }
    ],
    Thursday: [
      { period: 1, className: '8A', subject: 'Mathematics', room: '204' },
      { period: 2, className: '9A', subject: 'Mathematics', room: '205' },
      { period: 3, className: '10A', subject: 'Mathematics', room: '206' },
      { period: 5, className: '5A', subject: 'Mathematics', room: '201' },
      { period: 6, className: '6B', subject: 'Mathematics', room: '202' },
      { period: 7, className: '7A', subject: 'Mathematics', room: '203' },
      { period: 9, type: 'FREE', description: 'Free Period' }
    ],
    Friday: [
      { period: 1, className: '9A', subject: 'Mathematics', room: '205' },
      { period: 2, className: '10B', subject: 'Mathematics', room: '206' },
      { period: 3, className: '8B', subject: 'Mathematics', room: '204' },
      { period: 5, className: '7B', subject: 'Mathematics', room: '203' },
      { period: 6, className: '5A', subject: 'Mathematics', room: '201' },
      { period: 9, className: '6A', subject: 'Mathematics', room: '202' },
      { period: 10, type: 'ACTIVITY', description: 'Sports Activity' }
    ],
    Saturday: [
      { period: 1, className: '5B', subject: 'Mathematics', room: '201' },
      { period: 2, className: '6A', subject: 'Mathematics', room: '202' },
      { period: 3, className: '7A', subject: 'Mathematics', room: '203' },
      { period: 5, type: 'EXAM', description: 'Exam Invigilation', room: 'Hall A' },
      { period: 6, type: 'FREE', description: 'Free Period' }
    ]
  })

  const getClassForSlot = (day, periodId) => {
    const daySchedule = schedule[day] || []
    return daySchedule.find(item => item.period === periodId)
  }

  const handlePrint = () => {
    window.print()
  }

  const calculateWeeklyStats = () => {
    let totalClasses = 0
    let uniqueClasses = new Set()
    let freePeriodsCount = 0

    Object.values(schedule).forEach(daySchedule => {
      daySchedule.forEach(slot => {
        if (slot.className) {
          totalClasses++
          uniqueClasses.add(slot.className)
        } else if (slot.type === 'FREE') {
          freePeriodsCount++
        }
      })
    })

    return {
      totalClasses,
      uniqueClasses: uniqueClasses.size,
      freePeriods: freePeriodsCount,
      workload: ((totalClasses / 48) * 100).toFixed(1) // 48 = total periods in a week (8 periods x 6 days)
    }
  }

  const stats = calculateWeeklyStats()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <div>
              <h1><FaCalendar /> My Schedule</h1>
              <p className="text-secondary">Weekly teaching schedule</p>
            </div>
            <div className="page-actions">
              <button onClick={handlePrint} className="btn btn-outline">
                <FaDownload /> Print Schedule
              </button>
              <button 
                onClick={() => setEditMode(!editMode)} 
                className="btn btn-primary"
              >
                <FaEdit /> {editMode ? 'View Mode' : 'Edit Mode'}
              </button>
            </div>
          </div>

          {/* Weekly Statistics */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-details">
                <h3>{stats.totalClasses}</h3>
                <p>Total Classes/Week</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-details">
                <h3>{stats.uniqueClasses}</h3>
                <p>Different Classes</p>
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-details">
                <h3>{stats.freePeriods}</h3>
                <p>Free Periods</p>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-details">
                <h3>{stats.workload}%</h3>
                <p>Weekly Workload</p>
              </div>
            </div>
          </div>

          {/* Schedule Table */}
          <Card>
            <div className="schedule-container">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th className="time-column">
                      <FaClock /> Time
                    </th>
                    {days.map(day => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(slot => (
                    <tr key={slot.id}>
                      <td className="time-slot">
                        <div className="time-info">
                          <strong>{slot.label}</strong>
                          <small>{slot.time}</small>
                        </div>
                      </td>
                      {days.map(day => {
                        if (slot.isBreak) {
                          return (
                            <td key={day} className="break-cell">
                              {slot.label}
                            </td>
                          )
                        }
                        
                        const classItem = getClassForSlot(day, slot.id)
                        return (
                          <td key={day} className="schedule-cell">
                            {classItem ? (
                              <div className={`class-block ${classItem.type ? classItem.type.toLowerCase() : 'teaching'}`}>
                                {classItem.className ? (
                                  <>
                                    <div className="class-name">
                                      <FaBook /> {classItem.className}
                                    </div>
                                    <div className="subject-name">
                                      {classItem.subject}
                                    </div>
                                    <div className="room-number">
                                      Room: {classItem.room}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="activity-type">
                                      {classItem.type}
                                    </div>
                                    <div className="activity-desc">
                                      {classItem.description}
                                    </div>
                                    {classItem.room && (
                                      <div className="room-number">
                                        {classItem.room}
                                      </div>
                                    )}
                                  </>
                                )}
                                {editMode && (
                                  <button className="edit-btn-small">
                                    <FaEdit />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="empty-slot">
                                {editMode ? (
                                  <button className="add-class-btn">
                                    <FaPlus /> Add Class
                                  </button>
                                ) : (
                                  '-'
                                )}
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Legend */}
          <Card title="Legend">
            <div className="legend-container">
              <div className="legend-item">
                <div className="legend-color class-block teaching"></div>
                <span>Teaching Class</span>
              </div>
              <div className="legend-item">
                <div className="legend-color class-block meeting"></div>
                <span>Meeting</span>
              </div>
              <div className="legend-item">
                <div className="legend-color class-block exam"></div>
                <span>Exam Duty</span>
              </div>
              <div className="legend-item">
                <div className="legend-color class-block free"></div>
                <span>Free Period</span>
              </div>
              <div className="legend-item">
                <div className="legend-color class-block activity"></div>
                <span>Activity/Sports</span>
              </div>
              <div className="legend-item">
                <div className="legend-color break-cell"></div>
                <span>Break Time</span>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default TeacherSchedule