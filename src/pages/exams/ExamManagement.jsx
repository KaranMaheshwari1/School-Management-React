import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendar, FaBook } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './ExamManagement.css'

/**
 * Exam Management Page - Create and manage exams
 * File: frontend/src/pages/exams/ExamManagement.jsx
 */
const ExamManagement = () => {
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [formData, setFormData] = useState({
    examName: '',
    examType: 'MIDTERM',
    academicYear: '2024-2025',
    startDate: '',
    endDate: '',
    classSectionId: '',
    description: ''
  })

  useEffect(() => {
    fetchExams()
  }, [])

  const fetchExams = async () => {
    try {
      setLoading(true)
      const response = await api.get('/exams', {
        params: { schoolId: user.schoolId }
      })
      
      if (response.success) {
        setExams(response.data || [])
      } else {
        // Demo data
        setExams([
          {
            id: 1,
            examName: 'First Semester Exam',
            examType: 'MIDTERM',
            academicYear: '2024-2025',
            startDate: '2024-03-01',
            endDate: '2024-03-15',
            classSection: { className: '5', sectionName: 'A' }
          },
          {
            id: 2,
            examName: 'Final Exam',
            examType: 'FINAL',
            academicYear: '2024-2025',
            startDate: '2024-06-01',
            endDate: '2024-06-15',
            classSection: { className: '6', sectionName: 'B' }
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingExam) {
        await api.put(`/exams/${editingExam.id}`, {
          ...formData,
          schoolId: user.schoolId
        })
        alert('Exam updated successfully')
      } else {
        await api.post('/exams', {
          ...formData,
          schoolId: user.schoolId
        })
        alert('Exam created successfully')
      }
      
      setShowModal(false)
      setEditingExam(null)
      resetForm()
      fetchExams()
    } catch (error) {
      console.error('Error saving exam:', error)
      alert('Failed to save exam')
    }
  }

  const handleEdit = (exam) => {
    setEditingExam(exam)
    setFormData({
      examName: exam.examName,
      examType: exam.examType,
      academicYear: exam.academicYear,
      startDate: exam.startDate,
      endDate: exam.endDate,
      classSectionId: exam.classSectionId || '',
      description: exam.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await api.delete(`/exams/${id}`)
        alert('Exam deleted successfully')
        fetchExams()
      } catch (error) {
        console.error('Error deleting exam:', error)
        alert('Failed to delete exam')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      examName: '',
      examType: 'MIDTERM',
      academicYear: '2024-2025',
      startDate: '',
      endDate: '',
      classSectionId: '',
      description: ''
    })
  }

  const handleAddNew = () => {
    setEditingExam(null)
    resetForm()
    setShowModal(true)
  }

  const getExamTypeColor = (type) => {
    const colors = {
      'UNIT_TEST': 'info',
      'MIDTERM': 'primary',
      'FINAL': 'danger',
      'ANNUAL': 'success',
      'PRACTICAL': 'warning'
    }
    return colors[type] || 'secondary'
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
              <h1>Exam Management</h1>
              <p className="text-secondary">Create and manage examinations</p>
            </div>
            <button onClick={handleAddNew} className="btn btn-primary">
              <FaPlus /> Create Exam
            </button>
          </div>

          <Card>
            {exams.length > 0 ? (
              <div className="exams-grid">
                {exams.map((exam) => (
                  <div key={exam.id} className="exam-card">
                    <div className="exam-header">
                      <div>
                        <h3>{exam.examName}</h3>
                        <span className={`exam-type-badge badge-${getExamTypeColor(exam.examType)}`}>
                          {exam.examType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="exam-actions">
                        <button onClick={() => handleEdit(exam)} className="btn-icon">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(exam.id)} className="btn-icon btn-danger">
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <div className="exam-details">
                      <div className="detail-item">
                        <FaCalendar className="detail-icon" />
                        <div>
                          <label>Start Date</label>
                          <p>{exam.startDate}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <FaCalendar className="detail-icon" />
                        <div>
                          <label>End Date</label>
                          <p>{exam.endDate}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <FaBook className="detail-icon" />
                        <div>
                          <label>Academic Year</label>
                          <p>{exam.academicYear}</p>
                        </div>
                      </div>
                      {exam.classSection && (
                        <div className="detail-item">
                          <div>
                            <label>Class</label>
                            <p>{exam.classSection.className} {exam.classSection.sectionName}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="exam-footer">
                      <button className="btn btn-outline btn-sm">
                        <FaEye /> View Details
                      </button>
                      <button className="btn btn-primary btn-sm">
                        Add Subjects
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FaBook size={64} />
                <h3>No Exams Created</h3>
                <p>Create your first exam to get started</p>
                <button onClick={handleAddNew} className="btn btn-primary">
                  <FaPlus /> Create Exam
                </button>
              </div>
            )}
          </Card>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingExam ? 'Edit Exam' : 'Create New Exam'}</h2>
                  <button onClick={() => setShowModal(false)} className="btn-close">
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>Exam Name *</label>
                      <input
                        type="text"
                        name="examName"
                        value={formData.examName}
                        onChange={handleInputChange}
                        placeholder="e.g., First Semester Exam"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Exam Type *</label>
                        <select
                          name="examType"
                          value={formData.examType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="UNIT_TEST">Unit Test</option>
                          <option value="MIDTERM">Midterm</option>
                          <option value="FINAL">Final</option>
                          <option value="ANNUAL">Annual</option>
                          <option value="PRACTICAL">Practical</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Academic Year *</label>
                        <input
                          type="text"
                          name="academicYear"
                          value={formData.academicYear}
                          onChange={handleInputChange}
                          placeholder="2024-2025"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Date *</label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>End Date *</label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter exam description..."
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
                      {editingExam ? 'Update' : 'Create'} Exam
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

export default ExamManagement