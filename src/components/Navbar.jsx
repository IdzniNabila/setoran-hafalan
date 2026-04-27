import 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Search, GraduationCap } from 'lucide-react';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow" style={{ backgroundColor: '#004d29', borderBottom: '3px solid #f8c301' }}>
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center fw-bold text-white" to="/dashboard">
          <GraduationCap className="me-2 text-warning" size={24} />
          <span style={{ letterSpacing: '1px' }}>HafalanTIF</span>
        </Link>

        {/* Kolom Search yang lebih kontras */}
        <div className="flex-grow-1 mx-4 d-none d-md-block">
          <div className="position-relative">
            <input
              type="text"
              className="form-control border-0 shadow-none text-white px-5"
              placeholder="Cari Nama atau NIM..."
              onChange={(e) => onSearch(e.target.value)}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                borderRadius: '20px',
                height: '38px'
              }}
            />
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-white-50" size={16} />
          </div>
        </div>

        {/* Tombol Logout */}
        <button 
          onClick={handleLogout}
          className="btn btn-warning btn-sm fw-bold px-3 rounded-pill d-flex align-items-center"
          style={{ fontSize: '0.8rem' }}
        >
          <LogOut size={14} className="me-1" /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;