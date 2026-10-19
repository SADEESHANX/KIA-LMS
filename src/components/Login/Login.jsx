import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, User, Tag } from 'lucide-react';
import './Login.css';

export const Login = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  // Load users from local storage or initialize empty array
  const getUsers = () => {
    const saved = localStorage.getItem('kia_users');
    return saved ? JSON.parse(saved) : [];
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
      setError('An account with this email already exists');
      return;
    }

    const newUser = { 
      id: Date.now(), 
      name, 
      email, 
      password, 
      role,
      status: role === 'student' ? 'pending' : 'active'
    };
    localStorage.setItem('kia_users', JSON.stringify([...users, newUser]));
    
    setSuccessMsg('Registration successful! Please log in.');
    setIsLoginMode(true);
    setPassword('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      if (foundUser.status === 'pending') {
        setError('Your account is pending Admin approval. Please try again later.');
      } else if (foundUser.status === 'suspended') {
        setError('Your account has been suspended. Please contact administration.');
      } else {
        onLogin(foundUser);
      }
    } else {
      setError('Invalid email or password. Please try again or register.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-wrap">
          <div className="login-logo-shield">KIA</div>
          <div className="login-logo-text">
            <span>Kingsford</span>
            <span>International</span>
            <span>Academy</span>
          </div>
        </div>
        
        <h1 className="login-title">{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="login-subtitle">
          {isLoginMode ? 'Please enter your credentials to log in' : 'Register to access the LMS portal'}
        </p>

        {error && <div className="login-alert error">{error}</div>}
        {successMsg && <div className="login-alert success">{successMsg}</div>}
        
        <form className="login-form" onSubmit={isLoginMode ? handleLogin : handleRegister}>
          
          {!isLoginMode && (
            <div className="login-form-group">
              <label>Full Name</label>
              <div className="login-input-wrap">
                <User size={18} className="login-input-icon" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="login-form-group">
            <label>Email Address</label>
            <div className="login-input-wrap">
              <Mail size={18} className="login-input-icon" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <div className="login-input-wrap">
              <Lock size={18} className="login-input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLoginMode && (
            <div className="login-form-group">
              <label>Role</label>
              <div className="login-input-wrap">
                <Tag size={18} className="login-input-icon" />
                <select value={role} onChange={(e) => setRole(e.target.value)} className="login-select">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="login-submit-btn">
            {isLoginMode ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="login-toggle">
          {isLoginMode ? (
            <p>Don't have an account? <span onClick={() => { setIsLoginMode(false); setError(''); setSuccessMsg(''); }}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => { setIsLoginMode(true); setError(''); setSuccessMsg(''); }}>Sign In</span></p>
          )}
        </div>

      </div>
    </div>
  );
};
