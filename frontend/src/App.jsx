import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Trash, Edit3, User, Lock, CheckCircle, 
  TrendingUp, Award, AlertTriangle, FileText, LogOut, 
  ChevronRight, Calendar, Info, RefreshCw, BarChart2, ShieldAlert
} from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

function App() {
  // Authentication & Session State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLogin, setIsLogin] = useState(true); // login vs signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Auth Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'

  // Application State
  const [view, setView] = useState('login'); // 'login', 'dashboard', 'attempt', 'result'
  const [questions, setQuestions] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  
  // Question CRUD State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [idealAnswer, setIdealAnswer] = useState('');
  const [maxMarks, setMaxMarks] = useState(10);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // Attempt Test State
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Initialize: Load user details if token exists
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setView('login');
    }
  }, [token]);

  // Load dashboard data based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'teacher') {
        fetchTeacherData();
      } else {
        fetchStudentData();
      }
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setView('dashboard');
      } else {
        // Token expired or invalid
        logout();
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch Questions
      const questionsRes = await fetch(`${API_URL}/questions`, { headers });
      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        setQuestions(questionsData);
      }

      // Fetch Submissions
      const submissionsRes = await fetch(`${API_URL}/submissions/all`, { headers });
      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json();
        setAllSubmissions(submissionsData);
      }

      // Fetch Dashboard Stats
      const statsRes = await fetch(`${API_URL}/submissions/dashboard-stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setDashboardStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    }
  };

  const fetchStudentData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch Questions
      const questionsRes = await fetch(`${API_URL}/questions`, { headers });
      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        setQuestions(questionsData);
      }

      // Fetch Student's Results
      const resultsRes = await fetch(`${API_URL}/submissions/my-results`, { headers });
      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        setMyResults(resultsData);
      }
    } catch (err) {
      console.error('Error fetching student data:', err);
    }
  };

  // Auth Handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const body = isLogin 
      ? { username, password } 
      : { username, name, password, role };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setToken(data.token);
      setUser({
        _id: data._id,
        username: data.username,
        name: data.name,
        role: data.role
      });
      // Clear forms
      setUsername('');
      setPassword('');
      setName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    setView('login');
  };

  // Question CRUD Handlers (Teacher only)
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setError('');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    const body = JSON.stringify({ questionText, idealAnswer, maxMarks });

    try {
      let res;
      if (editingQuestionId) {
        res = await fetch(`${API_URL}/questions/${editingQuestionId}`, {
          method: 'PUT',
          headers,
          body
        });
      } else {
        res = await fetch(`${API_URL}/questions`, {
          method: 'POST',
          headers,
          body
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save question');
      }

      // Refresh list & reset modal
      setShowQuestionModal(false);
      setQuestionText('');
      setIdealAnswer('');
      setMaxMarks(10);
      setEditingQuestionId(null);
      fetchTeacherData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditQuestionClick = (q) => {
    setEditingQuestionId(q._id);
    setQuestionText(q.questionText);
    setIdealAnswer(q.idealAnswer);
    setMaxMarks(q.maxMarks);
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTeacherData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete question');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Student Attempt Test Handlers
  const startExamAttempt = (q) => {
    setActiveQuestion(q);
    setStudentAnswer('');
    setView('attempt');
  };

  const handleSubmitExam = async (e) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;

    setSubmittingAnswer(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          questionId: activeQuestion._id,
          studentAnswer
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI similarity evaluation failed');
      }

      setEvaluationResult(data.result);
      setView('result');
      fetchStudentData(); // Refresh history list
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Helper for Result badges styles
  const getFeedbackClass = (percentage) => {
    if (percentage > 90) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'needs-improvement';
    return 'fail';
  };

  // UI Views Router
  if (loading && !user) {
    return (
      <div className="page-spinner-container">
        <div className="spinner spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-brand">
          <Award size={28} />
          <span>EvalAI</span>
        </div>
        
        {user && (
          <div className="nav-menu">
            <div className="nav-user">
              <div className="nav-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{fontWeight: 600}}>{user.name}</span>
              <span className={`nav-role-badge badge-${user.role}`}>
                {user.role}
              </span>
            </div>
            <button onClick={logout} className="btn btn-secondary btn-icon" title="Log Out">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </header>

      {/* LOGIN / SIGNUP VIEW */}
      {view === 'login' && (
        <div className="auth-container">
          <div className="card auth-card">
            <div className="auth-header">
              <h1>Semantic Grader</h1>
              <p>{isLogin ? 'Sign in to evaluate answers' : 'Create an account to start'}</p>
            </div>

            {error && (
              <div className="error-alert">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAuth}>
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Username</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Choose Role</label>
                  <div className="role-toggle">
                    <button 
                      type="button" 
                      className={`role-btn ${role === 'student' ? 'active' : ''}`}
                      onClick={() => setRole('student')}
                    >
                      Student
                    </button>
                    <button 
                      type="button" 
                      className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                      onClick={() => setRole('teacher')}
                    >
                      Teacher
                    </button>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? <div className="spinner"></div> : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div className="auth-footer">
              {isLogin ? (
                <span>
                  Don't have an account?{' '}
                  <span className="auth-link" onClick={() => setIsLogin(false)}>
                    Register here
                  </span>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <span className="auth-link" onClick={() => setIsLogin(true)}>
                    Sign in here
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARDS */}
      {view === 'dashboard' && user && (
        <main className="dashboard-container">
          
          {/* TEACHER DASHBOARD */}
          {user.role === 'teacher' && (
            <div>
              <div className="dashboard-header">
                <div className="dashboard-title">
                  <h1>Teacher Dashboard</h1>
                  <p>Create questions, review scores, and track analytics</p>
                </div>
                <button onClick={() => {
                  setEditingQuestionId(null);
                  setQuestionText('');
                  setIdealAnswer('');
                  setMaxMarks(10);
                  setShowQuestionModal(true);
                }} className="btn btn-primary">
                  <Plus size={18} />
                  <span>Create Question</span>
                </button>
              </div>

              {/* Stats Analytics */}
              {dashboardStats && (
                <div className="stat-grid">
                  <div className="stat-card">
                    <span className="stat-title">Total Questions</span>
                    <span className="stat-value">{dashboardStats.summary.totalQuestions}</span>
                    <span className="stat-desc">Created definitions</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-title">Submitting Students</span>
                    <span className="stat-value">{dashboardStats.summary.totalStudents}</span>
                    <span className="stat-desc">Enrolled accounts</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-title">Class Average Score</span>
                    <span className="stat-value">{dashboardStats.summary.averageSimilarity}%</span>
                    <span className="stat-desc">Semantic similarity mean</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-title">Pass Rate (&gt;40%)</span>
                    <span className="stat-value">{dashboardStats.summary.passPercentage}%</span>
                    <span className="stat-desc">Total passing submissions</span>
                  </div>
                </div>
              )}

              {/* Main Content Grid */}
              <div className="dashboard-grid">
                
                {/* Left Side: Question List & Submissions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Question Management */}
                  <div className="card">
                    <div className="section-header">
                      <h2>Managed Questions</h2>
                      <span className="badge-teacher nav-role-badge">{questions.length} total</span>
                    </div>
                    {questions.length === 0 ? (
                      <div className="empty-state">
                        <BookOpen size={48} />
                        <h3>No questions yet</h3>
                        <p>Click "Create Question" to add your first assessment</p>
                      </div>
                    ) : (
                      <div className="item-list">
                        {questions.map(q => (
                          <div key={q._id} className="item-row">
                            <div className="item-content">
                              <span className="item-title">{q.questionText}</span>
                              <div className="item-meta">
                                <span>Max Marks: {q.maxMarks}</span>
                                <span style={{color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: '0.8rem'}}>
                                  Ideal: {q.idealAnswer.substring(0, 70)}{q.idealAnswer.length > 70 ? '...' : ''}
                                </span>
                              </div>
                            </div>
                            <div className="item-actions">
                              <button onClick={() => handleEditQuestionClick(q)} className="btn btn-secondary btn-icon" title="Edit Question">
                                <Edit3 size={15} />
                              </button>
                              <button onClick={() => handleDeleteQuestion(q._id)} className="btn btn-danger btn-icon" title="Delete Question">
                                <Trash size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Student Submissions List */}
                  <div className="card">
                    <div className="section-header">
                      <h2>Student Submissions</h2>
                      <span className="badge-student nav-role-badge">{allSubmissions.length} graded</span>
                    </div>
                    {allSubmissions.length === 0 ? (
                      <div className="empty-state">
                        <FileText size={48} />
                        <h3>No submissions yet</h3>
                        <p>Students have not attempted any tests yet.</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                              <th style={{ padding: '0.75rem' }}>Student</th>
                              <th style={{ padding: '0.75rem' }}>Question</th>
                              <th style={{ padding: '0.75rem' }}>Similarity</th>
                              <th style={{ padding: '0.75rem' }}>Marks</th>
                              <th style={{ padding: '0.75rem' }}>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allSubmissions.map(sub => (
                              <tr key={sub._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{sub.studentId?.name || 'Unknown'}</td>
                                <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                                  {sub.questionId?.questionText || 'Deleted Question'}
                                </td>
                                <td style={{ padding: '0.75rem', color: 'var(--primary)' }}>
                                  {Math.round(sub.similarity * 100)}%
                                </td>
                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                                  {sub.marks} / {sub.questionId?.maxMarks || 10}
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                  <span className={`feedback-badge ${getFeedbackClass(sub.similarity * 100)}`} style={{ margin: 0, padding: '0.15rem 0.5rem', fontSize: '0.75rem' }}>
                                    {sub.feedback.split('.')[0]}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Analytics Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  {/* Topic Performance Chart */}
                  <div className="card">
                    <div className="section-header">
                      <h2>Question Analytics</h2>
                      <BarChart2 size={18} />
                    </div>
                    {dashboardStats && dashboardStats.questionPerformances.length > 0 ? (
                      <div className="analytics-chart">
                        {dashboardStats.questionPerformances.map(stat => (
                          <div key={stat.questionId} className="chart-bar-wrapper">
                            <div className="chart-label">
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', maxWidth: '75%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                {stat.questionText}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                                {stat.averageSimilarity}%
                              </span>
                            </div>
                            <div className="chart-bar-bg">
                              <div 
                                className={`chart-bar-fill ${stat.averageSimilarity < 65 ? 'weak' : stat.averageSimilarity > 85 ? 'strong' : ''}`} 
                                style={{ width: `${stat.averageSimilarity}%` }}
                              ></div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {stat.submissionCount} attempts
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>No statistics available. Need submitted student answers.</p>
                      </div>
                    )}
                  </div>

                  {/* Weak Topics Warnings */}
                  <div className="card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div className="section-header">
                      <h2 style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldAlert size={18} />
                        <span>Action Required</span>
                      </h2>
                    </div>
                    {dashboardStats && dashboardStats.weakTopics.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Students are struggling with these topics (average semantic accuracy &lt; 65%):
                        </p>
                        {dashboardStats.weakTopics.map((topic, i) => (
                          <div key={i} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 600, color: '#fca5a5', marginBottom: '0.25rem' }}>
                              {topic.questionText}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>
                              Class average: <span style={{ color: '#f87171', fontWeight: 'bold' }}>{topic.averageSimilarity}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state" style={{ padding: '1rem 0' }}>
                        <CheckCircle size={28} style={{ color: 'var(--success)' }} />
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          No topics currently identified as weak. Good work!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STUDENT DASHBOARD */}
          {user.role === 'student' && (
            <div>
              <div className="dashboard-header">
                <div className="dashboard-title">
                  <h1>Welcome, {user.name}!</h1>
                  <p>Select a question to evaluate your answer semantics</p>
                </div>
              </div>

              <div className="dashboard-grid">
                
                {/* Left: Available Questions / Exams */}
                <div className="card">
                  <div className="section-header">
                    <h2>Available Assessments</h2>
                    <span className="badge-student nav-role-badge">{questions.length} total</span>
                  </div>
                  {questions.length === 0 ? (
                    <div className="empty-state">
                      <BookOpen size={48} />
                      <h3>No assessments</h3>
                      <p>Your teacher has not uploaded any questions yet.</p>
                    </div>
                  ) : (
                    <div className="item-list">
                      {questions.map(q => {
                        const previousSubmission = myResults.find(r => r.questionId?._id === q._id);
                        return (
                          <div key={q._id} className="item-row">
                            <div className="item-content">
                              <span className="item-title">{q.questionText}</span>
                              <div className="item-meta">
                                <span>Max Marks: {q.maxMarks}</span>
                                {previousSubmission && (
                                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                                    Completed: {previousSubmission.marks} / {q.maxMarks} ({Math.round(previousSubmission.similarity * 100)}%)
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="item-actions">
                              <button onClick={() => startExamAttempt(q)} className="btn btn-primary">
                                <span>{previousSubmission ? 'Retry Test' : 'Take Test'}</span>
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right: Past Submission Grading History */}
                <div className="card">
                  <div className="section-header">
                    <h2>Evaluation History</h2>
                    <FileText size={18} />
                  </div>
                  {myResults.length === 0 ? (
                    <div className="empty-state">
                      <p>You have not submitted any answers yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {myResults.map(resItem => (
                        <div key={resItem._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ maxWidth: '70%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                              {resItem.questionId?.questionText || 'Deleted Question'}
                            </span>
                            <span style={{ color: 'var(--primary)' }}>
                              {resItem.marks}/{resItem.questionId?.maxMarks || 10}
                            </span>
                          </div>
                          <div className={`feedback-badge ${getFeedbackClass(resItem.similarity * 100)}`} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', margin: '0.25rem 0' }}>
                            {Math.round(resItem.similarity * 100)}% Match
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            "{resItem.studentAnswer.substring(0, 80)}{resItem.studentAnswer.length > 80 ? '...' : ''}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>
      )}

      {/* ATTEMPT EXAM INTERFACE */}
      {view === 'attempt' && activeQuestion && (
        <main className="dashboard-container">
          <button onClick={() => setView('dashboard')} className="btn btn-secondary mb-3">
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
            <span>Cancel and Go Back</span>
          </button>

          <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="section-header">
              <h2>Descriptive Assessment</h2>
              <span className="badge-student nav-role-badge">Max Marks: {activeQuestion.maxMarks}</span>
            </div>

            {error && (
              <div className="error-alert">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="question-prompt">
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Question
              </span>
              {activeQuestion.questionText}
            </div>

            <form onSubmit={handleSubmitExam}>
              <div className="form-group">
                <label className="form-label">Type your answer below</label>
                <textarea
                  className="answer-textarea"
                  placeholder="Evaluate semantic concepts (word syntax does not affect score, focuses on semantic relevance)..."
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  disabled={submittingAnswer}
                  required
                />
              </div>

              <div className="flex-between">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  AI semantic grader will analyze sentence-level representations.
                </span>
                <button type="submit" className="btn btn-primary" disabled={submittingAnswer || !studentAnswer.trim()}>
                  {submittingAnswer ? (
                    <>
                      <div className="spinner"></div>
                      <span>Evaluating via S-BERT...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      )}

      {/* EVALUATION RESULTS SCREEN */}
      {view === 'result' && evaluationResult && (
        <main className="dashboard-container">
          <div className="card result-container">
            <div className="auth-header">
              <h1>Grading Analysis</h1>
              <p>Natural Language Processing Semantic Assessment</p>
            </div>

            <div className={`result-score-circle ${getFeedbackClass(evaluationResult.similarity * 100)}`}>
              <span className="score-num">{evaluationResult.marks}</span>
              <span className="score-label">out of {activeQuestion.maxMarks}</span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div className={`feedback-badge ${getFeedbackClass(evaluationResult.similarity * 100)}`} style={{ fontSize: '1rem', padding: '0.35rem 1rem' }}>
                {Math.round(evaluationResult.similarity * 100)}% Semantic Match
              </div>
            </div>

            <div className="feedback-card">
              <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} style={{ color: 'var(--primary)' }} />
                <span>AI Grading Feedback</span>
              </h3>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{evaluationResult.feedback}</p>
            </div>

            <div className="feedback-card" style={{ background: 'rgba(0,0,0,0.15)' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Your Answer
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{evaluationResult.studentAnswer}"
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button onClick={() => {
                setView('dashboard');
                setEvaluationResult(null);
                setActiveQuestion(null);
              }} className="btn btn-primary" style={{ minWidth: '180px' }}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>
      )}

      {/* CREATE / EDIT QUESTION DIALOG MODAL (Teacher only) */}
      {showQuestionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingQuestionId ? 'Modify Assessment Question' : 'Create Assessment Question'}</h3>
              <button onClick={() => setShowQuestionModal(false)} className="modal-close">&times;</button>
            </div>
            
            <form onSubmit={handleSaveQuestion}>
              <div className="modal-body">
                {error && (
                  <div className="error-alert">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Question Prompt</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. What is the role of an Operating System?" 
                    value={questionText} 
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ideal/Model Answer (Used by Sentence-BERT for comparison)</label>
                  <textarea 
                    className="form-input" 
                    style={{ minHeight: '120px', resize: 'vertical' }}
                    placeholder="Provide the comprehensive model answer here. Student answer semantics will be mathematically compared against this."
                    value={idealAnswer} 
                    onChange={(e) => setIdealAnswer(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Maximum Marks</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="1" 
                    max="100"
                    value={maxMarks} 
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowQuestionModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingQuestionId ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
