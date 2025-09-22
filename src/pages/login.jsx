import { useState } from "react";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = onLogin(formData);
      if (!success) {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 60% 60%, rgba(255, 200, 100, 0.3) 0%, transparent 50%)
        `,
        zIndex: 1,
        animation: 'backgroundShift 20s ease-in-out infinite'
      }} />

      {/* Floating Circles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        zIndex: 1,
        animation: 'float 6s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'rgba(255, 200, 100, 0.15)',
        borderRadius: '50%',
        zIndex: 1,
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '80px',
        height: '80px',
        background: 'rgba(120, 219, 255, 0.2)',
        borderRadius: '50%',
        zIndex: 1,
        animation: 'float 7s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '30%',
        right: '20%',
        width: '120px',
        height: '120px',
        background: 'rgba(255, 119, 198, 0.15)',
        borderRadius: '50%',
        zIndex: 1,
        animation: 'float 9s ease-in-out infinite reverse'
      }} />

      {/* Animated Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '5%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(255, 119, 198, 0.3), rgba(120, 219, 255, 0.3))',
        borderRadius: '50%',
        zIndex: 1,
        animation: 'pulse 4s ease-in-out infinite',
        filter: 'blur(40px)'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: '180px',
        height: '180px',
        background: 'linear-gradient(45deg, rgba(120, 119, 198, 0.3), rgba(255, 200, 100, 0.3))',
        borderRadius: '50%',
        zIndex: 1,
        animation: 'pulse 6s ease-in-out infinite reverse',
        filter: 'blur(50px)'
      }} />

      {/* Geometric Shapes */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '60px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.1)',
        transform: 'rotate(45deg)',
        zIndex: 1,
        animation: 'rotate 10s linear infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '5%',
        width: '40px',
        height: '40px',
        background: 'rgba(255, 200, 100, 0.2)',
        transform: 'rotate(45deg)',
        zIndex: 1,
        animation: 'rotate 8s linear infinite reverse'
      }} />

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes backgroundShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes glow {
          0% { opacity: 0.5; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.02); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Login Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '25px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
        zIndex: 2,
        animation: 'cardFloat 6s ease-in-out infinite'
      }}>
        {/* Card Glow Effect */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3), rgba(240, 147, 251, 0.3))',
          borderRadius: '25px',
          zIndex: -1,
          filter: 'blur(10px)',
          animation: 'glow 3s ease-in-out infinite alternate'
        }} />
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: '#666',
            fontSize: '16px',
            margin: 0
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            color: '#ff6b6b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Mail style={{
                position: 'absolute',
                left: '12px',
                color: '#999',
                width: '20px',
                height: '20px'
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Lock style={{
                position: 'absolute',
                left: '12px',
                color: '#999',
                width: '20px',
                height: '20px'
              }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 45px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#666'
            }}>
              <input
                type="checkbox"
                style={{
                  marginRight: '8px',
                  accentColor: '#667eea'
                }}
              />
              Remember me
            </label>
            <a href="#" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            <span style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              {isLoading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </span>
            {!isLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                transition: 'left 0.5s ease',
                zIndex: 1
              }} 
              onMouseOver={(e) => {
                e.target.style.left = '100%';
              }}
              />
            )}
          </button>

          {/* Divider */}
          <div style={{
            textAlign: 'center',
            margin: '20px 0',
            position: 'relative'
          }}>
            <div style={{
              height: '1px',
              background: '#e1e5e9',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '0 15px',
                color: '#666',
                fontSize: '14px'
              }}>
                or
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'border-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.borderColor = '#db4437'}
              onMouseOut={(e) => e.target.style.borderColor = '#e1e5e9'}
            >
              <span style={{ fontSize: '18px' }}>🔍</span>
              Google
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '10px',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'border-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.borderColor = '#1877f2'}
              onMouseOut={(e) => e.target.style.borderColor = '#e1e5e9'}
            >
              <span style={{ fontSize: '18px' }}>📘</span>
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              Don't have an account?{' '}
            </span>
            <a href="#" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Sign up
            </a>
          </div>
          </form>
      </div>
    </div>
  );
}
