import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './StudentEdit.css'

/**
 * Student Edit Page - Update student information
 * File: frontend/src/pages/students/StudentEdit.jsx
 */
const StudentEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [classes, setClasses] = useState([])
  const [formData, setFormData] = useState({
    admissionNumber: '',
    rollNumber: '',
    classSectionId: '',
    admissionDate: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    motherName: '',
    motherPhone: '',
    motherOccupation: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: '',
    emergencyContact: '',
    bloodGroup: ''
  })

  useEffect(() => {
    fetchClasses()
    fetchStudentData()
  }, [id])

  const fetchClasses = async () => {
    try {
      const response = await api.get('/class-sections', {
        params: { schoolId: user.schoolId }
      })
      if (response.success) {
        setClasses(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/students/${id}`)
      
      if (response.success) {
        const student = response.data
        setFormData({
          admissionNumber: student.admissionNumber || '',
          rollNumber: student.rollNumber || '',
          classSectionId: student.classSection?.id || '',
          admissionDate: student.admissionDate || '',
          firstName: student.user?.firstName || '',
          lastName: student.user?.lastName || '',
          dateOfBirth: student.user?.dateOfBirth || '',
          gender: student.user?.gender || 'MALE',
          phone: student.user?.phone || '',
          email: student.user?.email || '',
          address: student.user?.address || '',
          city: student.user?.city || '',
          state: student.user?.state || '',
          pincode: student.user?.pincode || '',
          fatherName: student.fatherName || '',
          fatherPhone: student.fatherPhone || '',
          fatherOccupation: student.fatherOccupation || '',
          motherName: student.motherName || '',
          motherPhone: student.motherPhone || '',
          motherOccupation: student.motherOccupation || '',
          guardianName: student.guardianName || '',
          guardianPhone: student.guardianPhone || '',
          guardianRelation: student.guardianRelation || '',
          emergencyContact: student.emergencyContact || '',
          bloodGroup: student.bloodGroup || ''
        })
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      alert('Failed to load student data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await api.put(`/students/${id}`, formData)
      if (response.success) {
        alert('Student updated successfully!')
        navigate(`/students/${id}`)
      }
    } catch (error) {
      console.error('Error updating student:', error)
      alert(error.response?.data?.message || 'Failed to update student')
    } finally {
      setSaving(false)
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
          <div className="page-header">
            <div>
              <h1>Edit Student</h1>
              <p className="text-secondary">Update student information</p>
            </div>
            <button onClick={() => navigate(`/students/${id}`)} className="btn btn-outline">
              <FaArrowLeft /> Back to Details
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Card title="Basic Information">
              <div className="form-row">
                <div className="form-group">
                  <label>Admission Number *</label>
                  <input
                    type="text"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleChange}
                    required
                    disabled
                    title="Admission number cannot be changed"
                  />
                  <small>Admission number cannot be changed</small>
                </div>
                <div className="form-group">
                  <label>Class/Section *</label>
                  <select
                    name="classSectionId"
                    value={formData.classSectionId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.classEntity?.className} {cls.section?.sectionName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Roll Number</label>
                  <input
                    type="number"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Roll number"
                  />
                </div>
                <div className="form-group">
                  <label>Admission Date *</label>
                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card title="Personal Details">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </Card>

            <Card title="Parent Information">
              <h4>Father's Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Father's Phone</label>
                  <input
                    type="tel"
                    name="fatherPhone"
                    value={formData.fatherPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Father's Occupation</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                />
              </div>

              <h4>Mother's Details</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Mother's Name</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Mother's Phone</label>
                  <input
                    type="tel"
                    name="motherPhone"
                    value={formData.motherPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Mother's Occupation</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                />
              </div>

              <h4>Guardian/Emergency Contact</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Guardian Name</label>
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Guardian Phone</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Relation</label>
                  <input
                    type="text"
                    name="guardianRelation"
                    value={formData.guardianRelation}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Card>

            <Card title="Address">
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </Card>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate(`/students/${id}`)} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <FaSave /> {saving ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default StudentEdit