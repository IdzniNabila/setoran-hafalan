import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dosenService } from '../api';
import { ArrowLeft, History, BookOpen, Trash2, Send } from 'lucide-react';

const DetailMahasiswa = () => {
  const { nim } = useParams();
  const navigate = useNavigate();
  
  // State untuk data dan UI
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fungsi ambil data dari API
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await dosenService.getDetailMahasiswa(nim);
      setDetail(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      alert("Gagal mengambil data mahasiswa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nim]);

  // Fungsi UNTUK SIMPAN/VALIDASI (Endpoint POST)
  const handleSimpan = async (surah) => {
    if (!window.confirm(`Validasi setoran surah ${surah.nama}?`)) return;
    
    setProcessing(true);
    try {
      const dataSetoran = [{
        nama_komponen_setoran: surah.nama,
        id_komponen_setoran: surah.id
      }];
      const res = await dosenService.simpanSetoran(nim, dataSetoran);
      alert(res.data.message || "Berhasil validasi!");
      fetchDetail(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan setoran.");
    } finally {
      setProcessing(false);
    }
  };

  // Fungsi UNTUK BATAL/HAPUS (Endpoint DELETE)
  const handleBatal = async (surah) => {
    if (!window.confirm(`Batalkan validasi surah ${surah.nama}?`)) return;

    setProcessing(true);
    try {
      // Cari ID log setoran untuk surah ini (dari data API)
      const dataBatal = [{
        id: surah.info_setoran.id, // ID transaksi setoran
        id_komponen_setoran: surah.id,
        nama_komponen_setoran: surah.nama
      }];
      
      const res = await dosenService.deleteSetoran(nim, dataBatal);
      alert(res.data.message || "Validasi dibatalkan.");
      fetchDetail(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Memuat data...</div>;
  if (!detail) return <div className="text-center mt-5">Data tidak ditemukan.</div>;

  return (
    <div className="container py-4">
      {/* Header navigasi */}
      <button onClick={() => navigate('/dashboard')} className="btn btn-link text-decoration-none p-0 mb-4 d-flex align-items-center">
        <ArrowLeft size={18} className="me-1" /> Kembali ke Dashboard
      </button>

      <div className="row g-4">
        {/* Info Mahasiswa & Log */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center">
              <div className="bg-soft-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: '70px', height: '70px'}}>
                <span className="h3 mb-0 text-primary">{detail.info.nama.charAt(0)}</span>
              </div>
              <h5 className="fw-bold mb-1">{detail.info.nama}</h5>
              <p className="text-muted small mb-3">{detail.info.nim}</p>
              
              <div className="bg-light rounded p-3">
                <div className="row">
                  <div className="col-6 border-end">
                    <small className="text-muted d-block">Sudah</small>
                    <span className="fw-bold text-success">{detail.setoran.info_dasar.total_sudah_setor}</span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Belum</small>
                    <span className="fw-bold text-danger">{detail.setoran.info_dasar.total_belum_setor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Log Aktivitas Terakhir */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold py-3">
              <History size={18} className="me-2 text-primary" /> Riwayat Terakhir
            </div>
            <div className="card-body p-0" style={{maxHeight: '400px', overflowY: 'auto'}}>
              {detail.setoran.log.map(log => (
                <div className="p-3 border-bottom small" key={log.id}>
                  <div className="d-flex justify-content-between">
                    <span className={`badge ${log.aksi === 'VALIDASI' ? 'bg-success' : 'bg-danger'} mb-1`}>
                      {log.aksi}
                    </span>
                    <span className="text-muted">{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="mb-0 mt-1">{log.keterangan}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daftar Surah */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold py-3 d-flex justify-content-between align-items-center">
              <span><BookOpen size={18} className="me-2 text-primary" /> Daftar Surah</span>
              {processing && <span className="badge bg-warning text-dark small">Memproses...</span>}
            </div>
            <div className="list-group list-group-flush">
              {detail.setoran.detail.map((surah) => (
                <div className="list-group-item d-flex justify-content-between align-items-center px-4 py-3 hover-card-item" key={surah.id}>
                  <div>
                    <h6 className="fw-bold mb-0">{surah.nama} • {detail.info.nama}</h6>
                    <small className="text-muted">{surah.nama_arab} • {surah.label}</small>
                  </div>
                  
                  <div className="text-end">
                    {surah.sudah_setor ? (
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <small className="text-success d-block fw-bold">Valid</small>
                          <small className="text-muted" style={{fontSize: '10px'}}>{surah.info_setoran.tgl_validasi}</small>
                        </div>
                        <button 
                          className="btn btn-outline-danger btn-sm border-0" 
                          onClick={() => handleBatal(surah)}
                          disabled={processing}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center"
                        onClick={() => handleSimpan(surah)}
                        disabled={processing}
                      >
                        <Send size={14} className="me-1" /> Validasi
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMahasiswa;