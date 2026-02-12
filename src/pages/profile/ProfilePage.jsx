import { useState, useEffect } from 'react'
import { FaUser, FaEdit, FaSave, FaCamera } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './ProfilePage.css'

/**
 * Profile Page - View and edit user profile
 * File: frontend/src/pages/profile/ProfilePage.jsx
 */
const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || ''
      })
    }
  }, [user])

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
      const response = await api.put(`/users/${user.id}`, formData)
      if (response.success) {
        updateUser(response.data)
        alert('Profile updated successfully!')
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      pincode: user.pincode || ''
    })
    setEditing(false)
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <div>
              <h1><FaUser /> My Profile</h1>
              <p className="text-secondary">View and manage your personal information</p>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                <FaEdit /> Edit Profile
              </button>
            ) : null}
          </div>

          <div className="profile-container">
            {/* Profile Header */}
            <Card>
              <div className="profile-header-section">
                <div className="profile-avatar-container">
                  {user?.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.firstName} 
                      className="profile-avatar-large"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder-large">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                  )}
                  {editing && (
                    <button className="avatar-upload-btn">
                      <FaCamera /> Change Photo
                    </button>
                  )}
                </div>
                <div className="profile-info-section">
                  <h2>{user?.firstName} {user?.lastName}</h2>
                  <p className="profile-role">{user?.role}</p>
                  <p className="text-secondary">{user?.email}</p>
                </div>
              </div>
            </Card>

            {/* Profile Form */}
            <form onSubmit={handleSubmit}>
              <Card title="Personal Information">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!editing}
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
                      disabled={!editing}
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
                      disabled={!editing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!editing}
                    >
                      <option value="">Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card title="Address">
                <div className="form-group">
                  <label>Street Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editing}
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
                      disabled={!editing}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!editing}
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
                    disabled={!editing}
                  />
                </div>
              </Card>

              {/* Account Information */}
              <Card title="Account Information">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Username</label>
                    <p>{user?.username}</p>
                  </div>
                  <div className="info-item">
                    <label>Role</label>
                    <p className="role-badge">{user?.role}</p>
                  </div>
                  <div className="info-item">
                    <label>Account Status</label>
                    <span className={`badge ${user?.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Member Since</label>
                    <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </Card>

              {editing && (
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfilePage