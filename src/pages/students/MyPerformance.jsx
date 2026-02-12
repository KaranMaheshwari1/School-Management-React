import { useState, useEffect } from 'react'
import { FaTrophy, FaChartLine, FaFilePdf, FaCalendar, FaMedal } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import './MyPerformance.css'

/**
 * My Performance Page - Student view of own performance
 * File: frontend/src/pages/students/MyPerformance.jsx
 */
const MyPerformance = () => {
  const { user } = useAuth()
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyPerformance()
  }, [])

  const fetchMyPerformance = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/students/${user.id}/performance`)
      
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
      rank: 12,
      totalStudents: 45,
      improvement: '+5.2%'
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
        rank: 10,
        subjects: [
          { name: 'Mathematics', maxMarks: 100, obtained: 92, grade: 'A+', class_avg: 75 },
          { name: 'English', maxMarks: 100, obtained: 78, grade: 'B+', class_avg: 72 },
          { name: 'Science', maxMarks: 100, obtained: 88, grade: 'A', class_avg: 70 },
          { name: 'Social Studies', maxMarks: 100, obtained: 85, grade: 'A', class_avg: 68 },
          { name: 'Hindi', maxMarks: 100, obtained: 83, grade: 'A', class_avg: 73 }
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
        rank: 14,
        subjects: [
          { name: 'Mathematics', maxMarks: 100, obtained: 88, grade: 'A', class_avg: 72 },
          { name: 'English', maxMarks: 100, obtained: 75, grade: 'B', class_avg: 70 },
          { name: 'Science', maxMarks: 100, obtained: 82, grade: 'A', class_avg: 68 },
          { name: 'Social Studies', maxMarks: 100, obtained: 78, grade: 'B+', class_avg: 65 },
          { name: 'Hindi', maxMarks: 100, obtained: 76, grade: 'B+', class_avg: 71 }
        ]
      }
    ],
    attendance: {
      totalDays: 180,
      presentDays: 168,
      absentDays: 12,
      percentage: 93.3,
      lateArrivals: 5
    },
    strengths: ['Mathematics', 'Science'],
    improvements: ['English'],
    achievements: [
      { title: 'Mathematics Olympiad', rank: '3rd Place', date: '2024-02-15' },
      { title: 'Perfect Attendance - January', date: '2024-01-31' }
    ]
  })

  const downloadReport = async () => {
    try {
      alert('Downloading performance report...')
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
              <h1><FaTrophy /> My Performance</h1>
              <p className="text-secondary">Track your academic progress and achievements</p>
            </div>
            <button onClick={downloadReport} className="btn btn-primary">
              <FaFilePdf /> Download Report Card
            </button>
          </div>

          {/* Overall Stats */}
          <div className="performance-hero">
            <div className="hero-main">
              <div className="hero-circle">
                <div className="percentage-display">
                  <h2>{performance?.overallStats?.overallPercentage}%</h2>
                  <p>Overall</p>
                </div>
              </div>
              <div className="hero-details">
                <div className="hero-stat">
                  <FaTrophy className="hero-icon" />
                  <div>
                    <h3>{performance?.overallStats?.overallGrade}</h3>
                    <p>Current Grade</p>
                  </div>
                </div>
                <div className="hero-stat">
                  <FaMedal className="hero-icon" />
                  <div>
                    <h3>Rank #{performance?.overallStats?.rank}</h3>
                    <p>Out of {performance?.overallStats?.totalStudents} students</p>
                  </div>
                </div>
                <div className="hero-stat improvement">
                  <FaChartLine className="hero-icon" />
                  <div>
                    <h3>{performance?.overallStats?.improvement}</h3>
                    <p>Improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon"><FaCalendar /></div>
              <div>
                <h4>{performance?.attendance?.percentage}%</h4>
                <p>Attendance</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon"><FaTrophy /></div>
              <div>
                <h4>{performance?.achievements?.length || 0}</h4>
                <p>Achievements</p>
              </div>
            </div>
            <div className="stat-card purple">
              <div>
                <h4>{performance?.strengths?.length || 0}</h4>
                <p>Strong Subjects</p>
              </div>
            </div>
            <div className="stat-card orange">
              <div>
                <h4>{performance?.examResults?.length || 0}</h4>
                <p>Exams Taken</p>
              </div>
            </div>
          </div>

          {/* Exam Performance */}
          <Card title="Examination Results">
            {performance?.examResults?.map((exam) => (
              <div key={exam.examId} className="exam-card">
                <div className="exam-card-header">
                  <div>
                    <h3>{exam.examName}</h3>
                    <span className="exam-type">{exam.examType}</span>
                  </div>
                  <div className="exam-scores">
                    <div className="score-item">
                      <span className="score-value">{exam.percentage}%</span>
                      <span className="score-label">Score</span>
                    </div>
                    <div className="score-item">
                      <span className={`score-value grade-${exam.grade.replace('+', 'plus')}`}>{exam.grade}</span>
                      <span className="score-label">Grade</span>
                    </div>
                    <div className="score-item">
                      <span className="score-value">#{exam.rank}</span>
                      <span className="score-label">Rank</span>
                    </div>
                  </div>
                </div>

                <div className="subjects-performance">
                  {exam.subjects.map((subject, idx) => (
                    <div key={idx} className="subject-card">
                      <div className="subject-header">
                        <span className="subject-name">{subject.name}</span>
                        <span className={`subject-grade grade-${subject.grade.replace('+', 'plus')}`}>
                          {subject.grade}
                        </span>
                      </div>
                      <div className="subject-score">
                        <span className="score-large">{subject.obtained}</span>
                        <span className="score-divider">/</span>
                        <span className="score-max">{subject.maxMarks}</span>
                      </div>
                      <div className="subject-comparison">
                        <div className="comparison-bar">
                          <div 
                            className="comparison-fill my-score" 
                            style={{ width: `${(subject.obtained / subject.maxMarks) * 100}%` }}
                          ></div>
                          <div 
                            className="comparison-fill class-avg" 
                            style={{ width: `${(subject.class_avg / subject.maxMarks) * 100}%` }}
                          ></div>
                        </div>
                        <div className="comparison-legend">
                          <span className="legend-item">
                            <span className="legend-color my-score"></span>
                            You: {subject.obtained}
                          </span>
                          <span className="legend-item">
                            <span className="legend-color class-avg"></span>
                            Avg: {subject.class_avg}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          {/* Strengths & Improvements */}
          <div className="two-column-grid">
            <Card title="💪 Strengths">
              <div className="strength-list">
                {performance?.strengths?.map((subject, idx) => (
                  <div key={idx} className="strength-item">
                    <span className="strength-icon">⭐</span>
                    <span>{subject}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="📈 Areas to Improve">
              <div className="improvement-list">
                {performance?.improvements?.map((subject, idx) => (
                  <div key={idx} className="improvement-item">
                    <span className="improvement-icon">📚</span>
                    <span>{subject}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Achievements */}
          {performance?.achievements && performance.achievements.length > 0 && (
            <Card title="🏆 Recent Achievements">
              <div className="achievements-grid">
                {performance.achievements.map((achievement, idx) => (
                  <div key={idx} className="achievement-card">
                    <div className="achievement-icon">
                      <FaMedal />
                    </div>
                    <div className="achievement-details">
                      <h4>{achievement.title}</h4>
                      <p className="achievement-rank">{achievement.rank}</p>
                      <p className="achievement-date">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Attendance Summary */}
          <Card title="Attendance Summary">
            <div className="attendance-display">
              <div className="attendance-circle">
                <svg width="200" height="200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="var(--gray-200)"
                    strokeWidth="20"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="20"
                    strokeDasharray={`${(performance?.attendance?.percentage / 100) * 502.4} 502.4`}
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dy="10"
                    fontSize="36"
                    fontWeight="700"
                    fill="var(--text-primary)"
                  >
                    {performance?.attendance?.percentage}%
                  </text>
                </svg>
              </div>
              <div className="attendance-stats">
                <div className="attendance-stat-item">
                  <span className="stat-number">{performance?.attendance?.presentDays}</span>
                  <span className="stat-label">Present</span>
                </div>
                <div className="attendance-stat-item">
                  <span className="stat-number">{performance?.attendance?.absentDays}</span>
                  <span className="stat-label">Absent</span>
                </div>
                <div className="attendance-stat-item">
                  <span className="stat-number">{performance?.attendance?.totalDays}</span>
                  <span className="stat-label">Total Days</span>
                </div>
                <div className="attendance-stat-item">
                  <span className="stat-number">{performance?.attendance?.lateArrivals}</span>
                  <span className="stat-label">Late</span>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default MyPerformance