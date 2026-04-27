import { useEffect, useState } from 'react';
import { dosenService } from '../api';
import { Link } from 'react-router-dom';
import { User, Users, Mail, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [filteredMahasiswa, setFilteredMahasiswa] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dosenService.getPaSaya();
        const dataDosen = response.data.data;
        setData(dataDosen);
        
        // Ambil list mahasiswa dari struktur API
        const list = dataDosen.info_mahasiswa_pa?.daftar_mahasiswa || [];
        setMahasiswa(list);
        setFilteredMahasiswa(list); 
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query) => {
    const results = mahasiswa.filter(mhs => 
      mhs.nama.toLowerCase().includes(query.toLowerCase()) || 
      mhs.nim.includes(query)
    );
    setFilteredMahasiswa(results);
  };

  if (loading) return <div className="text-center mt-5">Memuat data dosen...</div>;
  if (!data) return <div className="text-center mt-5 text-danger">Gagal memuat data.</div>;

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className="container py-4">
        {/* Header Profil Dosen */}
        <div className="card shadow-sm border-0 mb-4 overflow-hidden">
          <div className="row g-0">
            {/* Pakai warna UIN (Success/Green)*/}
            <div className="col-md-1 bg-success d-flex align-items-center justify-content-center text-white">
              <User size={40} />
            </div>
            <div className="col-md-11 text-start">
              <div className="card-body">
                <h4 className="fw-bold mb-1 text-success">{data.nama}</h4>
                <p className="text-muted mb-0 d-flex align-items-center">
                  <span className="me-3">NIP: {data.nip}</span>
                  <Mail size={14} className="me-1" /> {data.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Angkatan */}
        <div className="row g-3 mb-4">
          {data.info_mahasiswa_pa?.ringkasan.map((item, idx) => (
            <div className="col-6 col-md-2" key={idx}>
              <div className="card text-center border-0 shadow-sm py-3 bg-white">
                <h6 className="text-muted mb-1 small">Angkatan {item.tahun}</h6>
                <h4 className="fw-bold mb-0 text-success">{item.total}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Daftar Mahasiswa */}
        <h5 className="fw-bold mb-3 d-flex align-items-center text-start">
          <Users size={20} className="me-2 text-success" /> 
          Daftar Mahasiswa PA
        </h5>
        <div className="row g-3">
          {filteredMahasiswa.map(mhs => (
            <div className="col-md-6 col-lg-4" key={mhs.nim}>
              <div className="card h-100 border-0 shadow-sm hover-card text-start">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0 text-truncate" style={{maxWidth: '70%'}}>{mhs.nama}</h6>
                    <span className="badge bg-light text-success border border-success px-2 py-1">Sem. {mhs.semester}</span>
                  </div>
                  <p className="small text-muted mb-3">{mhs.nim}</p>
                  
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Progres Hafalan</span>
                    <span className="fw-bold text-success">{mhs.info_setoran?.persentase_progres_setor}%</span>
                  </div>
                  <div className="progress mb-3" style={{height: '6px'}}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{width: `${mhs.info_setoran?.persentase_progres_setor}%`}}
                    ></div>
                  </div>

                  <Link to={`/mahasiswa/${mhs.nim}`} className="btn btn-success btn-sm w-100 d-flex align-items-center justify-content-center">
                    Detail Muroja'ah <ArrowRight size={16} className="ms-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;