import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSchool, FaUsers, FaChartLine, FaCog } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'
import './Dashboard.css'

/**
 * NEW: Super Admin Dashboard
 * File: frontend/src/pages/dashboard/SuperAdminDashboard.jsx
 */
const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all schools
      const response = await api.get('/schools')
      if (response.success) {
        setSchools(response.data.content || response.data)
        
        // Calculate stats
        const totalSchools = response.data.content?.length || 0
        const activeSchools = response.data.content?.filter(s => s.isActive).length || 0
        
        setStats({
          totalSchools,
          activeSchools,
          inactiveSchools: totalSchools - activeSchools,
          totalUsers: totalSchools * 50 // Approximate
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
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
            <h1>Super Admin Dashboard</h1>
            <p>Welcome! Manage all schools from here.</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <FaSchool />
              </div>
              <div className="stat-details">
                <h3>{stats?.totalSchools || 0}</h3>
                <p>Total Schools</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-details">
                <h3>{stats?.activeSchools || 0}</h3>
                <p>Active Schools</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-details">
                <h3>{stats?.totalUsers || 0}</h3>
                <p>Total Users (Est.)</p>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">
                <FaCog />
              </div>
              <div className="stat-details">
                <h3>{stats?.inactiveSchools || 0}</h3>
                <p>Inactive Schools</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="quick-actions">
              <Link to="/schools/create" className="action-btn">
                Add New School
              </Link>
              <Link to="/schools" className="action-btn">
                Manage Schools
              </Link>
              <Link to="/settings" className="action-btn">
                System Settings
              </Link>
              <Link to="/reports" className="action-btn">
                View Reports
              </Link>
            </div>
          </Card>

          {/* Schools List */}
          <Card title="Recent Schools">
            {schools.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>School Code</th>
                      <th>School Name</th>
                      <th>City</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.slice(0, 5).map((school) => (
                      <tr key={school.id}>
                        <td>{school.schoolCode}</td>
                        <td>{school.schoolName}</td>
                        <td>{school.city || '-'}</td>
                        <td>{school.phone || '-'}</td>
                        <td>
                          <span className={`badge ${school.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {school.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <Link to={`/schools/${school.id}`} className="btn btn-sm btn-primary">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No schools found. Create your first school!</p>
            )}
            
            {schools.length > 5 && (
              <div className="card-footer">
                <Link to="/schools" className="btn btn-outline">
                  View All Schools
                </Link>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

export default SuperAdminDashboard