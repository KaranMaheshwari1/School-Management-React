import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './ClassManagement.css'

/**
 * Class Management Page - Add and manage classes
 * File: frontend/src/pages/classes/ClassManagement.jsx
 */
const ClassManagement = () => {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({
    className: '',
    sectionName: '',
    capacity: '',
    classTeacherId: '',
    room: ''
  })

  useEffect(() => {
    fetchClasses()
    fetchSections()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/class-sections', {
        params: { schoolId: user.schoolId }
      })
      
      if (response.success) {
        setClasses(response.data || getDemoClasses())
      } else {
        setClasses(getDemoClasses())
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setClasses(getDemoClasses())
    } finally {
      setLoading(false)
    }
  }

  const fetchSections = async () => {
    try {
      const response = await api.get('/sections')
      if (response.success) {
        setSections(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const getDemoClasses = () => [
    {
      id: 1,
      classEntity: { className: '10' },
      section: { sectionName: 'A' },
      capacity: 40,
      currentStrength: 38,
      room: '101',
      classTeacher: { user: { firstName: 'John', lastName: 'Doe' } }
    },
    {
      id: 2,
      classEntity: { className: '10' },
      section: { sectionName: 'B' },
      capacity: 40,
      currentStrength: 35,
      room: '102',
      classTeacher: { user: { firstName: 'Jane', lastName: 'Smith' } }
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
      if (editingClass) {
        await api.put(`/class-sections/${editingClass.id}`, {
          ...formData,
          schoolId: user.schoolId
        })
        alert('Class updated successfully')
      } else {
        await api.post('/class-sections', {
          ...formData,
          schoolId: user.schoolId
        })
        alert('Class created successfully')
      }
      
      setShowModal(false)
      setEditingClass(null)
      resetForm()
      fetchClasses()
    } catch (error) {
      console.error('Error saving class:', error)
      alert('Failed to save class')
    }
  }

  const handleEdit = (classItem) => {
    setEditingClass(classItem)
    setFormData({
      className: classItem.classEntity?.className || '',
      sectionName: classItem.section?.sectionName || '',
      capacity: classItem.capacity || '',
      classTeacherId: classItem.classTeacher?.id || '',
      room: classItem.room || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/class-sections/${id}`)
        alert('Class deleted successfully')
        fetchClasses()
      } catch (error) {
        console.error('Error deleting class:', error)
        alert('Failed to delete class')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      className: '',
      sectionName: '',
      capacity: '',
      classTeacherId: '',
      room: ''
    })
  }

  const handleAddNew = () => {
    setEditingClass(null)
    resetForm()
    setShowModal(true)
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
              <h1><FaUsers /> Class Management</h1>
              <p className="text-secondary">Add and manage school classes</p>
            </div>
            <button onClick={handleAddNew} className="btn btn-primary">
              <FaPlus /> Add Class
            </button>
          </div>

          {classes.length > 0 ? (
            <div className="classes-grid">
              {classes.map((classItem) => (
                <div key={classItem.id} className="class-card">
                  <div className="class-header">
                    <h3>Class {classItem.classEntity?.className} - {classItem.section?.sectionName}</h3>
                    <div className="class-actions">
                      <button onClick={() => handleEdit(classItem)} className="btn-icon">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(classItem.id)} className="btn-icon btn-danger">
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="class-details">
                    <div className="detail-row">
                      <span className="label">Room:</span>
                      <span>{classItem.room || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Capacity:</span>
                      <span>{classItem.capacity}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Current Strength:</span>
                      <span className="strength-badge">
                        {classItem.currentStrength || 0} / {classItem.capacity}
                      </span>
                    </div>
                    {classItem.classTeacher && (
                      <div className="detail-row">
                        <span className="label">Class Teacher:</span>
                        <span>{classItem.classTeacher.user?.firstName} {classItem.classTeacher.user?.lastName}</span>
                      </div>
                    )}
                  </div>

                  <div className="capacity-bar">
                    <div 
                      className="capacity-fill"
                      style={{ width: `${((classItem.currentStrength || 0) / classItem.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="empty-state">
                <FaUsers size={64} />
                <h3>No Classes Created</h3>
                <p>Add your first class to get started</p>
                <button onClick={handleAddNew} className="btn btn-primary">
                  <FaPlus /> Add Class
                </button>
              </div>
            </Card>
          )}

          {/* Create/Edit Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
                  <button onClick={() => setShowModal(false)} className="btn-close">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Class Name *</label>
                        <select
                          name="className"
                          value={formData.className}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Class</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Section *</label>
                        <select
                          name="sectionName"
                          value={formData.sectionName}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Section</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Room Number *</label>
                        <input
                          type="text"
                          name="room"
                          value={formData.room}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., 101, Lab-1"
                        />
                      </div>

                      <div className="form-group">
                        <label>Capacity *</label>
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          required
                          min="1"
                          max="100"
                          placeholder="Maximum students"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Class Teacher ID</label>
                      <input
                        type="number"
                        name="classTeacherId"
                        value={formData.classTeacherId}
                        onChange={handleInputChange}
                        placeholder="Teacher ID (optional)"
                      />
                      <small>Enter the ID of the class teacher</small>
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
                      {editingClass ? 'Update' : 'Add'} Class
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

export default ClassManagement