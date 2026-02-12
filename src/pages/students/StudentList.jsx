import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaEye, FaFilePdf, FaFileExcel, FaSearch, FaFilter } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { studentService } from '../../services/studentService'
import { reportService } from '../../services/reportService'
import { useAuth } from '../../context/AuthContext'
import './StudentList.css'

/**
 * UPDATED: Added search, filters, and export functionality
 * File: frontend/src/pages/students/StudentList.jsx
 */
const StudentList = () => {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  
  // NEW: Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [classSectionFilter, setClassSectionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState('asc')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [page, sortBy, sortDir])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const params = {
        schoolId: user.schoolId,
        page,
        size: 10,
        sortBy,
        sortDir
      }

      // Add filters if set
      if (searchTerm) params.searchTerm = searchTerm
      if (classSectionFilter) params.classSectionId = classSectionFilter
      if (statusFilter) params.isActive = statusFilter === 'active'

      const response = await studentService.searchStudents(params)
      
      if (response.success) {
        setStudents(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      alert('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0) // Reset to first page
    fetchStudents()
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setClassSectionFilter('')
    setStatusFilter('')
    setSortBy('id')
    setSortDir('asc')
    setPage(0)
    fetchStudents()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id)
        fetchStudents()
        alert('Student deleted successfully')
      } catch (error) {
        console.error('Error deleting student:', error)
        alert('Failed to delete student')
      }
    }
  }

  // NEW: Export handlers
  const handleExportPDF = async () => {
    try {
      setExporting(true)
      await reportService.downloadStudentsPDF(
        user.schoolId,
        classSectionFilter || null,
        searchTerm || null
      )
      alert('PDF downloaded successfully')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  const handleExportExcel = async () => {
    try {
      setExporting(true)
      await reportService.downloadStudentsExcel(
        user.schoolId,
        classSectionFilter || null,
        searchTerm || null
      )
      alert('Excel downloaded successfully')
    } catch (error) {
      console.error('Error exporting Excel:', error)
      alert('Failed to export Excel')
    } finally {
      setExporting(false)
    }
  }

  if (loading && students.length === 0) {
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
              <h1>Students</h1>
              <p className="text-secondary">Total: {totalElements} students</p>
            </div>
            <div className="page-actions">
              <button 
                onClick={handleExportPDF} 
                className="btn btn-outline"
                disabled={exporting || students.length === 0}
              >
                <FaFilePdf /> Export PDF
              </button>
              <button 
                onClick={handleExportExcel} 
                className="btn btn-outline"
                disabled={exporting || students.length === 0}
              >
                <FaFileExcel /> Export Excel
              </button>
              <Link to="/students/create" className="btn btn-primary">
                <FaPlus /> Add Student
              </Link>
            </div>
          </div>

          <Card>
            {/* Search and Filter Section */}
            <div className="search-filter-section">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by name or admission number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                </div>
              </form>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline"
              >
                <FaFilter /> {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="filters-panel">
                <div className="filter-group">
                  <label>Class/Section</label>
                  <select
                    value={classSectionFilter}
                    onChange={(e) => setClassSectionFilter(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    <option value="1">1A</option>
                    <option value="2">1B</option>
                    {/* Add more options from your class sections */}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="id">ID</option>
                    <option value="admissionNumber">Admission No</option>
                    <option value="user.firstName">Name</option>
                    <option value="rollNumber">Roll Number</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Order</label>
                  <select
                    value={sortDir}
                    onChange={(e) => setSortDir(e.target.value)}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                <div className="filter-actions">
                  <button onClick={fetchStudents} className="btn btn-primary btn-sm">
                    Apply Filters
                  </button>
                  <button onClick={handleClearFilters} className="btn btn-outline btn-sm">
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="table-container">
              {loading ? (
                <div className="text-center p-3">Loading...</div>
              ) : students.length === 0 ? (
                <div className="text-center p-3">
                  <p>No students found</p>
                  {searchTerm && (
                    <button onClick={handleClearFilters} className="btn btn-outline btn-sm mt-2">
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Admission No.</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Roll No.</th>
                      <th>Father Name</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.admissionNumber}</td>
                        <td>{student.user.firstName} {student.user.lastName}</td>
                        <td>{student.classSection.className} {student.classSection.sectionName}</td>
                        <td>{student.rollNumber || '-'}</td>
                        <td>{student.fatherName || '-'}</td>
                        <td>{student.fatherPhone || '-'}</td>
                        <td>
                          <span className={`badge ${student.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="actions">
                          <Link to={`/students/${student.id}`} className="btn-icon" title="View">
                            <FaEye />
                          </Link>
                          <Link to={`/students/${student.id}/edit`} className="btn-icon" title="Edit">
                            <FaEdit />
                          </Link>
                          <button 
                            onClick={() => handleDelete(student.id)} 
                            className="btn-icon btn-danger"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setPage(0)} 
                  disabled={page === 0}
                  className="btn btn-sm"
                >
                  First
                </button>
                <button 
                  onClick={() => setPage(page - 1)} 
                  disabled={page === 0}
                  className="btn btn-sm"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(page + 1)} 
                  disabled={page >= totalPages - 1}
                  className="btn btn-sm"
                >
                  Next
                </button>
                <button 
                  onClick={() => setPage(totalPages - 1)} 
                  disabled={page >= totalPages - 1}
                  className="btn btn-sm"
                >
                  Last
                </button>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

export default StudentList
