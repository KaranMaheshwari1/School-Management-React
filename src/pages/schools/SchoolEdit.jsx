import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaSave, FaArrowLeft } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'
import './SchoolEdit.css'

/**
 * Edit School Page - Update school information
 * File: frontend/src/pages/schools/SchoolEdit.jsx
 */
const SchoolEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchSchoolData()
  }, [id])

  const fetchSchoolData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/schools/${id}`)
      
      if (response.success) {
        const school = response.data
        setFormData({
          schoolName: school.schoolName || '',
          schoolCode: school.schoolCode || '',
          email: school.email || '',
          phone: school.phone || '',
          website: school.website || '',
          address: school.address || '',
          city: school.city || '',
          state: school.state || '',
          country: school.country || 'India',
          pincode: school.pincode || '',
          establishedYear: school.establishedYear || '',
          board: school.board || 'CBSE',
          primaryColor: school.primaryColor || '#1976d2',
          secondaryColor: school.secondaryColor || '#424242',
          attendanceModule: school.attendanceModule !== undefined ? school.attendanceModule : true,
          examModule: school.examModule !== undefined ? school.examModule : true,
          timetableModule: school.timetableModule !== undefined ? school.timetableModule : true,
          complaintModule: school.complaintModule !== undefined ? school.complaintModule : true,
          eventModule: school.eventModule !== undefined ? school.eventModule : true
        })
      }
    } catch (error) {
      console.error('Error fetching school:', error)
      alert('Failed to load school data')
    } finally {
      setLoading(false)
    }
  }

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
      const response = await api.put(`/schools/${id}`, formData)
      if (response.success) {
        alert('School updated successfully!')
        navigate(`/schools/${id}`)
      }
    } catch (error) {
      console.error('Error updating school:', error)
      alert(error.response?.data?.message || 'Failed to update school')
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
              <h1>Edit School</h1>
              <p className="text-secondary">Update school information</p>
            </div>
            <button onClick={() => navigate(`/schools/${id}`)} className="btn btn-outline">
              <FaArrowLeft /> Back to Details
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
                    disabled
                    title="School code cannot be changed"
                  />
                  <small>School code cannot be changed</small>
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
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  required
                >
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
                  <div className="color-input-group">
                    <input
                      type="color"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleChange}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                      placeholder="#1976d2"
                      className="color-text"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Secondary Color</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleChange}
                      className="color-picker"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                      placeholder="#424242"
                      className="color-text"
                    />
                  </div>
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
                onClick={() => navigate(`/schools/${id}`)} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <FaSave /> {saving ? 'Updating...' : 'Update School'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default SchoolEdit