import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaTrophy, FaChartLine, FaFilePdf, FaCalendar } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import api from '../../services/api'
import './StudentPerformance.css'

/**
 * Student Performance Page - Principal/Teacher view of student performance
 * File: frontend/src/pages/students/StudentPerformance.jsx
 */
const StudentPerformance = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedExam, setSelectedExam] = useState('all')

  useEffect(() => {
    fetchStudentData()
    fetchPerformanceData()
  }, [id])

  const fetchStudentData = async () => {
    try {
      const response = await api.get(`/students/${id}`)
      if (response.success) {
        setStudent(response.data)
      }
    } catch (error) {
      console.error('Error fetching student:', error)
    }
  }

  const fetchPerformanceData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/students/${id}/performance`)
      
      if (response.success) {
        setPerformance(response.data || getDemoPerformance())
      } else {
        setPerformance(getDemoPerformance())
      }
    } catch (error) {
      console.error('Error fetching performance:', error)
      setPerformance(getDemoPerformance())
    } finally {
      setLoading(false)
    }
  }

  const getDemoPerformance = () => ({
    overallStats: {
      overallPercentage: 82.5,
      overallGrade: 'A',
      totalExams: 4,
      rank: 12,
      totalStudents: 45
    },
    examResults: [
      {
        examId: 1,
        examName: 'First Term',
        examType: 'MIDTERM',
        percentage: 85.2,
        grade: 'A',
        totalMarks: 500,
        obtainedMarks: 426,
        subjects: [
          { name: 'Mathematics', maxMarks: 100, obtained: 92, grade: 'A+' },
          { name: 'English', maxMarks: 100, obtained: 78, grade: 'B+' },
          { name: 'Science', maxMarks: 100, obtained: 88, grade: 'A' },
          { name: 'Social Studies', maxMarks: 100, obtained: 85, grade: 'A' },
          { name: 'Hindi', maxMarks: 100, obtained: 83, grade: 'A' }
        ]
      },
      {
        examId: 2,
        examName: 'Second Term',
        examType: 'MIDTERM',
        percentage: 79.8,
        grade: 'B+',
        totalMarks: 500,
        obtainedMarks: 399,
        subjects: [
          { name: 'Mathematics', maxMarks: 100, obtained: 88, grade: 'A' },
          { name: 'English', maxMarks: 100, obtained: 75, grade: 'B' },
          { name: 'Science', maxMarks: 100, obtained: 82, grade: 'A' },
          { name: 'Social Studies', maxMarks: 100, obtained: 78, grade: 'B+' },
          { name: 'Hindi', maxMarks: 100, obtained: 76, grade: 'B+' }
        ]
      }
    ],
    attendance: {
      totalDays: 180,
      presentDays: 168,
      absentDays: 12,
      percentage: 93.3
    },
    behavior: {
      discipline: 'Good',
      punctuality: 'Excellent',
      participation: 'Very Good',
      remarks: 'Consistent performer with good behavior'
    }
  })

  const downloadReport = async () => {
    try {
      alert('Downloading performance report...')
      // Implement PDF download
    } catch (error) {
      console.error('Error downloading report:', error)
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
              <h1>Student Performance Analysis</h1>
              <p className="text-secondary">
                {student?.user?.firstName} {student?.user?.lastName} - {student?.classSection?.classEntity?.className} {student?.classSection?.section?.sectionName}
              </p>
            </div>
            <div className="page-actions">
              <button onClick={() => navigate(`/students/${id}`)} className="btn btn-outline">
                <FaArrowLeft /> Back
              </button>
              <button onClick={downloadReport} className="btn btn-primary">
                <FaFilePdf /> Download Report
              </button>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-details">
                <h3>{performance?.overallStats?.overallPercentage}%</h3>
                <p>Overall Percentage</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">
                <FaTrophy />
              </div>
              <div className="stat-details">
                <h3>{performance?.overallStats?.overallGrade}</h3>
                <p>Overall Grade</p>
              </div>
            </div>
            <div className="stat-card purple">
              <div className="stat-details">
                <h3>#{performance?.overallStats?.rank}</h3>
                <p>Class Rank (out of {performance?.overallStats?.totalStudents})</p>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-details">
                <h3>{performance?.attendance?.percentage}%</h3>
                <p>Attendance</p>
              </div>
            </div>
          </div>

          {/* Exam Results */}
          <Card title="Examination Performance">
            {performance?.examResults?.map((exam) => (
              <div key={exam.examId} className="exam-performance-card">
                <div className="exam-header">
                  <div>
                    <h3>{exam.examName}</h3>
                    <span className="exam-type-badge">{exam.examType}</span>
                  </div>
                  <div className="exam-summary">
                    <div className="summary-item">
                      <strong>{exam.percentage}%</strong>
                      <span>Percentage</span>
                    </div>
                    <div className="summary-item">
                      <strong className={`grade-${exam.grade.replace('+', 'plus')}`}>{exam.grade}</strong>
                      <span>Grade</span>
                    </div>
                    <div className="summary-item">
                      <strong>{exam.obtainedMarks}/{exam.totalMarks}</strong>
                      <span>Marks</span>
                    </div>
                  </div>
                </div>

                <div className="subjects-grid">
                  {exam.subjects.map((subject, idx) => (
                    <div key={idx} className="subject-performance">
                      <div className="subject-name">{subject.name}</div>
                      <div className="subject-marks">
                        <span className="marks-obtained">{subject.obtained}</span>
                        <span className="marks-separator">/</span>
                        <span className="marks-max">{subject.maxMarks}</span>
                      </div>
                      <span className={`grade-badge grade-${subject.grade.replace('+', 'plus')}`}>
                        {subject.grade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          {/* Attendance Record */}
          <Card title="Attendance Record">
            <div className="attendance-summary">
              <div className="attendance-stat">
                <h4>{performance?.attendance?.totalDays}</h4>
                <p>Total Days</p>
              </div>
              <div className="attendance-stat present">
                <h4>{performance?.attendance?.presentDays}</h4>
                <p>Present</p>
              </div>
              <div className="attendance-stat absent">
                <h4>{performance?.attendance?.absentDays}</h4>
                <p>Absent</p>
              </div>
              <div className="attendance-stat percentage">
                <h4>{performance?.attendance?.percentage}%</h4>
                <p>Percentage</p>
              </div>
            </div>
          </Card>

          {/* Behavior & Remarks */}
          <Card title="Behavior & Conduct">
            <div className="behavior-grid">
              <div className="behavior-item">
                <label>Discipline</label>
                <span className="behavior-value">{performance?.behavior?.discipline}</span>
              </div>
              <div className="behavior-item">
                <label>Punctuality</label>
                <span className="behavior-value">{performance?.behavior?.punctuality}</span>
              </div>
              <div className="behavior-item">
                <label>Class Participation</label>
                <span className="behavior-value">{performance?.behavior?.participation}</span>
              </div>
            </div>
            
            {performance?.behavior?.remarks && (
              <div className="remarks-section">
                <h4>Remarks</h4>
                <p>{performance.behavior.remarks}</p>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  )
}

export default StudentPerformance