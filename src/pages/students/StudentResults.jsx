import { useState, useEffect } from 'react'
import { FaTrophy, FaChartLine, FaFilePdf, FaFileExcel } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { reportService } from '../../services/reportService'
import api from '../../services/api'
import './StudentResults.css'

/**
 * Student Results Page - View exam results
 * File: frontend/src/pages/students/StudentResults.jsx
 */
const StudentResults = () => {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [exams, setExams] = useState([])
  const [selectedExam, setSelectedExam] = useState('')
  const [loading, setLoading] = useState(true)
  const [overallStats, setOverallStats] = useState(null)

  useEffect(() => {
    fetchExams()
  }, [])

  useEffect(() => {
    if (selectedExam) {
      fetchResults()
    }
  }, [selectedExam])

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams', {
        params: { schoolId: user.schoolId }
      })
      if (response.success && response.data.length > 0) {
        setExams(response.data)
        setSelectedExam(response.data[0].id)
      } else {
        // Demo data
        const demoExams = [
          { id: 1, examName: 'First Semester', examType: 'MIDTERM' },
          { id: 2, examName: 'Final Exam', examType: 'FINAL' }
        ]
        setExams(demoExams)
        setSelectedExam(demoExams[0].id)
      }
    } catch (error) {
      console.error('Error fetching exams:', error)
    }
  }

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/results/student/${user.id}/exam/${selectedExam}`)
      
      if (response.success) {
        setResults(response.data || [])
        calculateStats(response.data || [])
      } else {
        // Demo data
        const demoResults = [
          {
            id: 1,
            subject: { subjectName: 'Mathematics' },
            maxMarks: 100,
            marksObtained: 85,
            grade: 'A',
            percentage: 85
          },
          {
            id: 2,
            subject: { subjectName: 'English' },
            maxMarks: 100,
            marksObtained: 78,
            grade: 'B+',
            percentage: 78
          },
          {
            id: 3,
            subject: { subjectName: 'Science' },
            maxMarks: 100,
            marksObtained: 92,
            grade: 'A+',
            percentage: 92
          },
          {
            id: 4,
            subject: { subjectName: 'Social Studies' },
            maxMarks: 100,
            marksObtained: 75,
            grade: 'B',
            percentage: 75
          }
        ]
        setResults(demoResults)
        calculateStats(demoResults)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (resultsData) => {
    if (resultsData.length === 0) return

    const totalMax = resultsData.reduce((sum, r) => sum + r.maxMarks, 0)
    const totalObtained = resultsData.reduce((sum, r) => sum + r.marksObtained, 0)
    const percentage = (totalObtained / totalMax) * 100
    const highest = Math.max(...resultsData.map(r => r.marksObtained))
    const lowest = Math.min(...resultsData.map(r => r.marksObtained))

    setOverallStats({
      totalMax,
      totalObtained,
      percentage: percentage.toFixed(2),
      grade: calculateGrade(percentage),
      highest,
      lowest,
      subjectCount: resultsData.length
    })
  }

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C'
    if (percentage >= 40) return 'D'
    return 'F'
  }

  const handleDownloadPDF = async () => {
    try {
      await reportService.downloadStudentReportCard(user.id)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download report card')
    }
  }

  if (loading && results.length === 0) {
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
              <h1><FaTrophy /> My Results</h1>
              <p className="text-secondary">View your examination results</p>
            </div>
            <button onClick={handleDownloadPDF} className="btn btn-primary">
              <FaFilePdf /> Download Report Card
            </button>
          </div>

          {/* Exam Selector */}
          <Card>
            <div className="exam-selector">
              <label>Select Exam:</label>
              <select 
                value={selectedExam} 
                onChange={(e) => setSelectedExam(e.target.value)}
                className="exam-select"
              >
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.examName} ({exam.examType})
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Overall Statistics */}
          {overallStats && (
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">
                  <FaChartLine />
                </div>
                <div className="stat-details">
                  <h3>{overallStats.percentage}%</h3>
                  <p>Overall Percentage</p>
                </div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">
                  <FaTrophy />
                </div>
                <div className="stat-details">
                  <h3>{overallStats.grade}</h3>
                  <p>Overall Grade</p>
                </div>
              </div>
              <div className="stat-card purple">
                <div className="stat-details">
                  <h3>{overallStats.totalObtained}/{overallStats.totalMax}</h3>
                  <p>Total Marks</p>
                </div>
              </div>
              <div className="stat-card orange">
                <div className="stat-details">
                  <h3>{overallStats.subjectCount}</h3>
                  <p>Subjects</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Table */}
          <Card title="Subject-wise Results">
            {results.length > 0 ? (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Max Marks</th>
                      <th>Marks Obtained</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td className="subject-name">{result.subject?.subjectName || 'N/A'}</td>
                        <td>{result.maxMarks}</td>
                        <td className="marks-obtained">{result.marksObtained}</td>
                        <td>
                          <div className="percentage-bar">
                            <div 
                              className="percentage-fill" 
                              style={{ width: `${result.percentage}%` }}
                            ></div>
                            <span className="percentage-text">{result.percentage}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`grade-badge grade-${result.grade?.replace('+', 'plus')}`}>
                            {result.grade}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${result.percentage >= 40 ? 'pass' : 'fail'}`}>
                            {result.percentage >= 40 ? 'Pass' : 'Fail'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td><strong>TOTAL</strong></td>
                      <td><strong>{overallStats?.totalMax}</strong></td>
                      <td><strong>{overallStats?.totalObtained}</strong></td>
                      <td><strong>{overallStats?.percentage}%</strong></td>
                      <td>
                        <span className={`grade-badge grade-${overallStats?.grade?.replace('+', 'plus')}`}>
                          {overallStats?.grade}
                        </span>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <FaTrophy size={64} />
                <h3>No Results Available</h3>
                <p>Results for this exam haven't been published yet.</p>
              </div>
            )}
          </Card>

          {/* Performance Analysis */}
          {results.length > 0 && (
            <Card title="Performance Analysis">
              <div className="performance-grid">
                <div className="performance-card">
                  <h4>Highest Score</h4>
                  <div className="performance-value">{overallStats?.highest}</div>
                  <p className="text-secondary">marks</p>
                </div>
                <div className="performance-card">
                  <h4>Lowest Score</h4>
                  <div className="performance-value">{overallStats?.lowest}</div>
                  <p className="text-secondary">marks</p>
                </div>
                <div className="performance-card">
                  <h4>Average Score</h4>
                  <div className="performance-value">
                    {(overallStats?.totalObtained / overallStats?.subjectCount).toFixed(1)}
                  </div>
                  <p className="text-secondary">per subject</p>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

export default StudentResults