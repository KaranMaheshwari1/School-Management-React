import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaCalendar, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './EventManagement.css'

/**
 * Event Management Page - Create and manage school events
 * File: frontend/src/pages/events/EventManagement.jsx
 */
const EventManagement = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'ACADEMIC',
    eventDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    description: '',
    targetAudience: 'ALL',
    organizer: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/events', {
        params: { schoolId: user.schoolId }
      })
      
      if (response.success) {
        setEvents(response.data || getDemoEvents())
      } else {
        setEvents(getDemoEvents())
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents(getDemoEvents())
    } finally {
      setLoading(false)
    }
  }

  const getDemoEvents = () => [
    {
      id: 1,
      eventName: 'Annual Sports Day',
      eventType: 'SPORTS',
      eventDate: '2024-03-15',
      endDate: '2024-03-16',
      startTime: '09:00',
      endTime: '17:00',
      venue: 'School Ground',
      description: 'Annual sports competition for all classes',
      targetAudience: 'ALL',
      organizer: 'Sports Department'
    },
    {
      id: 2,
      eventName: 'Science Fair',
      eventType: 'ACADEMIC',
      eventDate: '2024-03-20',
      startTime: '10:00',
      endTime: '16:00',
      venue: 'Main Hall',
      description: 'Students showcase their science projects',
      targetAudience: 'STUDENTS',
      organizer: 'Science Department'
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
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, {
          ...formData,
          schoolId: user.schoolId
        })
        alert('Event updated successfully')
      } else {
        await api.post('/events', {
          ...formData,
          schoolId: user.schoolId
        })
        alert('Event created successfully')
      }
      
      setShowModal(false)
      setEditingEvent(null)
      resetForm()
      fetchEvents()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event')
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      eventName: event.eventName,
      eventType: event.eventType,
      eventDate: event.eventDate,
      endDate: event.endDate || '',
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue,
      description: event.description || '',
      targetAudience: event.targetAudience,
      organizer: event.organizer || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`)
        alert('Event deleted successfully')
        fetchEvents()
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      eventName: '',
      eventType: 'ACADEMIC',
      eventDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      venue: '',
      description: '',
      targetAudience: 'ALL',
      organizer: ''
    })
  }

  const handleAddNew = () => {
    setEditingEvent(null)
    resetForm()
    setShowModal(true)
  }

  const getEventTypeColor = (type) => {
    const colors = {
      'ACADEMIC': 'primary',
      'SPORTS': 'success',
      'CULTURAL': 'purple',
      'SOCIAL': 'warning',
      'MEETING': 'info',
      'HOLIDAY': 'danger'
    }
    return colors[type] || 'secondary'
  }

  const getEventTypeIcon = (type) => {
    const icons = {
      'ACADEMIC': '📚',
      'SPORTS': '⚽',
      'CULTURAL': '🎭',
      'SOCIAL': '🤝',
      'MEETING': '💼',
      'HOLIDAY': '🏖️'
    }
    return icons[type] || '📅'
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
              <h1><FaCalendar /> Event Management</h1>
              <p className="text-secondary">Create and manage school events</p>
            </div>
            <button onClick={handleAddNew} className="btn btn-primary">
              <FaPlus /> Create Event
            </button>
          </div>

          {events.length > 0 ? (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <div className="event-type-icon">
                      {getEventTypeIcon(event.eventType)}
                    </div>
                    <div>
                      <h3>{event.eventName}</h3>
                      <span className={`event-type-badge badge-${getEventTypeColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                    </div>
                    <div className="event-actions">
                      <button onClick={() => handleEdit(event)} className="btn-icon">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="btn-icon btn-danger">
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="event-details">
                    <div className="detail-item">
                      <FaCalendar className="detail-icon" />
                      <div>
                        <strong>{event.eventDate}</strong>
                        {event.endDate && ` to ${event.endDate}`}
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaClock className="detail-icon" />
                      <div>
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      <div>{event.venue}</div>
                    </div>
                  </div>

                  {event.description && (
                    <div className="event-description">
                      <p>{event.description}</p>
                    </div>
                  )}

                  <div className="event-footer">
                    <span className="audience-badge">{event.targetAudience}</span>
                    {event.organizer && (
                      <span className="organizer">By: {event.organizer}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="empty-state">
                <FaCalendar size={64} />
                <h3>No Events Created</h3>
                <p>Create your first event to get started</p>
                <button onClick={handleAddNew} className="btn btn-primary">
                  <FaPlus /> Create Event
                </button>
              </div>
            </Card>
          )}

          {/* Create/Edit Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                  <button onClick={() => setShowModal(false)} className="btn-close">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Event Name *</label>
                      <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Annual Sports Day"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Event Type *</label>
                        <select
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="ACADEMIC">Academic</option>
                          <option value="SPORTS">Sports</option>
                          <option value="CULTURAL">Cultural</option>
                          <option value="SOCIAL">Social</option>
                          <option value="MEETING">Meeting</option>
                          <option value="HOLIDAY">Holiday</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Target Audience *</label>
                        <select
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="ALL">All</option>
                          <option value="STUDENTS">Students Only</option>
                          <option value="TEACHERS">Teachers Only</option>
                          <option value="PARENTS">Parents Only</option>
                          <option value="STAFF">Staff Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date *</label>
                        <input
                          type="date"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Time *</label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>End Time *</label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Venue *</label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        required
                        placeholder="Location of the event"
                      />
                    </div>

                    <div className="form-group">
                      <label>Organizer</label>
                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        placeholder="Department or person organizing"
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Brief description of the event..."
                      />
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
                      {editingEvent ? 'Update' : 'Create'} Event
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

export default EventManagement