import { useState, useEffect } from 'react'
import { FaCalendar, FaClock, FaBook, FaDownload } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './StudentTimetable.css'

/**
 * Student Timetable Page
 * File: frontend/src/pages/students/StudentTimetable.jsx
 */
const StudentTimetable = () => {
  const { user } = useAuth()
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)

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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  useEffect(() => {
    fetchTimetable()
  }, [])

  const fetchTimetable = async () => {
    try {
      const response = await api.get(`/timetable/student/${user.id}`)
      if (response.success) {
        setTimetable(response.data || getDemoTimetable())
      } else {
        setTimetable(getDemoTimetable())
      }
    } catch (error) {
      console.error('Error fetching timetable:', error)
      setTimetable(getDemoTimetable())
    } finally {
      setLoading(false)
    }
  }

  const getDemoTimetable = () => ({
    Monday: [
      { period: 1, subject: 'Mathematics', teacher: 'Mrs. Smith' },
      { period: 2, subject: 'English', teacher: 'Mr. Johnson' },
      { period: 3, subject: 'Science', teacher: 'Dr. Brown' },
      { period: 5, subject: 'History', teacher: 'Ms. Davis' },
      { period: 6, subject: 'Geography', teacher: 'Mr. Wilson' },
      { period: 7, subject: 'Computer', teacher: 'Mrs. Taylor' },
      { period: 9, subject: 'Art', teacher: 'Ms. Anderson' },
      { period: 10, subject: 'Physical Education', teacher: 'Mr. Thomas' }
    ],
    Tuesday: [
      { period: 1, subject: 'English', teacher: 'Mr. Johnson' },
      { period: 2, subject: 'Mathematics', teacher: 'Mrs. Smith' },
      { period: 3, subject: 'Physics', teacher: 'Dr. Martin' },
      { period: 5, subject: 'Chemistry', teacher: 'Dr. Lee' },
      { period: 6, subject: 'Biology', teacher: 'Mrs. White' },
      { period: 7, subject: 'Hindi', teacher: 'Mr. Kumar' },
      { period: 9, subject: 'Music', teacher: 'Ms. Garcia' },
      { period: 10, subject: 'Library', teacher: 'Mrs. Clark' }
    ],
    Wednesday: [
      { period: 1, subject: 'Science', teacher: 'Dr. Brown' },
      { period: 2, subject: 'Social Studies', teacher: 'Ms. Davis' },
      { period: 3, subject: 'Mathematics', teacher: 'Mrs. Smith' },
      { period: 5, subject: 'English', teacher: 'Mr. Johnson' },
      { period: 6, subject: 'Computer', teacher: 'Mrs. Taylor' },
      { period: 7, subject: 'Art', teacher: 'Ms. Anderson' },
      { period: 9, subject: 'Physical Education', teacher: 'Mr. Thomas' },
      { period: 10, subject: 'Moral Science', teacher: 'Fr. Robert' }
    ],
    Thursday: [
      { period: 1, subject: 'Mathematics', teacher: 'Mrs. Smith' },
      { period: 2, subject: 'Physics', teacher: 'Dr. Martin' },
      { period: 3, subject: 'Chemistry', teacher: 'Dr. Lee' },
      { period: 5, subject: 'English', teacher: 'Mr. Johnson' },
      { period: 6, subject: 'Hindi', teacher: 'Mr. Kumar' },
      { period: 7, subject: 'Geography', teacher: 'Mr. Wilson' },
      { period: 9, subject: 'Computer', teacher: 'Mrs. Taylor' },
      { period: 10, subject: 'Games', teacher: 'Mr. Thomas' }
    ],
    Friday: [
      { period: 1, subject: 'English', teacher: 'Mr. Johnson' },
      { period: 2, subject: 'Science', teacher: 'Dr. Brown' },
      { period: 3, subject: 'Mathematics', teacher: 'Mrs. Smith' },
      { period: 5, subject: 'Social Studies', teacher: 'Ms. Davis' },
      { period: 6, subject: 'Computer', teacher: 'Mrs. Taylor' },
      { period: 7, subject: 'Art', teacher: 'Ms. Anderson' },
      { period: 9, subject: 'Music', teacher: 'Ms. Garcia' },
      { period: 10, subject: 'Activity', teacher: 'Various' }
    ]
  })

  const getClassForSlot = (day, periodId) => {
    const daySchedule = timetable[day] || []
    return daySchedule.find(item => item.period === periodId)
  }

  const handlePrint = () => {
    window.print()
  }

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
              <h1><FaCalendar /> My Timetable</h1>
              <p className="text-secondary">Weekly class schedule</p>
            </div>
            <button onClick={handlePrint} className="btn btn-primary">
              <FaDownload /> Print Timetable
            </button>
          </div>

          <Card>
            <div className="timetable-container">
              <table className="timetable-table">
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
                            <td key={day} className="break-cell" colSpan={1}>
                              {slot.label}
                            </td>
                          )
                        }
                        
                        const classItem = getClassForSlot(day, slot.id)
                        return (
                          <td key={day} className="timetable-cell">
                            {classItem ? (
                              <div className="subject-block">
                                <div className="subject-name">
                                  <FaBook /> {classItem.subject}
                                </div>
                                <div className="teacher-name">
                                  {classItem.teacher}
                                </div>
                              </div>
                            ) : (
                              <div className="empty-slot">-</div>
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

          <Card title="Legend">
            <div className="legend-container">
              <div className="legend-item">
                <div className="legend-color subject-block"></div>
                <span>Regular Class</span>
              </div>
              <div className="legend-item">
                <div className="legend-color break-cell"></div>
                <span>Break Time</span>
              </div>
              <div className="legend-item">
                <div className="legend-color empty-slot"></div>
                <span>No Class</span>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default StudentTimetable