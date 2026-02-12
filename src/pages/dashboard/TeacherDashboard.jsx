import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaClipboardCheck, FaBook, FaCalendar, FaClock } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './Dashboard.css'

/**
 * NEW: Teacher Dashboard
 * File: frontend/src/pages/dashboard/TeacherDashboard.jsx
 */
const TeacherDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/dashboard/teacher/${user.id}`)
      if (response.success) {
        setStats(response.data.statistics)
        setSchedule(response.data.todaySchedule || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set default data
      setStats({
        totalStudents: 120,
        totalClasses: 5,
        todayClasses: 4,
        pendingGrading: 15
      })
      setSchedule([
        {
          period: 1,
          time: '08:00 - 08:45',
          classSection: '5A',
          subject: 'Mathematics',
          room: '101'
        },
        {
          period: 2,
          time: '08:50 - 09:35',
          classSection: '6B',
          subject: 'Mathematics',
          room: '102'
        },
        {
          period: 3,
          time: '09:40 - 10:25',
          classSection: '7A',
          subject: 'Mathematics',
          room: '103'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getTodayDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[new Date().getDay()]
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
          <div className="dashboard-header">
            <h1>Teacher Dashboard</h1>
            <p>Welcome back, {user?.firstName}! Here's your overview for today.</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-details">
                <h3>{stats?.totalStudents || 0}</h3>
                <p>My Students</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-details">
                <h3>{stats?.totalClasses || 0}</h3>
                <p>Total Classes</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-details">
                <h3>{stats?.todayClasses || 0}</h3>
                <p>Classes Today</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">
                <FaClipboardCheck />
              </div>
              <div className="stat-details">
                <h3>{stats?.pendingGrading || 0}</h3>
                <p>Pending Grading</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="quick-actions">
              <Link to="/attendance" className="action-btn">
                Mark Attendance
              </Link>
              <Link to="/students" className="action-btn">
                View Students
              </Link>
              <Link to="/exams" className="action-btn">
                Manage Exams
              </Link>
              <Link to="/schedule" className="action-btn">
                My Schedule
              </Link>
            </div>
          </Card>

          <div className="dashboard-grid">
            {/* Today's Schedule */}
            <Card title={`Today's Schedule - ${getTodayDay()}`}>
              {schedule.length > 0 ? (
                <div className="schedule-list">
                  {schedule.map((item, index) => (
                    <div key={index} className="schedule-item">
                      <div className="schedule-time">
                        <FaClock className="schedule-icon" />
                        <span>{item.time}</span>
                      </div>
                      <div className="schedule-details">
                        <h4>Period {item.period}</h4>
                        <p>
                          <strong>{item.subject}</strong> - Class {item.classSection}
                        </p>
                        <p className="text-secondary">Room: {item.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No classes scheduled for today.</p>
              )}
            </Card>

            {/* Upcoming Tasks */}
            <Card title="Upcoming Tasks">
              <ul className="task-list">
                <li className="task-item">
                  <FaClipboardCheck className="task-icon pending" />
                  <div>
                    <strong>Grade Unit Test Papers</strong>
                    <p className="text-secondary">Class 5A - Mathematics</p>
                  </div>
                </li>
                <li className="task-item">
                  <FaBook className="task-icon pending" />
                  <div>
                    <strong>Prepare Lesson Plan</strong>
                    <p className="text-secondary">Next Week - Algebra</p>
                  </div>
                </li>
                <li className="task-item">
                  <FaCalendar className="task-icon" />
                  <div>
                    <strong>Parent-Teacher Meeting</strong>
                    <p className="text-secondary">Next Saturday</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card title="Recent Activity">
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">Today, 10:30 AM</span>
                <span className="activity-text">Marked attendance for Class 5A</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">Yesterday, 2:00 PM</span>
                <span className="activity-text">Uploaded test results for Class 6B</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">2 days ago</span>
                <span className="activity-text">Created new assignment for Class 7A</span>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default TeacherDashboard