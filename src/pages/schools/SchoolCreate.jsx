import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import api from '../../services/api'
import './SchoolForm.css'

/**
 * Create School Page
 * File: frontend/src/pages/schools/SchoolCreate.jsx
 */
const SchoolCreate = () => {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    establishedYear: '',
    board: 'CBSE',
    primaryColor: '#1976d2',
    secondaryColor: '#424242',
    attendanceModule: true,
    examModule: true,
    timetableModule: true,
    complaintModule: true,
    eventModule: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await api.post('/schools', formData)
      if (response.success) {
        alert('School created successfully!')
        navigate('/schools')
      }
    } catch (error) {
      console.error('Error creating school:', error)
      alert(error.response?.data?.message || 'Failed to create school')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <div>
              <h1>Add New School</h1>
              <p className="text-secondary">Register a new school in the system</p>
            </div>
            <button onClick={() => navigate('/schools')} className="btn btn-outline">
              <FaArrowLeft /> Back to Schools
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Card title="Basic Information">
              <div className="form-row">
                <div className="form-group">
                  <label>School Name *</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                    placeholder="Enter school name"
                  />
                </div>
                <div className="form-group">
                  <label>School Code *</label>
                  <input
                    type="text"
                    name="schoolCode"
                    value={formData.schoolCode}
                    onChange={handleChange}
                    required
                    placeholder="Unique school code"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="school@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Contact number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.school.com"
                  />
                </div>
                <div className="form-group">
                  <label>Established Year</label>
                  <input
                    type="number"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="Year"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Board *</label>
                <select name="board" value={formData.board} onChange={handleChange} required>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="STATE_BOARD">State Board</option>
                  <option value="IB">IB</option>
                  <option value="IGCSE">IGCSE</option>
                </select>
              </div>
            </Card>

            <Card title="Address Information">
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                  placeholder="Complete address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </Card>

            <Card title="Branding">
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Color</label>
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Secondary Color</label>
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </Card>

            <Card title="Enabled Modules">
              <div className="modules-grid">
                <label className="module-checkbox">
                  <input
                    type="checkbox"
                    name="attendanceModule"
                    checked={formData.attendanceModule}
                    onChange={handleChange}
                  />
                  <span>Attendance Management</span>
                </label>
                <label className="module-checkbox">
                  <input
                    type="checkbox"
                    name="examModule"
                    checked={formData.examModule}
                    onChange={handleChange}
                  />
                  <span>Exam Management</span>
                </label>
                <label className="module-checkbox">
                  <input
                    type="checkbox"
                    name="timetableModule"
                    checked={formData.timetableModule}
                    onChange={handleChange}
                  />
                  <span>Timetable</span>
                </label>
                <label className="module-checkbox">
                  <input
                    type="checkbox"
                    name="complaintModule"
                    checked={formData.complaintModule}
                    onChange={handleChange}
                  />
                  <span>Complaint Management</span>
                </label>
                <label className="module-checkbox">
                  <input
                    type="checkbox"
                    name="eventModule"
                    checked={formData.eventModule}
                    onChange={handleChange}
                  />
                  <span>Event Management</span>
                </label>
              </div>
            </Card>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/schools')} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <FaSave /> {saving ? 'Saving...' : 'Create School'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default SchoolCreate