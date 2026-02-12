import { useState } from 'react'
import { FaUser, FaLock, FaBell, FaPalette, FaSave } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import api from '../../services/api'
import './Settings.css'

/**
 * Settings Page - User preferences and account settings
 * File: frontend/src/pages/settings/Settings.jsx
 */
const Settings = () => {
  const { user } = useAuth()
  const { theme, toggleMode, updateColors } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  // Profile form
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    attendanceAlerts: true,
    examReminders: true,
    resultNotifications: true
  })

  // Theme settings
  const [themeSettings, setThemeSettings] = useState({
    mode: theme.mode,
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor
  })

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await api.put(`/users/${user.id}`, profileData)
      alert('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setSaving(true)
    
    try {
      await api.post('/settings/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      alert('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await api.put('/settings/notifications', notifications)
      alert('Notification settings updated')
    } catch (error) {
      console.error('Error updating notifications:', error)
      alert('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const handleThemeChange = (key, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [key]: value
    }))

    if (key === 'mode') {
      toggleMode()
    } else if (key === 'primaryColor' || key === 'secondaryColor') {
      updateColors(
        key === 'primaryColor' ? value : themeSettings.primaryColor,
        key === 'secondaryColor' ? value : themeSettings.secondaryColor
      )
    }
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <h1>Settings</h1>
            <p className="text-secondary">Manage your account settings and preferences</p>
          </div>

          {/* Settings Navigation */}
          <div className="settings-nav">
            <button
              className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser /> Profile
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <FaLock /> Password
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <FaBell /> Notifications
            </button>
            <button
              className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <FaPalette /> Appearance
            </button>
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card title="Profile Information">
              <form onSubmit={handleProfileSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    rows="3"
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </Card>
          )}

          {/* Password Settings */}
          {activeTab === 'password' && (
            <Card title="Change Password">
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <small>Minimum 6 characters</small>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <FaSave /> {saving ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card title="Notification Preferences">
              <form onSubmit={handleNotificationSubmit}>
                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Email Notifications</strong>
                    <p>Receive notifications via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="emailNotifications"
                      checked={notifications.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Push Notifications</strong>
                    <p>Receive push notifications in browser</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="pushNotifications"
                      checked={notifications.pushNotifications}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Attendance Alerts</strong>
                    <p>Get notified about attendance updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="attendanceAlerts"
                      checked={notifications.attendanceAlerts}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Exam Reminders</strong>
                    <p>Receive reminders for upcoming exams</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="examReminders"
                      checked={notifications.examReminders}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <strong>Result Notifications</strong>
                    <p>Get notified when results are published</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="resultNotifications"
                      checked={notifications.resultNotifications}
                      onChange={handleNotificationChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <FaSave /> {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </form>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card title="Appearance">
              <div className="setting-item">
                <div className="setting-info">
                  <strong>Dark Mode</strong>
                  <p>Toggle between light and dark theme</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={theme.mode === 'dark'}
                    onChange={() => handleThemeChange('mode', theme.mode === 'light' ? 'dark' : 'light')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="form-group">
                <label>Primary Color</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  />
                  <span>{themeSettings.primaryColor}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Secondary Color</label>
                <div className="color-picker">
                  <input
                    type="color"
                    value={themeSettings.secondaryColor}
                    onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  />
                  <span>{themeSettings.secondaryColor}</span>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

export default Settings