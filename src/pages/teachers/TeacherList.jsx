import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './TeacherList.css'

/**
 * Teacher List Page
 * File: frontend/src/pages/teachers/TeacherList.jsx
 */
const TeacherList = () => {
  const { user } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTeachers()
  }, [page])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const params = {
        schoolId: user.schoolId,
        page,
        size: 10
      }

      if (searchTerm) params.searchTerm = searchTerm

      const response = await api.get('/teachers', { params })
      
      if (response.success) {
        setTeachers(response.data.content || [])
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
      // Set dummy data for demo
      setTeachers([
        {
          id: 1,
          employeeCode: 'T001',
          user: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@school.com',
            phone: '123-456-7890'
          },
          qualification: 'M.Sc Mathematics',
          experience: 10,
          joiningDate: '2015-06-01',
          isActive: true
        },
        {
          id: 2,
          employeeCode: 'T002',
          user: {
            firstName: 'Emily',
            lastName: 'Johnson',
            email: 'emily.j@school.com',
            phone: '123-456-7891'
          },
          qualification: 'M.A English',
          experience: 8,
          joiningDate: '2016-08-15',
          isActive: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    fetchTeachers()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/teachers/${id}`)
        fetchTeachers()
        alert('Teacher deleted successfully')
      } catch (error) {
        console.error('Error deleting teacher:', error)
        alert('Failed to delete teacher')
      }
    }
  }

  if (loading && teachers.length === 0) {
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
              <h1>Teachers</h1>
              <p className="text-secondary">Manage teaching staff</p>
            </div>
            <Link to="/teachers/create" className="btn btn-primary">
              <FaPlus /> Add Teacher
            </Link>
          </div>

          <Card>
            {/* Search */}
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search by name or employee code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            {/* Table */}
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee Code</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.employeeCode}</td>
                      <td>{teacher.user.firstName} {teacher.user.lastName}</td>
                      <td>{teacher.user.email}</td>
                      <td>{teacher.user.phone || '-'}</td>
                      <td>{teacher.qualification || '-'}</td>
                      <td>{teacher.experience || 0} years</td>
                      <td>
                        <span className={`badge ${teacher.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {teacher.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions">
                        <Link to={`/teachers/${teacher.id}`} className="btn-icon">
                          <FaEye />
                        </Link>
                        <Link to={`/teachers/${teacher.id}/edit`} className="btn-icon">
                          <FaEdit />
                        </Link>
                        <button onClick={() => handleDelete(teacher.id)} className="btn-icon btn-danger">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setPage(page - 1)} 
                  disabled={page === 0}
                  className="btn btn-sm"
                >
                  Previous
                </button>
                <span>Page {page + 1} of {totalPages}</span>
                <button 
                  onClick={() => setPage(page + 1)} 
                  disabled={page >= totalPages - 1}
                  className="btn btn-sm"
                >
                  Next
                </button>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

export default TeacherList