import { useState } from "react";
import authStorage from "../utils/authStorage";
import { sanitizeEmail, sanitizeString, sanitizeUsername, isGmail } from "../utils/sanitize";
import { User, Lock, Eye, EyeOff, BookOpen, Phone, Mail, MessageSquare } from "lucide-react";

export default function Login({ onLogin }) {
  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'phone', 'gmail'
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
    phone: "",
    otp: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'email') v = sanitizeEmail(value);
    if (name === 'username') v = sanitizeUsername(value);
    if (name === 'name') v = sanitizeString(value, 60);
    setFormData(prev => ({
      ...prev,
      [name]: v
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple localStorage-based auth for demo
    setTimeout(() => {
      if (authMethod === 'email') {
        if (isRegister) {
          if (!formData.name.trim()) {
            setError('Please enter your name');
            setIsLoading(false);
            return;
          }
          if (!formData.username.trim()) {
            setError('Please choose a username');
            setIsLoading(false);
            return;
          }
          // Require Gmail verification step before allowing registration
          const gmailVerified = isGmail(formData.email);
          if (!gmailVerified) {
            setError('Please verify with a Gmail address before creating account');
            setIsLoading(false);
            return;
          }
          const res = authStorage.createUserWithGmail({
            gmailEmail: formData.email.trim(),
            name: formData.name.trim(),
            username: formData.username.trim(),
            password: formData.password
          });
          if (!res.ok) {
            setError(res.error || 'Registration failed');
            setIsLoading(false);
            return;
          }
          authStorage.setAuthSession(res.user);
          onLogin();
        } else {
          // Login by username + password as requested
          const res = authStorage.validateLoginByUsername({ username: formData.username.trim(), password: formData.password });
          if (!res.ok) {
            setError(res.error || 'Login failed');
            setIsLoading(false);
            return;
          }
          authStorage.setAuthSession(res.user);
          onLogin();
        }
      } else if (authMethod === 'phone') {
        if (formData.phone && formData.otp) {
          const existing = authStorage.findUserByEmail(`${formData.phone}@local`);
          const user = existing || authStorage.createUser({ name: 'Phone User', email: `${formData.phone}@local`, password: 'otp' }).user;
          authStorage.setAuthSession(user);
          onLogin();
        } else {
          setError('Please enter phone number and OTP');
        }
      } else if (authMethod === 'gmail') {
        const existing = authStorage.findUserByEmail('owner@gmail.com');
        const user = existing || authStorage.createUser({ name: 'Gmail User', email: 'owner@gmail.com', password: 'oauth' }).user;
        authStorage.setAuthSession(user);
        onLogin();
      }
      setIsLoading(false);
    }, 600);
  };

  const handleSendOTP = () => {
    if (!formData.phone) {
      setError("Please enter your phone number");
      return;
    }
    
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      setError("");
      alert(`OTP sent to ${formData.phone}`);
    }, 1000);
  };

  const handleGmailLogin = () => {
    setIsLoading(true);
    // Simulate Gmail OAuth
    setTimeout(() => {
      localStorage.setItem('upsc-portal-auth', JSON.stringify({
        isAuthenticated: true,
        user: {
          email: "owner@gmail.com",
          name: "UPSC Portal Owner",
          role: "owner",
          loginMethod: "gmail"
        },
        loginTime: new Date().toISOString()
      }));
      
      onLogin();
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            margin: '0 auto 20px auto'
          }}>
            📚
          </div>
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            UPSC Portal
          </h1>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '16px'
          }}>
            Welcome back, Owner
          </p>
        </div>

        {/* Authentication Method Selection */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              style={{
                flex: 1,
                padding: '10px',
                border: '2px solid',
                borderColor: authMethod === 'email' ? '#667eea' : '#e1e5e9',
                borderRadius: '8px',
                background: authMethod === 'email' ? 'rgba(102, 126, 234, 0.1)' : 'white',
                color: authMethod === 'email' ? '#667eea' : '#666',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.3s ease'
              }}
            >
              <Mail size={16} />
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              style={{
                flex: 1,
                padding: '10px',
                border: '2px solid',
                borderColor: authMethod === 'phone' ? '#667eea' : '#e1e5e9',
                borderRadius: '8px',
                background: authMethod === 'phone' ? 'rgba(102, 126, 234, 0.1)' : 'white',
                color: authMethod === 'phone' ? '#667eea' : '#666',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.3s ease'
              }}
            >
              <Phone size={16} />
              Phone
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('gmail')}
              style={{
                flex: 1,
                padding: '10px',
                border: '2px solid',
                borderColor: authMethod === 'gmail' ? '#667eea' : '#e1e5e9',
                borderRadius: '8px',
                background: authMethod === 'gmail' ? 'rgba(102, 126, 234, 0.1)' : 'white',
                color: authMethod === 'gmail' ? '#667eea' : '#666',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                transition: 'all 0.3s ease'
              }}
            >
              <MessageSquare size={16} />
              Gmail
            </button>
          </div>
        </div>

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit}>
          {authMethod === 'email' && isRegister && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                required
              />
            </div>
          )}

          {authMethod === 'email' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={isRegister ? 'Choose a username' : 'Enter your username'}
                style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                required
              />
            </div>
          )}
          {authMethod === 'email' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Gmail Address (for verification)
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                    width: '20px',
                    height: '20px'
                  }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={isRegister ? 'Enter your Gmail for verification' : 'Enter your Gmail'}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 45px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                    width: '20px',
                    height: '20px'
                  }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '12px 45px 12px 45px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#999',
                      padding: '0'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {authMethod === 'phone' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                    width: '20px',
                    height: '20px'
                  }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 45px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    required
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    background: isLoading ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginBottom: '20px',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              ) : (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit OTP"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      letterSpacing: '2px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    required
                  />
                </div>
              )}
            </>
          )}

          {authMethod === 'gmail' && (
            <div style={{ marginBottom: '20px' }}>
              <button
                type="button"
                onClick={handleGmailLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: isLoading ? '#ccc' : 'linear-gradient(135deg, #db4437, #c23321)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '15px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                <Mail size={20} />
                {isLoading ? 'Signing in...' : 'Continue with Gmail'}
              </button>
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(255, 107, 107, 0.1)',
              color: '#ff6b6b',
              padding: '10px 15px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 107, 107, 0.2)'
            }}>
              {error}
            </div>
          )}

          {authMethod !== 'gmail' && (
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s ease',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isLoading) e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                if (!isLoading) e.target.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  {authMethod === 'phone' && otpSent ? 'Verifying OTP...' : (isRegister ? 'Creating account...' : 'Signing In...')}
                </div>
              ) : (
                authMethod === 'phone' && otpSent ? 'Verify OTP' : (isRegister ? 'Create Account' : 'Sign In to Dashboard')
              )}
            </button>
          )}
        </form>

        {/* Toggle Register/Login for email method */}
        {authMethod === 'email' && (
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '12px' }}>
            <span>{isRegister ? 'Already have an account?' : "Don't have an account?"} </span>
            <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', fontWeight: 600 }}>
              {isRegister ? 'Sign In' : 'Create one'}
            </button>
          </div>
        )}

        {/* Demo Credentials */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <p style={{
            margin: '0 0 10px 0',
            color: '#667eea',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Demo Credentials:
          </p>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
            Email: owner@upscportal.com
          </p>
          <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
            Password: admin123
          </p>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

