import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaArrowLeft, FaEdit, FaUsers, FaChalkboardTeacher, FaBullhorn } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'
import './SchoolDetails.css'

/**
 * School Details Page - View and manage specific school
 * File: frontend/src/pages/schools/SchoolDetails.jsx
 */
const SchoolDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [school, setSchool] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchoolDetails()
  }, [id])

  const fetchSchoolDetails = async () => {
    try {
      const response = await api.get(`/schools/${id}`)
      if (response.success) {
        setSchool(response.data)
      }
      
      // Fetch school statistics
      // This would need a backend endpoint
      setStats({
        totalStudents: 450,
        totalTeachers: 35,
        totalClasses: 12,
        activeUsers: 485
      })
    } catch (error) {
      console.error('Error fetching school:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!school) {
    return (
      <div className="error-container">
        <h2>School not found</h2>
        <Link to="/schools" className="btn btn-primary">
          Back to Schools
        </Link>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <div>
              <h1>{school.schoolName}</h1>
              <p className="text-secondary">{school.schoolCode}</p>
            </div>
            <div className="page-actions">
              <button onClick={() => navigate('/schools')} className="btn btn-outline">
                <FaArrowLeft /> Back
              </button>
              <Link to={`/schools/${id}/edit`} className="btn btn-primary">
                <FaEdit /> Edit School
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-details">
                <h3>{stats?.totalStudents || 0}</h3>
                <p>Total Students</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">
                <FaChalkboardTeacher />
              </div>
              <div className="stat-details">
                <h3>{stats?.totalTeachers || 0}</h3>
                <p>Total Teachers</p>
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon">
                <FaBullhorn />
              </div>
              <div className="stat-details">
                <h3>{stats?.totalClasses || 0}</h3>
                <p>Total Classes</p>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-details">
                <h3>{stats?.activeUsers || 0}</h3>
                <p>Active Users</p>
              </div>
            </div>
          </div>

          {/* School Information */}
          <Card title="School Information">
            <div className="info-grid">
              <div className="info-item">
                <label>School Name</label>
                <p>{school.schoolName}</p>
              </div>
              <div className="info-item">
                <label>School Code</label>
                <p>{school.schoolCode}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{school.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{school.phone}</p>
              </div>
              <div className="info-item">
                <label>Website</label>
                <p>{school.website || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Board</label>
                <p>{school.board}</p>
              </div>
              <div className="info-item">
                <label>Established Year</label>
                <p>{school.establishedYear || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Status</label>
                <span className={`badge ${school.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {school.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>

          {/* Address */}
          <Card title="Address">
            <div className="info-grid">
              <div className="info-item">
                <label>Address</label>
                <p>{school.address}</p>
              </div>
              <div className="info-item">
                <label>City</label>
                <p>{school.city}</p>
              </div>
              <div className="info-item">
                <label>State</label>
                <p>{school.state}</p>
              </div>
              <div className="info-item">
                <label>Country</label>
                <p>{school.country}</p>
              </div>
              <div className="info-item">
                <label>Pincode</label>
                <p>{school.pincode}</p>
              </div>
            </div>
          </Card>

          {/* Enabled Modules */}
          <Card title="Enabled Modules">
            <div className="modules-status">
              <div className={`module-badge ${school.attendanceModule ? 'enabled' : 'disabled'}`}>
                Attendance Management
              </div>
              <div className={`module-badge ${school.examModule ? 'enabled' : 'disabled'}`}>
                Exam Management
              </div>
              <div className={`module-badge ${school.timetableModule ? 'enabled' : 'disabled'}`}>
                Timetable
              </div>
              <div className={`module-badge ${school.complaintModule ? 'enabled' : 'disabled'}`}>
                Complaint Management
              </div>
              <div className={`module-badge ${school.eventModule ? 'enabled' : 'disabled'}`}>
                Event Management
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="quick-actions-grid">
              <Link to={`/students?schoolId=${id}`} className="action-card">
                <FaUsers />
                <span>View Students</span>
              </Link>
              <Link to={`/teachers?schoolId=${id}`} className="action-card">
                <FaChalkboardTeacher />
                <span>View Teachers</span>
              </Link>
              <Link to={`/attendance?schoolId=${id}`} className="action-card">
                <FaBullhorn />
                <span>Attendance</span>
              </Link>
              <Link to={`/reports?schoolId=${id}`} className="action-card">
                <FaBullhorn />
                <span>Reports</span>
              </Link>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default SchoolDetails