import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBell, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleMode } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>School Management</h2>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" onClick={toggleMode}>
          {theme.mode === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        <button className="icon-btn">
          <FaBell />
          <span className="badge">3</span>
        </button>

        <div className="profile-dropdown">
          <button 
            className="profile-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserCircle size={32} />
            <div className="profile-info">
              <span className="profile-name">{user?.firstName} {user?.lastName}</span>
              <span className="profile-role">{user?.role}</span>
            </div>
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/settings" className="dropdown-item">
                Settings
              </Link>
              <Link to="/profile" className="dropdown-item">
                My Profile
              </Link>
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar