import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaUserTie, FaClipboardCheck, FaBook } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import api from '../../services/api'
import './Dashboard.css'

const PrincipalDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/principal', {
      params: { schoolId: 1 }   // 👈 pass schoolId here
    });
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1>Principal Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <FaUsers />
              </div>
              <div className="stat-details">
                <h3>{stats?.statistics.totalStudents || 0}</h3>
                <p>Total Students</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <FaUserTie />
              </div>
              <div className="stat-details">
                <h3>{stats?.statistics.totalTeachers || 0}</h3>
                <p>Total Teachers</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">
                <FaClipboardCheck />
              </div>
              <div className="stat-details">
                <h3>{stats?.statistics.averageAttendance || 0}%</h3>
                <p>Avg Attendance</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <FaBook />
              </div>
              <div className="stat-details">
                <h3>{stats?.statistics.totalClasses || 0}</h3>
                <p>Total Classes</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="quick-actions">
              <Link to="/students" className="action-btn">
                Manage Students
              </Link>
              <Link to="/teachers" className="action-btn">
                Manage Teachers
              </Link>
              <Link to="/attendance" className="action-btn">
                Mark Attendance
              </Link>
              <Link to="/exams" className="action-btn">
                Manage Exams
              </Link>
            </div>
          </Card>

          <div className="dashboard-grid">
            {/* Upcoming Exams */}
            <Card title="Upcoming Exams">
              {stats?.upcomingExams?.length > 0 ? (
                <ul className="exam-list">
                  {stats.upcomingExams.map((exam) => (
                    <li key={exam.id}>
                      <strong>{exam.examName}</strong>
                      <span>{exam.startDate}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming exams</p>
              )}
            </Card>

            {/* Recent Notices */}
            <Card title="Recent Notices">
              {stats?.recentNotices?.length > 0 ? (
                <ul className="notice-list">
                  {stats.recentNotices.map((notice) => (
                    <li key={notice.id}>
                      <strong>{notice.title}</strong>
                      <span>{notice.publishDate}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent notices</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PrincipalDashboard