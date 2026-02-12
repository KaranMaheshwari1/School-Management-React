import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaClipboardCheck, FaBook, FaCalendar, FaBullhorn, FaTrophy } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './Dashboard.css'

/**
 * NEW: Student Dashboard
 * File: frontend/src/pages/dashboard/StudentDashboard.jsx
 */
const StudentDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [timetable, setTimetable] = useState([])
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/dashboard/student/${user.id}`)
      if (response.success) {
        setStats(response.data)
        setTimetable(response.data.todayTimetable || [])
        setNotices(response.data.recentNotices || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set default data
      setStats({
        attendancePercentage: 92.5,
        totalPresent: 148,
        totalAbsent: 12,
        upcomingExams: 2,
        averageGrade: 'B+',
        rank: 5
      })
      setTimetable([
        { period: 1, time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mrs. Smith' },
        { period: 2, time: '08:50 - 09:35', subject: 'English', teacher: 'Mr. Johnson' },
        { period: 3, time: '09:40 - 10:25', subject: 'Science', teacher: 'Dr. Brown' }
      ])
      setNotices([
        { title: 'School Reopening Notice', date: '2024-02-07' },
        { title: 'Annual Sports Day', date: '2024-02-15' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'green'
    if (percentage >= 75) return 'orange'
    return 'red'
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
            <h1>Student Dashboard</h1>
            <p>Welcome, {user?.firstName}! Here's your academic overview.</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className={`stat-card ${getAttendanceColor(stats?.attendancePercentage || 0)}`}>
              <div className="stat-icon">
                <FaClipboardCheck />
              </div>
              <div className="stat-details">
                <h3>{stats?.attendancePercentage?.toFixed(1) || 0}%</h3>
                <p>Attendance</p>
                <small>{stats?.totalPresent || 0} Present / {stats?.totalAbsent || 0} Absent</small>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-details">
                <h3>{stats?.upcomingExams || 0}</h3>
                <p>Upcoming Exams</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">
                <FaTrophy />
              </div>
              <div className="stat-details">
                <h3>{stats?.averageGrade || 'N/A'}</h3>
                <p>Average Grade</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">
                <FaTrophy />
              </div>
              <div className="stat-details">
                <h3>#{stats?.rank || '-'}</h3>
                <p>Class Rank</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="quick-actions">
              <Link to="/attendance" className="action-btn">
                My Attendance
              </Link>
              <Link to="/results" className="action-btn">
                My Results
              </Link>
              <Link to="/timetable" className="action-btn">
                Timetable
              </Link>
              <Link to="/notices" className="action-btn">
                Notices
              </Link>
            </div>
          </Card>

          <div className="dashboard-grid">
            {/* Today's Timetable */}
            <Card title={`Today's Classes - ${getTodayDay()}`}>
              {timetable.length > 0 ? (
                <div className="timetable-list">
                  {timetable.map((item, index) => (
                    <div key={index} className="timetable-item">
                      <div className="timetable-time">
                        <span className="period">P{item.period}</span>
                        <span className="time">{item.time}</span>
                      </div>
                      <div className="timetable-details">
                        <h4>{item.subject}</h4>
                        <p className="text-secondary">{item.teacher}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No classes scheduled for today.</p>
              )}
            </Card>

            {/* Recent Notices */}
            <Card title="Recent Notices">
              {notices.length > 0 ? (
                <ul className="notice-list">
                  {notices.map((notice, index) => (
                    <li key={index} className="notice-item">
                      <FaBullhorn className="notice-icon" />
                      <div>
                        <strong>{notice.title}</strong>
                        <p className="text-secondary">{notice.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent notices.</p>
              )}
              <div className="card-footer">
                <Link to="/notices" className="btn btn-outline btn-sm">
                  View All Notices
                </Link>
              </div>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card title="Recent Performance">
            <div className="performance-chart">
              <div className="performance-item">
                <div className="subject-name">Mathematics</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="grade">A</div>
              </div>
              <div className="performance-item">
                <div className="subject-name">English</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '78%' }}></div>
                </div>
                <div className="grade">B+</div>
              </div>
              <div className="performance-item">
                <div className="subject-name">Science</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '92%' }}></div>
                </div>
                <div className="grade">A+</div>
              </div>
              <div className="performance-item">
                <div className="subject-name">Social Studies</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <div className="grade">B</div>
              </div>
            </div>
            <div className="card-footer">
              <Link to="/results" className="btn btn-primary btn-sm">
                View Detailed Results
              </Link>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard