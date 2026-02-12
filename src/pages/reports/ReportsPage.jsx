import { FaFilePdf, FaFileExcel, FaChartBar, FaUsers, FaClipboardCheck, FaTrophy } from 'react-icons/fa'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import Card from '../../components/common/Card'
import { useAuth } from '../../context/AuthContext'
import { reportService } from '../../services/reportservice'
import './ReportsPage.css'

/**
 * Reports Page - Download and generate reports
 * File: frontend/src/pages/reports/ReportsPage.jsx
 */
const ReportsPage = () => {
  const { user } = useAuth()

  const handleDownloadStudentsPDF = async () => {
    try {
      await reportService.downloadStudentsPDF(user.schoolId)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download students PDF')
    }
  }

  const handleDownloadStudentsExcel = async () => {
    try {
      await reportService.downloadStudentsExcel(user.schoolId)
    } catch (error) {
      console.error('Error downloading Excel:', error)
      alert('Failed to download students Excel')
    }
  }

  const reports = [
    {
      id: 1,
      title: 'Student Reports',
      description: 'Download complete list of students with all details',
      icon: FaUsers,
      color: 'blue',
      actions: [
        { label: 'Download PDF', icon: FaFilePdf, handler: handleDownloadStudentsPDF },
        { label: 'Download Excel', icon: FaFileExcel, handler: handleDownloadStudentsExcel }
      ]
    },
    {
      id: 2,
      title: 'Attendance Reports',
      description: 'View and download attendance records by class or student',
      icon: FaClipboardCheck,
      color: 'green',
      actions: [
        { label: 'Generate PDF', icon: FaFilePdf },
        { label: 'Generate Excel', icon: FaFileExcel }
      ]
    },
    {
      id: 3,
      title: 'Exam Results',
      description: 'Download examination results and performance analysis',
      icon: FaTrophy,
      color: 'purple',
      actions: [
        { label: 'Download PDF', icon: FaFilePdf },
        { label: 'Download Excel', icon: FaFileExcel }
      ]
    },
    {
      id: 4,
      title: 'Performance Analytics',
      description: 'View detailed performance analytics and trends',
      icon: FaChartBar,
      color: 'orange',
      actions: [
        { label: 'View Dashboard', icon: FaChartBar },
        { label: 'Export Data', icon: FaFileExcel }
      ]
    },
    {
      id: 5,
      title: 'Teacher Reports',
      description: 'Download list of teachers with qualifications',
      icon: FaUsers,
      color: 'teal',
      actions: [
        { label: 'Download PDF', icon: FaFilePdf },
        { label: 'Download Excel', icon: FaFileExcel }
      ]
    },
    {
      id: 6,
      title: 'Financial Reports',
      description: 'Fee collection and payment reports',
      icon: FaChartBar,
      color: 'red',
      actions: [
        { label: 'Generate Report', icon: FaFilePdf },
        { label: 'Export Data', icon: FaFileExcel }
      ]
    }
  ]

  const getIconComponent = (IconComponent, color) => {
    return (
      <div className={`report-icon ${color}`}>
        <IconComponent />
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-main">
          <div className="page-header">
            <div>
              <h1>Reports & Analytics</h1>
              <p className="text-secondary">Generate and download various reports</p>
            </div>
          </div>

          <div className="reports-grid">
            {reports.map(report => (
              <div key={report.id} className="report-card">
                {getIconComponent(report.icon, report.color)}
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <div className="report-actions">
                  {report.actions.map((action, index) => (
                    <button 
                      key={index}
                      onClick={action.handler}
                      className={`btn btn-sm ${index === 0 ? 'btn-primary' : 'btn-outline'}`}
                    >
                      <action.icon /> {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <Card title="Report Statistics">
            <div className="report-stats">
              <div className="stat-item">
                <h4>Total Reports Generated</h4>
                <p className="stat-number">1,234</p>
              </div>
              <div className="stat-item">
                <h4>This Month</h4>
                <p className="stat-number">56</p>
              </div>
              <div className="stat-item">
                <h4>PDF Downloads</h4>
                <p className="stat-number">789</p>
              </div>
              <div className="stat-item">
                <h4>Excel Exports</h4>
                <p className="stat-number">445</p>
              </div>
            </div>
          </Card>

          {/* Recent Reports */}
          <Card title="Recent Reports">
            <div className="recent-reports-list">
              <div className="recent-report-item">
                <div className="report-info">
                  <FaFilePdf className="report-file-icon pdf" />
                  <div>
                    <strong>Student List - Class 5A</strong>
                    <p className="text-secondary">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline">Download</button>
              </div>
              <div className="recent-report-item">
                <div className="report-info">
                  <FaFileExcel className="report-file-icon excel" />
                  <div>
                    <strong>Attendance Report - January 2024</strong>
                    <p className="text-secondary">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline">Download</button>
              </div>
              <div className="recent-report-item">
                <div className="report-info">
                  <FaFilePdf className="report-file-icon pdf" />
                  <div>
                    <strong>Exam Results - Final Term</strong>
                    <p className="text-secondary">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline">Download</button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default ReportsPage