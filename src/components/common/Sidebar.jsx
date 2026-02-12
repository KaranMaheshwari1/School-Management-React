import { Link, useLocation } from 'react-router-dom'
import { 
  FaHome, FaUsers, FaUserTie, FaClipboardCheck, 
  FaBook, FaBullhorn, FaCalendar, FaCog, FaChartLine,
  FaTrophy, FaSchool, FaChalkboard, FaFileAlt
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

/**
 * Sidebar Component - Navigation menu with role-based items
 * File: frontend/src/components/common/Sidebar.jsx
 * UPDATED: Added all missing routes
 */
const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const menuItems = getMenuItemsByRole(user?.role)

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}

const getMenuItemsByRole = (role) => {
  const commonItems = [
    { path: '/profile', label: 'Profile', icon: <FaUserTie /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> }
  ]

  const roleSpecificItems = {
    SUPER_ADMIN: [
      { path: '/dashboard/super-admin', label: 'Dashboard', icon: <FaHome /> },
      { path: '/schools', label: 'Schools', icon: <FaSchool /> },
      { path: '/reports', label: 'Reports', icon: <FaFileAlt /> },
      ...commonItems
    ],
    
    PRINCIPAL: [
      { path: '/dashboard/principal', label: 'Dashboard', icon: <FaHome /> },
      { path: '/students', label: 'Students', icon: <FaUsers /> },
      { path: '/teachers', label: 'Teachers', icon: <FaUserTie /> },
      { path: '/classes', label: 'Classes', icon: <FaChalkboard /> },
      { path: '/attendance', label: 'Attendance', icon: <FaClipboardCheck /> },
      { path: '/exams', label: 'Exams', icon: <FaBook /> },
      { path: '/events', label: 'Events', icon: <FaCalendar /> },
      { path: '/notices', label: 'Notices', icon: <FaBullhorn /> },
      { path: '/reports', label: 'Reports', icon: <FaFileAlt /> },
      ...commonItems
    ],
    
    TEACHER: [
      { path: '/dashboard/teacher', label: 'Dashboard', icon: <FaHome /> },
      { path: '/students', label: 'My Students', icon: <FaUsers /> },
      { path: '/attendance', label: 'Attendance', icon: <FaClipboardCheck /> },
      { path: '/exams', label: 'Exams', icon: <FaBook /> },
      { path: '/schedule', label: 'My Schedule', icon: <FaCalendar /> },
      { path: '/notices', label: 'Notices', icon: <FaBullhorn /> },
      ...commonItems
    ],
    
    STUDENT: [
      { path: '/dashboard/student', label: 'Dashboard', icon: <FaHome /> },
      { path: '/my-performance', label: 'My Performance', icon: <FaTrophy /> },
      { path: '/results', label: 'My Results', icon: <FaBook /> },
      { path: '/timetable', label: 'Timetable', icon: <FaCalendar /> },
      { path: '/attendance', label: 'My Attendance', icon: <FaClipboardCheck /> },
      { path: '/notices', label: 'Notices', icon: <FaBullhorn /> },
      ...commonItems
    ]
  }

  return roleSpecificItems[role] || commonItems
}

export default Sidebar