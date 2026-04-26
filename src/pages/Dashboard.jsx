import React, { useEffect, useState } from 'react';
import { dosenService } from '../api';
import { Link } from 'react-router-dom';
import { User, Users, Mail, ArrowRight, GraduationCap } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dosenService.getPaSaya()
      .then(res => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Memuat data dosen...</div>;
  if (!data) return <div className="text-center mt-5 text-danger">Gagal memuat data.</div>;

  return (
    <div className="container py-4">
      {/* Header Profil Dosen */}
      <div className="card shadow-sm border-0 mb-4 overflow-hidden">
        <div className="row g-0">
          <div className="col-md-1 bg-primary d-flex align-items-center justify-content-center text-white">
            <User size={40} />
          </div>
          <div className="col-md-11">
            <div className="card-body">
              <h4 className="fw-bold mb-1">{data.nama}</h4>
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
        {data.info_mahasiswa_pa.ringkasan.map((item, idx) => (
          <div className="col-6 col-md-2" key={idx}>
            <div className="card text-center border-0 shadow-sm py-3 bg-white">
              <h6 className="text-muted mb-1 small">Angkatan {item.tahun}</h6>
              <h4 className="fw-bold mb-0 text-primary">{item.total}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Daftar Mahasiswa */}
      <h5 className="fw-bold mb-3 d-flex align-items-center">
        <Users size={20} className="me-2 text-primary" /> 
        Daftar Mahasiswa PA
      </h5>
      <div className="row g-3">
        {data.info_mahasiswa_pa.daftar_mahasiswa.map(mhs => (
          <div className="col-md-6 col-lg-4" key={mhs.nim}>
            <div className="card h-100 border-0 shadow-sm hover-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0 text-truncate" style={{maxWidth: '70%'}}>{mhs.nama}</h6>
                  <span className="badge bg-soft-primary text-primary px-2 py-1">Sem. {mhs.semester}</span>
                </div>
                <p className="small text-muted mb-3">{mhs.nim}</p>
                
                <div className="d-flex justify-content-between small mb-1">
                  <span>Progres Hafalan</span>
                  <span className="fw-bold">{mhs.info_setoran.persentase_progres_setor}%</span>
                </div>
                <div className="progress mb-3" style={{height: '6px'}}>
                  <div 
                    className="progress-bar" 
                    style={{width: `${mhs.info_setoran.persentase_progres_setor}%`}}
                  ></div>
                </div>

                <Link to={`/mahasiswa/${mhs.nim}`} className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center">
                  Detail Muroja'ah <ArrowRight size={16} className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;