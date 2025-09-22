import { useState, useEffect, useMemo } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Shield, 
  HelpCircle, 
  MessageSquare, 
  Headphones, 
  Bot,
  Save,
  Edit,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Star,
  Clock,
  Award
} from "lucide-react";
import "../styles/dashboard.css";

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [userData, setUserData] = useState({
    name: "UPSC Portal Owner",
    email: "owner@upscportal.com",
    phone: "+91 98765 43210",
    role: "owner",
    joinDate: "2024-01-01",
    lastLogin: "2024-01-15",
    totalFiles: 0,
    totalCourses: 6,
    loginMethod: "email"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const authData = localStorage.getItem('upsc-portal-auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.user) {
        setUserData(prev => ({
          ...prev,
          ...parsed.user,
          lastLogin: new Date(parsed.loginTime).toLocaleDateString()
        }));
      }
    }
  }, []);

  const handleSaveProfile = () => {
    // In real app, this would update the user profile
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleAiSubmit = () => {
    if (!aiMessage.trim()) return;
    
    setIsAiLoading(true);
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with UPSC preparation strategies. What specific subject would you like guidance on?",
        "For effective study planning, I recommend creating a daily schedule with dedicated time for each subject.",
        "Mock tests are crucial for UPSC preparation. I suggest taking at least 2-3 tests per week.",
        "Current affairs are very important. I recommend reading newspapers daily and making notes.",
        "For better retention, try the active recall method and spaced repetition techniques."
      ];
      setAiResponse(responses[Math.floor(Math.random() * responses.length)]);
      setIsAiLoading(false);
    }, 1500);
  };

  const supportOptions = [
    {
      icon: <MessageSquare size={20} />,
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      action: "Start Chat",
      color: "#4CAF50"
    },
    {
      icon: <Phone size={20} />,
      title: "Phone Support",
      description: "Call us at +91 1800-123-4567",
      action: "Call Now",
      color: "#2196F3"
    },
    {
      icon: <Mail size={20} />,
      title: "Email Support",
      description: "Send us an email at support@upscportal.com",
      action: "Send Email",
      color: "#FF9800"
    },
    {
      icon: <HelpCircle size={20} />,
      title: "FAQ & Help Center",
      description: "Find answers to common questions",
      action: "Browse FAQ",
      color: "#9C27B0"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-icon">⚙️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              Settings & Support
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Manage your account and get help
            </p>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar custom-scrollbar">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
              { id: 'support', label: 'Customer Care', icon: Headphones },
              { id: 'data', label: 'Data & Privacy', icon: Lock }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 15px',
                  border: 'none',
                  borderRadius: '10px',
                  background: activeSection === item.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                  color: activeSection === item.id ? 'white' : '#666',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="content-area custom-scrollbar">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <div>
              <h2 style={{ margin: '0 0 30px 0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                Profile Settings
              </h2>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                      background: isEditing ? '#4CAF50' : 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Edit size={16} />
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: isEditing ? 'white' : '#f5f5f5',
                        color: isEditing ? '#333' : '#666'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: isEditing ? 'white' : '#f5f5f5',
                        color: isEditing ? '#333' : '#666'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        background: isEditing ? 'white' : '#f5f5f5',
                        color: isEditing ? '#333' : '#666'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                        Role
                      </label>
                      <input
                        type="text"
                        value={userData.role}
                        disabled
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e1e5e9',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: '#f5f5f5',
                          color: '#666'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                        Login Method
                      </label>
                      <input
                        type="text"
                        value={userData.loginMethod}
                        disabled
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e1e5e9',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: '#f5f5f5',
                          color: '#666'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      style={{
                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Account Stats */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  Account Statistics
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px' }}>
                    <Award size={32} color="#667eea" style={{ marginBottom: '10px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                      {userData.totalCourses}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Active Courses</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '10px' }}>
                    <Upload size={32} color="#4CAF50" style={{ marginBottom: '10px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                      {userData.totalFiles}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Uploaded Files</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '10px' }}>
                    <Clock size={32} color="#FFC107" style={{ marginBottom: '10px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                      {userData.joinDate}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Member Since</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(156, 39, 176, 0.1)', borderRadius: '10px' }}>
                    <Star size={32} color="#9C27B0" style={{ marginBottom: '10px' }} />
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                      Premium
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Account Type</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Assistant */}
          {activeSection === 'ai-assistant' && (
            <div>
              <h2 style={{ margin: '0 0 30px 0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                AI Study Assistant
              </h2>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                  }}>
                    🤖
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                      UPSC AI Assistant
                    </h3>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Get personalized study guidance and tips
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                    Ask me anything about UPSC preparation
                  </label>
                  <textarea
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    placeholder="e.g., How should I prepare for History? What's the best strategy for current affairs?"
                    style={{
                      width: '100%',
                      padding: '15px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '100px',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                  />
                </div>

                <button
                  onClick={handleAiSubmit}
                  disabled={!aiMessage.trim() || isAiLoading}
                  style={{
                    background: isAiLoading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 24px',
                    cursor: isAiLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isAiLoading ? 0.7 : 1
                  }}
                >
                  <Bot size={16} />
                  {isAiLoading ? 'Thinking...' : 'Ask AI Assistant'}
                </button>

                {aiResponse && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <Bot size={20} color="#667eea" />
                      <span style={{ color: '#667eea', fontSize: '14px', fontWeight: '600' }}>AI Response:</span>
                    </div>
                    <p style={{ margin: 0, color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
                      {aiResponse}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  Quick Study Tips
                </h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  {[
                    "📚 Create a daily study schedule with dedicated time for each subject",
                    "📰 Read newspapers daily and make current affairs notes",
                    "🧠 Use active recall and spaced repetition for better retention",
                    "📝 Take regular mock tests to assess your preparation",
                    "🎯 Focus on understanding concepts rather than rote learning",
                    "⏰ Take breaks every 45-60 minutes to maintain focus"
                  ].map((tip, index) => (
                    <div key={index} style={{
                      padding: '15px',
                      background: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(102, 126, 234, 0.1)'
                    }}>
                      <p style={{ margin: 0, color: '#333', fontSize: '14px' }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Customer Care */}
          {activeSection === 'support' && (
            <div>
              <h2 style={{ margin: '0 0 30px 0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                Customer Care & Support
              </h2>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '20px'
              }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  Get Help & Support
                </h3>
                <div style={{ display: 'grid', gap: '20px' }}>
                  {supportOptions.map((option, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '20px',
                      background: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: '10px',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: option.color,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        {option.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                          {option.title}
                        </h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                          {option.description}
                        </p>
                      </div>
                      <button style={{
                        background: option.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {option.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  Contact Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                      📞 Phone Support
                    </h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                      <strong>Helpline:</strong> +91 1800-123-4567
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      <strong>Hours:</strong> 9:00 AM - 9:00 PM (Mon-Sun)
                    </p>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                      📧 Email Support
                    </h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                      <strong>General:</strong> support@upscportal.com
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      <strong>Technical:</strong> tech@upscportal.com
                    </p>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                      🏢 Office Address
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      UPSC Portal Headquarters<br/>
                      New Delhi, India 110001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

