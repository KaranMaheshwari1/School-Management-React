import { Link } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav">
          <h2>School Management System</h2>
          <div className="nav-links">
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Modern School Management Made Simple</h1>
          <p>
            Manage students, teachers, attendance, exams, and more with our 
            comprehensive school management platform.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/about" className="btn btn-outline btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Student Management</h3>
            <p>Complete student lifecycle management from admission to graduation</p>
          </div>
          <div className="feature-card">
            <h3>Attendance Tracking</h3>
            <p>Digital attendance with detailed reports and analytics</p>
          </div>
          <div className="feature-card">
            <h3>Exam Management</h3>
            <p>Schedule exams, record results, and track performance</p>
          </div>
          <div className="feature-card">
            <h3>Communication</h3>
            <p>Notice board, events, and parent-teacher communication</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 School Management System. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage