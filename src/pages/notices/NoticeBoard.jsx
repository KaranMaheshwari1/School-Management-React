import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaBullhorn, FaCalendar, FaUser, FaFilter } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './NoticeBoard.css'

/**
 * Notice Board Page - View and manage notices
 * File: frontend/src/pages/notices/NoticeBoard.jsx
 */
const NoticeBoard = () => {
  const { user } = useAuth()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [filterType, setFilterType] = useState('ALL')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    noticeType: 'GENERAL',
    priority: 'MEDIUM',
    targetAudience: 'ALL',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: ''
  })

  useEffect(() => {
    fetchNotices()
  }, [filterType])

  const fetchNotices = async () => {
    try {
      setLoading(true)
      const response = await api.get('/notices', {
        params: { 
          schoolId: user.schoolId,
          noticeType: filterType !== 'ALL' ? filterType : undefined
        }
      })
      
      if (response.success) {
        setNotices(response.data || getDemoNotices())
      } else {
        setNotices(getDemoNotices())
      }
    } catch (error) {
      console.error('Error fetching notices:', error)
      setNotices(getDemoNotices())
    } finally {
      setLoading(false)
    }
  }

  const getDemoNotices = () => [
    {
      id: 1,
      title: 'School Reopening Notice',
      content: 'Dear Parents and Students, School will reopen on 15th January 2024 after winter break. All students are required to attend.',
      noticeType: 'ACADEMIC',
      priority: 'HIGH',
      targetAudience: 'ALL',
      validFrom: '2024-01-10',
      validUntil: '2024-01-15',
      createdBy: { firstName: 'Admin', lastName: 'User' },
      createdAt: '2024-01-09'
    },
    {
      id: 2,
      title: 'Parent-Teacher Meeting',
      content: 'PTM scheduled for 20th January 2024 from 10 AM to 2 PM. Parents are requested to attend and discuss their child\'s progress.',
      noticeType: 'EVENT',
      priority: 'MEDIUM',
      targetAudience: 'PARENTS',
      validFrom: '2024-01-12',
      validUntil: '2024-01-20',
      createdBy: { firstName: 'Principal', lastName: 'Smith' },
      createdAt: '2024-01-11'
    }
  ]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingNotice) {
        await api.put(`/notices/${editingNotice.id}`, {
          ...formData,
          schoolId: user.schoolId
        })
        alert('Notice updated successfully')
      } else {
        await api.post('/notices', {
          ...formData,
          schoolId: user.schoolId
        })
        alert('Notice created successfully')
      }
      
      setShowModal(false)
      setEditingNotice(null)
      resetForm()
      fetchNotices()
    } catch (error) {
      console.error('Error saving notice:', error)
      alert('Failed to save notice')
    }
  }

  const handleEdit = (notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      noticeType: notice.noticeType,
      priority: notice.priority,
      targetAudience: notice.targetAudience,
      validFrom: notice.validFrom,
      validUntil: notice.validUntil || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/notices/${id}`)
        alert('Notice deleted successfully')
        fetchNotices()
      } catch (error) {
        console.error('Error deleting notice:', error)
        alert('Failed to delete notice')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      noticeType: 'GENERAL',
      priority: 'MEDIUM',
      targetAudience: 'ALL',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: ''
    })
  }

  const handleAddNew = () => {
    setEditingNotice(null)
    resetForm()
    setShowModal(true)
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'HIGH': 'danger',
      'MEDIUM': 'warning',
      'LOW': 'info'
    }
    return colors[priority] || 'secondary'
  }

  const getTypeIcon = (type) => {
    const icons = {
      'ACADEMIC': '📚',
      'EVENT': '📅',
      'EXAM': '📝',
      'HOLIDAY': '🏖️',
      'GENERAL': '📢',
      'URGENT': '⚠️'
    }
    return icons[type] || '📋'
  }

  const canManageNotices = ['SUPER_ADMIN', 'PRINCIPAL', 'TEACHER'].includes(user?.role)

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
              <h1>
                <FaBullhorn /> Notice Board
              </h1>
              <p className="text-secondary">School announcements and important notices</p>
            </div>
            {canManageNotices && (
              <button onClick={handleAddNew} className="btn btn-primary">
                <FaPlus /> Post Notice
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="notice-filters">
            <button 
              className={`filter-btn ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              All Notices
            </button>
            <button 
              className={`filter-btn ${filterType === 'ACADEMIC' ? 'active' : ''}`}
              onClick={() => setFilterType('ACADEMIC')}
            >
              Academic
            </button>
            <button 
              className={`filter-btn ${filterType === 'EVENT' ? 'active' : ''}`}
              onClick={() => setFilterType('EVENT')}
            >
              Events
            </button>
            <button 
              className={`filter-btn ${filterType === 'EXAM' ? 'active' : ''}`}
              onClick={() => setFilterType('EXAM')}
            >
              Exams
            </button>
            <button 
              className={`filter-btn ${filterType === 'URGENT' ? 'active' : ''}`}
              onClick={() => setFilterType('URGENT')}
            >
              Urgent
            </button>
          </div>

          {/* Notices List */}
          <div className="notices-container">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice.id} className={`notice-card priority-${getPriorityColor(notice.priority)}`}>
                  <div className="notice-header">
                    <div className="notice-title-section">
                      <span className="notice-icon">{getTypeIcon(notice.noticeType)}</span>
                      <h3>{notice.title}</h3>
                    </div>
                    {canManageNotices && (
                      <div className="notice-actions">
                        <button onClick={() => handleEdit(notice)} className="btn-icon">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(notice.id)} className="btn-icon btn-danger">
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="notice-meta">
                    <span className={`priority-badge ${getPriorityColor(notice.priority)}`}>
                      {notice.priority} Priority
                    </span>
                    <span className="type-badge">{notice.noticeType}</span>
                    <span className="audience-badge">{notice.targetAudience}</span>
                  </div>

                  <div className="notice-content">
                    <p>{notice.content}</p>
                  </div>

                  <div className="notice-footer">
                    <div className="notice-info">
                      <span>
                        <FaUser /> {notice.createdBy?.firstName} {notice.createdBy?.lastName}
                      </span>
                      <span>
                        <FaCalendar /> Valid: {notice.validFrom} 
                        {notice.validUntil && ` to ${notice.validUntil}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FaBullhorn size={64} />
                <h3>No Notices Found</h3>
                <p>There are no notices to display at the moment.</p>
                {canManageNotices && (
                  <button onClick={handleAddNew} className="btn btn-primary">
                    <FaPlus /> Post First Notice
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Create/Edit Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content notice-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingNotice ? 'Edit Notice' : 'Post New Notice'}</h2>
                  <button onClick={() => setShowModal(false)} className="btn-close">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Notice Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter notice title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Content *</label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder="Enter notice content..."
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Notice Type *</label>
                        <select name="noticeType" value={formData.noticeType} onChange={handleInputChange} required>
                          <option value="GENERAL">General</option>
                          <option value="ACADEMIC">Academic</option>
                          <option value="EVENT">Event</option>
                          <option value="EXAM">Exam</option>
                          <option value="HOLIDAY">Holiday</option>
                          <option value="URGENT">Urgent</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Priority *</label>
                        <select name="priority" value={formData.priority} onChange={handleInputChange} required>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Target Audience *</label>
                      <select name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} required>
                        <option value="ALL">All</option>
                        <option value="STUDENTS">Students Only</option>
                        <option value="TEACHERS">Teachers Only</option>
                        <option value="PARENTS">Parents Only</option>
                        <option value="STAFF">Staff Only</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Valid From *</label>
                        <input
                          type="date"
                          name="validFrom"
                          value={formData.validFrom}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Valid Until</label>
                        <input
                          type="date"
                          name="validUntil"
                          value={formData.validUntil}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)} 
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <FaBullhorn /> {editingNotice ? 'Update' : 'Post'} Notice
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default NoticeBoard