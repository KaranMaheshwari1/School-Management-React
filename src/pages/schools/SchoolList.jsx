import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaEdit, FaEye, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'
import './SchoolList.css'

/**
 * School List Page - Manage all schools
 * File: frontend/src/pages/schools/SchoolList.jsx
 */
const SchoolList = () => {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchSchools()
  }, [page])

  const fetchSchools = async () => {
    try {
      setLoading(true)
      const response = await api.get('/schools', {
        params: { page, size: 10 }
      })
      
      if (response.success) {
        setSchools(response.data.content || [])
        setTotalPages(response.data.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    // Implement search functionality
    fetchSchools()
  }

  const toggleStatus = async (id, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this school?`)) {
      try {
        await api.patch(`/schools/${id}/toggle-status`)
        fetchSchools()
        alert('School status updated successfully')
      } catch (error) {
        console.error('Error toggling status:', error)
        alert('Failed to update school status')
      }
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
              <h1>Manage Schools</h1>
              <p className="text-secondary">View and manage all registered schools</p>
            </div>
            <Link to="/schools/create" className="btn btn-primary">
              <FaPlus /> Add New School
            </Link>
          </div>

          <Card>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search schools by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </form>

            {/* Schools Grid */}
            {schools.length > 0 ? (
              <div className="schools-grid">
                {schools.map((school) => (
                  <div key={school.id} className="school-card">
                    <div className="school-header">
                      {school.logoUrl ? (
                        <img src={school.logoUrl} alt={school.schoolName} className="school-logo" />
                      ) : (
                        <div className="school-logo-placeholder">
                          {school.schoolName.charAt(0)}
                        </div>
                      )}
                      <div className="school-info">
                        <h3>{school.schoolName}</h3>
                        <p className="school-code">{school.schoolCode}</p>
                      </div>
                    </div>

                    <div className="school-details">
                      <div className="detail-row">
                        <span className="label">City:</span>
                        <span>{school.city || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">State:</span>
                        <span>{school.state || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Board:</span>
                        <span>{school.board || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Phone:</span>
                        <span>{school.phone || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Status:</span>
                        <span className={`badge ${school.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {school.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="school-actions">
                      <Link to={`/schools/${school.id}`} className="btn btn-sm btn-outline">
                        <FaEye /> View
                      </Link>
                      <Link to={`/schools/${school.id}/edit`} className="btn btn-sm btn-primary">
                        <FaEdit /> Edit
                      </Link>
                      <button 
                        onClick={() => toggleStatus(school.id, school.isActive)}
                        className={`btn btn-sm ${school.isActive ? 'btn-warning' : 'btn-success'}`}
                      >
                        {school.isActive ? <FaToggleOff /> : <FaToggleOn />}
                        {school.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No schools found</p>
                <Link to="/schools/create" className="btn btn-primary">
                  <FaPlus /> Add First School
                </Link>
              </div>
            )}

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

export default SchoolList