import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './TeacherForm.css'

/**
 * Edit Teacher Page
 * File: frontend/src/pages/teachers/TeacherEdit.jsx
 */
const TeacherEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    employeeCode: '',
    qualification: '',
    experience: '',
    joiningDate: '',
    salary: '',
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
    designation: 'TEACHER',
    department: '',
    specialization: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyContactName: ''
  })

  useEffect(() => {
    fetchTeacherData()
  }, [id])

  const fetchTeacherData = async () => {
    try {
      const response = await api.get(`/teachers/${id}`)
      if (response.success) {
        const teacher = response.data
        setFormData({
          employeeCode: teacher.employeeCode || '',
          qualification: teacher.qualification || '',
          experience: teacher.experience || '',
          joiningDate: teacher.joiningDate || '',
          salary: teacher.salary || '',
          firstName: teacher.user?.firstName || '',
          lastName: teacher.user?.lastName || '',
          dateOfBirth: teacher.user?.dateOfBirth || '',
          gender: teacher.user?.gender || 'MALE',
          phone: teacher.user?.phone || '',
          email: teacher.user?.email || '',
          address: teacher.user?.address || '',
          city: teacher.user?.city || '',
          state: teacher.user?.state || '',
          pincode: teacher.user?.pincode || '',
          designation: teacher.designation || 'TEACHER',
          department: teacher.department || '',
          specialization: teacher.specialization || '',
          bloodGroup: teacher.bloodGroup || '',
          emergencyContact: teacher.emergencyContact || '',
          emergencyContactName: teacher.emergencyContactName || ''
        })
      }
    } catch (error) {
      console.error('Error fetching teacher:', error)
      alert('Failed to load teacher data')
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
      const response = await api.put(`/teachers/${id}`, formData)
      if (response.success) {
        alert('Teacher updated successfully!')
        navigate('/teachers')
      }
    } catch (error) {
      console.error('Error updating teacher:', error)
      alert(error.response?.data?.message || 'Failed to update teacher')
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
              <h1>Edit Teacher</h1>
              <p className="text-secondary">Update teacher information</p>
            </div>
            <button onClick={() => navigate('/teachers')} className="btn btn-outline">
              <FaArrowLeft /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Card title="Employment Information">
              <div className="form-row">
                <div className="form-group">
                  <label>Employee Code *</label>
                  <input
                    type="text"
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Joining Date *</label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Designation *</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                  >
                    <option value="TEACHER">Teacher</option>
                    <option value="SENIOR_TEACHER">Senior Teacher</option>
                    <option value="HEAD_TEACHER">Head Teacher</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="VICE_PRINCIPAL">Vice Principal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Qualification *</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Monthly Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </Card>

            <Card title="Personal Information">
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
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
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

            <Card title="Emergency Contact">
              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Number</label>
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
                onClick={() => navigate('/teachers')} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <FaSave /> {saving ? 'Updating...' : 'Update Teacher'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default TeacherEdit