import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  FileText, 
  Upload, 
  Download, 
  Folder, 
  Search, 
  User, 
  LogOut, 
  Calendar,
  Clock,
  Star,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Edit3,
  Move,
  RefreshCw
} from "lucide-react";
import fileStorage from "../utils/fileStorage";
import "../styles/dashboard.css";

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseUploadModal, setShowCourseUploadModal] = useState(false);

  // Load files and folders on component mount
  useEffect(() => {
    loadFiles();
    loadFolders();
  }, []);

  // Load files from storage
  const loadFiles = () => {
    const allFiles = fileStorage.getAllFiles();
    setFiles(allFiles);
  };

  // Load folders from storage
  const loadFolders = () => {
    const allFolders = fileStorage.getFolders();
    setFolders(['All', ...allFolders]);
  };

  // Mock data for courses - UPSC Core Subjects (Owner's Courses)
  const courses = useMemo(() => [
    {
      id: 1,
      title: "Art & Culture",
      instructor: "You (Owner)",
      duration: "4 months",
      students: 1200,
      rating: 4.8,
      price: "FREE",
      status: "Active",
      progress: 70,
      thumbnail: "🎨",
      description: "Comprehensive coverage of Indian art, architecture, literature, music, dance, and cultural heritage",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 2,
      title: "Economics",
      instructor: "You (Owner)",
      duration: "5 months",
      students: 1350,
      rating: 4.9,
      price: "FREE",
      status: "Active",
      progress: 45,
      thumbnail: "💰",
      description: "Indian economy, economic planning, budget, banking, and international economics",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 3,
      title: "Geography",
      instructor: "You (Owner)",
      duration: "4 months",
      students: 1100,
      rating: 4.7,
      price: "FREE",
      status: "Active",
      progress: 60,
      thumbnail: "🌍",
      description: "Physical geography, human geography, Indian geography, and environmental issues",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 4,
      title: "History",
      instructor: "You (Owner)",
      duration: "6 months",
      students: 1500,
      rating: 4.8,
      price: "FREE",
      status: "Active",
      progress: 55,
      thumbnail: "🏺",
      description: "Ancient, medieval, and modern Indian history with world history",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 5,
      title: "Polity",
      instructor: "You (Owner)",
      duration: "3 months",
      students: 1400,
      rating: 4.9,
      price: "FREE",
      status: "Active",
      progress: 80,
      thumbnail: "🏛️",
      description: "Indian Constitution, governance, political system, and current affairs",
      isOwner: true,
      fileCount: 0
    },
    {
      id: 6,
      title: "Science & Technology",
      instructor: "You (Owner)",
      duration: "4 months",
      students: 950,
      rating: 4.6,
      price: "FREE",
      status: "Active",
      progress: 30,
      thumbnail: "🔬",
      description: "Physics, chemistry, biology, space technology, and recent scientific developments",
      isOwner: true,
      fileCount: 0
    }
  ], []);

  // UPSC Subject folders
  const upscFolders = useMemo(() => ["Art & Culture", "Economics", "Geography", "History", "Polity", "Science & Technology", "Current Affairs", "Mock Tests", "Previous Year Papers"], []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF file only. Other file types are not supported.');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size should be less than 50MB. Please select a smaller file.');
        return;
      }
      
      setSelectedFile(file);
      console.log("PDF file selected:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2) + "MB");
    }
  }, []);

  // Handle file upload with progress
  const handleUploadFile = async (folder = 'General') => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Add file to storage
      const fileData = fileStorage.addFile(selectedFile, folder);
      
      // Complete upload
      setTimeout(() => {
        setUploadProgress(100);
        clearInterval(progressInterval);
        
        // Refresh files and folders
        loadFiles();
        loadFolders();
        
        // Reset states
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setShowUploadModal(false);
        
        console.log("File uploaded successfully:", fileData.name);
      }, 500);

    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle course-specific file upload
  const handleCourseFileUpload = async (courseTitle) => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Add file to storage with course name as folder
      const fileData = fileStorage.addFile(selectedFile, courseTitle);
      
      // Complete upload
      setTimeout(() => {
        setUploadProgress(100);
        clearInterval(progressInterval);
        
        // Refresh files and folders
        loadFiles();
        loadFolders();
        
        // Reset states
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setShowCourseUploadModal(false);
        setSelectedCourse(null);
        
        console.log(`File uploaded successfully to ${courseTitle}:`, fileData.name);
      }, 500);

    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle file download
  const handleDownloadFile = (fileId) => {
    const file = fileStorage.getFileById(fileId);
    if (file && file.file) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Handle file delete
  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const success = fileStorage.deleteFile(fileId);
      if (success) {
        loadFiles();
        loadFolders();
        console.log("File deleted successfully");
      }
    }
  };

  // Handle file rename
  const handleRenameFile = (fileId, newName) => {
    const success = fileStorage.renameFile(fileId, newName);
    if (success) {
      loadFiles();
      console.log("File renamed successfully");
    }
  };

  // Handle file move
  const handleMoveFile = (fileId, newFolder) => {
    const success = fileStorage.moveFile(fileId, newFolder);
    if (success) {
      loadFiles();
      console.log("File moved successfully");
    }
  };

  // Filter files based on search and folder
  const filteredFiles = useMemo(() => {
    let result = files;

    // Filter by folder
    if (selectedFolder !== 'All') {
      result = result.filter(file => file.folder === selectedFolder);
    }

    // Filter by search term
    if (searchTerm) {
      result = fileStorage.searchFiles(searchTerm);
      if (selectedFolder !== 'All') {
        result = result.filter(file => file.folder === selectedFolder);
      }
    }

    return result;
  }, [files, selectedFolder, searchTerm]);

  // Get course-specific files
  const getCourseFiles = useCallback((courseTitle) => {
    return files.filter(file => file.folder === courseTitle);
  }, [files]);

  const handleLogout = () => {
    console.log("Logging out...");
    if (onLogout) {
      onLogout();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show scroll to top button when scrolled down and calculate scroll progress
  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight - e.target.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    setShowScrollTop(scrollTop > 300);
    setScrollProgress(progress);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Custom Scrollbar for Webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8, #6a4190);
        }
        
        ::-webkit-scrollbar-corner {
          background: rgba(255, 255, 255, 0.1);
        }
        
        /* Custom Scrollbar for Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #667eea rgba(255, 255, 255, 0.1);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        body {
          scroll-behavior: smooth;
        }
        
        /* Enhanced scrollbar for better visibility */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin: 5px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8, #6a4190);
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
        }
        
        /* Scrollbar animation */
        .custom-scrollbar::-webkit-scrollbar-thumb {
          transition: all 0.3s ease;
        }
        
        /* Bounce animation for scroll to top button */
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        /* Custom scrollbar for specific containers */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #667eea rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8, #6a4190);
        }
      `}</style>
      {/* Header */}
      <div className="header-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            📚
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              UPSC Portal
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Your Complete Preparation Hub
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="text"
              placeholder="Search courses, files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 10px 10px 40px',
                border: '2px solid #e1e5e9',
                borderRadius: '25px',
                width: '300px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          {/* User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer'
            }}>
              <User size={20} />
            </div>
            <button
              onClick={() => navigate('/settings')}
              style={{
                background: 'none',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                padding: '8px 15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#666',
                transition: 'all 0.3s ease',
                marginRight: '10px'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.color = '#667eea';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.color = '#666';
              }}
            >
              <Settings size={16} />
              Settings
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                padding: '8px 15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#666',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#ff4757';
                e.target.style.color = '#ff4757';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.color = '#666';
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar custom-scrollbar">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'courses', label: 'My Courses', icon: BookOpen },
              { id: 'files', label: 'File Manager', icon: Folder },
              { id: 'progress', label: 'Progress', icon: BarChart3 },
              { id: 'calendar', label: 'Schedule', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 15px',
                  border: 'none',
                  borderRadius: '10px',
                  background: activeTab === item.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                  color: activeTab === item.id ? 'white' : '#666',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Quick Stats */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(102, 126, 234, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Courses:</span>
                <span style={{ fontWeight: 'bold', color: '#333' }}>6</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Files:</span>
                <span style={{ fontWeight: 'bold', color: '#333' }}>{files.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Progress:</span>
                <span style={{ fontWeight: 'bold', color: '#333' }}>52%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div 
          className="content-area custom-scrollbar"
          onScroll={handleScroll}
        >
          {/* Scroll Progress Indicator */}
          <div style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '0 0 3px 3px',
            zIndex: 100,
            marginBottom: '20px'
          }}>
            <div style={{
              height: '100%',
              width: `${scrollProgress}%`,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '0 0 3px 3px',
              transition: 'width 0.1s ease'
            }} />
          </div>
          
          {activeTab === 'courses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                  My Courses
                </h2>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <Plus size={16} />
                  Add Course
                </button>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                gap: '20px',
                maxHeight: '70vh',
                overflowY: 'auto',
                paddingRight: '10px'
              }} className="custom-scrollbar">
                {courses.map(course => (
                  <div
                    key={course.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      padding: '25px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-5px)';
                      e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px'
                      }}>
                        {course.thumbnail}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                          {course.title}
                        </h3>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                          by {course.instructor}
                        </p>
                        <p style={{ 
                          margin: 0, 
                          color: '#888', 
                          fontSize: '12px', 
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} color="#666" />
                          <span style={{ color: '#666', fontSize: '12px' }}>{course.duration}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <User size={14} color="#666" />
                          <span style={{ color: '#666', fontSize: '12px' }}>{course.students}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Star size={14} color="#ffa500" />
                          <span style={{ color: '#666', fontSize: '12px' }}>{course.rating}</span>
                        </div>
                      </div>
                      <span style={{
                        background: course.price === 'FREE' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {course.price}
                      </span>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ color: '#666', fontSize: '12px' }}>Progress</span>
                        <span style={{ color: '#333', fontSize: '12px', fontWeight: '600' }}>{course.progress}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: '#e1e5e9',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${course.progress}%`,
                          height: '100%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {course.isOwner ? (
                        <>
                          <button 
                            onClick={() => navigate(`/course/${course.id}`)}
                            style={{
                              flex: 1,
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              transition: 'transform 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            <Eye size={16} />
                            View Course
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowCourseUploadModal(true);
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              transition: 'transform 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            <Upload size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'transform 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            Continue
                          </button>
                          <button style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '8px',
                            padding: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                          }}
                          >
                            <Eye size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                  File Manager
                </h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <Upload size={16} />
                    Upload File
                  </button>
                </div>
              </div>

              {/* Folder Navigation */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                {folders.map(folder => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    style={{
                      background: selectedFolder === folder ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'rgba(102, 126, 234, 0.1)',
                      color: selectedFolder === folder ? 'white' : '#667eea',
                      border: selectedFolder === folder ? 'none' : '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      if (selectedFolder !== folder) {
                        e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedFolder !== folder) {
                        e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <Folder size={14} />
                    {folder}
                    {folder !== 'All' && (
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        padding: '2px 6px',
                        fontSize: '12px',
                        marginLeft: '5px'
                      }}>
                        {files.filter(f => f.folder === folder).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Files Grid */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxHeight: '60vh',
                overflowY: 'auto'
              }} className="custom-scrollbar">
                <div style={{ display: 'grid', gap: '15px' }}>
                  {filteredFiles.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: '#666'
                    }}>
                      <Folder size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                      <p style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>
                        No files found
                      </p>
                      <p style={{ margin: 0, fontSize: '14px' }}>
                        {selectedFolder === 'All' ? 'Upload your first file to get started' : `No files in ${selectedFolder} folder`}
                      </p>
                    </div>
                  ) : (
                    filteredFiles.map(file => (
                    <div
                      key={file.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        padding: '15px',
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.target.style.transform = 'translateX(5px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.05)';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px'
                      }}>
                        {fileStorage.getFileIcon(file.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                          {file.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '12px' }}>
                          <span>Type: {file.type}</span>
                          <span>Size: {file.size}</span>
                          <span>Folder: {file.folder}</span>
                          <span>Uploaded: {file.uploaded}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleDownloadFile(file.id)}
                          style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                          }}
                          title="Download file"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setCurrentFile(file);
                            setShowFileModal(true);
                          }}
                          style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                          }}
                          title="View file details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteFile(file.id)}
                          style={{
                            background: 'rgba(255, 107, 107, 0.1)',
                            color: '#ff6b6b',
                            border: '1px solid rgba(255, 107, 107, 0.3)',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'rgba(255, 107, 107, 0.2)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'rgba(255, 107, 107, 0.1)';
                          }}
                          title="Delete file"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div>
              <h2 style={{ margin: '0 0 30px 0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                Your Progress
              </h2>
              
              {/* Overall Progress */}
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
                  Overall Progress
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'conic-gradient(#667eea 0deg 187deg, #e1e5e9 187deg 360deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#333'
                    }}>
                      52%
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '16px' }}>
                      You've completed 52% of your UPSC preparation journey!
                    </p>
                    <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
                      Keep up the great work and stay consistent with your studies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject-wise Progress */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  Subject-wise Progress
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gap: '15px',
                  maxHeight: '50vh',
                  overflowY: 'auto',
                  paddingRight: '10px'
                }} className="custom-scrollbar">
                  {courses.map(course => (
                    <div key={course.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      background: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: '10px',
                      border: '1px solid rgba(102, 126, 234, 0.1)'
                    }}>
                      <div style={{ fontSize: '24px' }}>{course.thumbnail}</div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>
                          {course.title}
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{
                            width: '200px',
                            height: '6px',
                            background: '#e1e5e9',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${course.progress}%`,
                              height: '100%',
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                          <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <h2 style={{ margin: '0 0 30px 0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                Study Schedule
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ color: '#666', fontSize: '16px', textAlign: 'center' }}>
                  Calendar and scheduling features will be implemented here.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 style={{ margin: '0 0 30px 0', fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                Settings
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <p style={{ color: '#666', fontSize: '16px', textAlign: 'center' }}>
                  User settings and preferences will be implemented here.
                </p>
              </div>
            </div>
          )}
          
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                zIndex: 1000,
                transition: 'all 0.3s ease',
                animation: 'bounce 2s infinite'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
              }}
            >
              ↑
            </button>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              Upload PDF Study Material
            </h3>
            <div style={{
              border: '2px dashed #e1e5e9',
              borderRadius: '10px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📚</div>
              <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>
                Upload PDF Study Materials
              </p>
              <p style={{ color: '#888', margin: '0 0 15px 0', fontSize: '14px' }}>
                Drag and drop PDF files here or click to browse<br/>
                <span style={{ color: '#667eea', fontSize: '12px' }}>Maximum file size: 50MB</span>
              </p>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
                accept=".pdf,application/pdf"
              />
              <label
                htmlFor="file-upload"
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'inline-block',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Choose PDF Files
              </label>
            </div>

            {/* Subject Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Select UPSC Subject
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              >
                {upscFolders.map(folder => (
                  <option key={folder} value={folder}>
                    {folder === 'All' ? '📁 All Subjects' : 
                     folder === 'Art & Culture' ? '🎨 Art & Culture' :
                     folder === 'Economics' ? '💰 Economics' :
                     folder === 'Geography' ? '🌍 Geography' :
                     folder === 'History' ? '🏺 History' :
                     folder === 'Polity' ? '🏛️ Polity' :
                     folder === 'Science & Technology' ? '🔬 Science & Technology' :
                     folder === 'Current Affairs' ? '📰 Current Affairs' :
                     folder === 'Mock Tests' ? '📝 Mock Tests' :
                     folder === 'Previous Year Papers' ? '📋 Previous Year Papers' :
                     folder}
                  </option>
                ))}
              </select>
            </div>
            {selectedFile && (
              <div style={{
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '20px' }}>📄</div>
                  <div>
                    <p style={{ margin: 0, color: '#333', fontSize: '14px', fontWeight: '600' }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Type: PDF
                    </p>
                  </div>
                </div>
                <div style={{ 
                  background: 'rgba(102, 126, 234, 0.05)', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#667eea'
                }}>
                  ✓ Ready to upload to {selectedFolder} folder
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUploadModal(false)}
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
                onClick={() => handleUploadFile(selectedFolder)}
                disabled={!selectedFile || isUploading}
                style={{
                  background: isUploading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: isUploading ? 0.7 : 1
                }}
              >
                {isUploading ? `Uploading PDF... ${uploadProgress}%` : 'Upload PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {showFileModal && currentFile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              File Details
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {fileStorage.getFileIcon(currentFile.type)}
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600', color: '#333' }}>
                  {currentFile.name}
                </h4>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  {currentFile.type} • {currentFile.size}
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(102, 126, 234, 0.05)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#666' }}>Folder:</span>
                  <span style={{ color: '#333', fontWeight: '500', marginLeft: '8px' }}>{currentFile.folder}</span>
                </div>
                <div>
                  <span style={{ color: '#666' }}>Uploaded:</span>
                  <span style={{ color: '#333', fontWeight: '500', marginLeft: '8px' }}>{currentFile.uploaded}</span>
                </div>
                <div>
                  <span style={{ color: '#666' }}>Type:</span>
                  <span style={{ color: '#333', fontWeight: '500', marginLeft: '8px' }}>{currentFile.type}</span>
                </div>
                <div>
                  <span style={{ color: '#666' }}>Size:</span>
                  <span style={{ color: '#333', fontWeight: '500', marginLeft: '8px' }}>{currentFile.size}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowFileModal(false)}
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
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadFile(currentFile.id);
                  setShowFileModal(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Upload Modal */}
      {showCourseUploadModal && selectedCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              Upload to {selectedCourse.title}
            </h3>
            <div style={{
              border: '2px dashed #e1e5e9',
              borderRadius: '10px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>{selectedCourse.thumbnail}</div>
              <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>
                Upload PDF Study Material
              </p>
              <p style={{ color: '#888', margin: '0 0 15px 0', fontSize: '14px' }}>
                Add study materials to your {selectedCourse.title} course<br/>
                <span style={{ color: '#667eea', fontSize: '12px' }}>Maximum file size: 50MB</span>
              </p>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="course-file-upload"
                accept=".pdf,application/pdf"
              />
              <label
                htmlFor="course-file-upload"
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'inline-block',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Choose PDF Files
              </label>
            </div>

            {selectedFile && (
              <div style={{
                background: 'rgba(76, 175, 80, 0.1)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid rgba(76, 175, 80, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '20px' }}>📄</div>
                  <div>
                    <p style={{ margin: 0, color: '#333', fontSize: '14px', fontWeight: '600' }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Type: PDF
                    </p>
                  </div>
                </div>
                <div style={{ 
                  background: 'rgba(76, 175, 80, 0.05)', 
                  padding: '8px 12px', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#4CAF50'
                }}>
                  ✓ Ready to upload to {selectedCourse.title} course
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowCourseUploadModal(false);
                  setSelectedCourse(null);
                  setSelectedFile(null);
                }}
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
                onClick={() => handleCourseFileUpload(selectedCourse.title)}
                disabled={!selectedFile || isUploading}
                style={{
                  background: isUploading ? '#ccc' : 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: isUploading ? 0.7 : 1
                }}
              >
                {isUploading ? `Uploading to ${selectedCourse.title}... ${uploadProgress}%` : `Upload to ${selectedCourse.title}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
