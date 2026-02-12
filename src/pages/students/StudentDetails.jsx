import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, FaEdit, FaTrash, FaFilePdf, FaFileExcel, 
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar 
} from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { studentService } from '../../services/studentService'
import { reportService } from '../../services/reportService'
import './StudentDetails.css'

/**
 * NEW: Student Details Page
 * File: frontend/src/pages/students/StudentDetails.jsx
 */
const StudentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    fetchStudentDetails()
  }, [id])

  const fetchStudentDetails = async () => {
    try {
      const response = await studentService.getStudentById(id)
      if (response.success) {
        setStudent(response.data)
      }
    } catch (error) {
      console.error('Error fetching student details:', error)
      alert('Failed to load student details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await studentService.deleteStudent(id)
        alert('Student deleted successfully')
        navigate('/students')
      } catch (error) {
        console.error('Error deleting student:', error)
        alert('Failed to delete student')
      }
    }
  }

  const handleDownloadReportCard = async () => {
    try {
      await reportService.downloadStudentReportCard(id)
    } catch (error) {
      console.error('Error downloading report card:', error)
      alert('Failed to download report card')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!student) {
    return (
      <div className="error-container">
        <h2>Student not found</h2>
        <Link to="/students" className="btn btn-primary">
          Back to Students
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
          {/* Header */}
          <div className="page-header">
            <div className="header-left">
              <Link to="/students" className="btn btn-outline">
                <FaArrowLeft /> Back
              </Link>
              <div className="header-title">
                <h1>{student.user.firstName} {student.user.lastName}</h1>
                <p className="text-secondary">Admission No: {student.admissionNumber}</p>
              </div>
            </div>
            <div className="page-actions">
              <button onClick={handleDownloadReportCard} className="btn btn-outline">
                <FaFilePdf /> Report Card
              </button>
              <Link to={`/students/${id}/edit`} className="btn btn-primary">
                <FaEdit /> Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                <FaTrash /> Delete
              </button>
            </div>
          </div>

          {/* Student Info Card */}
          <Card>
            <div className="student-profile">
              <div className="profile-avatar">
                {student.user.photoUrl ? (
                  <img src={student.user.photoUrl} alt={student.user.firstName} />
                ) : (
                  <div className="avatar-placeholder">
                    <FaUser size={60} />
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2>{student.user.firstName} {student.user.lastName}</h2>
                <div className="profile-meta">
                  <span className="meta-item">
                    <strong>Class:</strong> {student.classSection.className} {student.classSection.sectionName}
                  </span>
                  <span className="meta-item">
                    <strong>Roll No:</strong> {student.rollNumber || 'Not Assigned'}
                  </span>
                  <span className="meta-item">
                    <strong>Status:</strong> 
                    <span className={`badge ${student.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </button>
            <button 
              className={`tab ${activeTab === 'parent' ? 'active' : ''}`}
              onClick={() => setActiveTab('parent')}
            >
              Parent Information
            </button>
            <button 
              className={`tab ${activeTab === 'academic' ? 'active' : ''}`}
              onClick={() => setActiveTab('academic')}
            >
              Academic Details
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'personal' && (
            <Card title="Personal Information">
              <div className="info-grid">
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div>
                    <label>Email</label>
                    <p>{student.user.email}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div>
                    <label>Phone</label>
                    <p>{student.user.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaCalendar className="info-icon" />
                  <div>
                    <label>Date of Birth</label>
                    <p>{student.user.dateOfBirth || 'Not provided'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaUser className="info-icon" />
                  <div>
                    <label>Gender</label>
                    <p>{student.user.gender || 'Not provided'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <label>Address</label>
                    <p>{student.user.address || 'Not provided'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div>
                    <label>Blood Group</label>
                    <p>{student.bloodGroup || 'Not provided'}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div>
                    <label>Admission Date</label>
                    <p>{student.admissionDate || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'parent' && (
            <Card title="Parent Information">
              <div className="parent-info">
                {/* Father Details */}
                <div className="parent-section">
                  <h3>Father's Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name</label>
                      <p>{student.fatherName || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{student.fatherPhone || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label>Occupation</label>
                      <p>{student.fatherOccupation || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Mother Details */}
                <div className="parent-section">
                  <h3>Mother's Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name</label>
                      <p>{student.motherName || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <p>{student.motherPhone || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label>Occupation</label>
                      <p>{student.motherOccupation || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Guardian/Emergency */}
                <div className="parent-section">
                  <h3>Guardian/Emergency Contact</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Guardian Name</label>
                      <p>{student.guardianName || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label>Guardian Phone</label>
                      <p>{student.guardianPhone || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label>Relation</label>
                      <p>{student.guardianRelation || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label>Emergency Contact</label>
                      <p>{student.emergencyContact || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'academic' && (
            <div>
              <Card title="Academic Information">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Class</label>
                    <p>{student.classSection.className} {student.classSection.sectionName}</p>
                  </div>
                  <div className="info-item">
                    <label>Roll Number</label>
                    <p>{student.rollNumber || 'Not assigned'}</p>
                  </div>
                  <div className="info-item">
                    <label>Admission Number</label>
                    <p>{student.admissionNumber}</p>
                  </div>
                  <div className="info-item">
                    <label>Admission Date</label>
                    <p>{student.admissionDate || 'Not provided'}</p>
                  </div>
                </div>
              </Card>

              <div className="academic-actions">
                <Link to={`/students/${id}/attendance`} className="btn btn-outline">
                  View Attendance
                </Link>
                <Link to={`/students/${id}/results`} className="btn btn-outline">
                  View Results
                </Link>
                <Link to={`/students/${id}/performance`} className="btn btn-outline">
                  Performance Report
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default StudentDetails