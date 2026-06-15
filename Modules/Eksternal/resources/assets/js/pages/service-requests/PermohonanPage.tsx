import React from "react"
import { Card, Row, Col} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useProfileStatus } from "../../hooks/usePermohonan";
import Head from "../../components/common/Head"
import toast from 'react-hot-toast';

const services = [
  { id: "sertifikasi", name: "Sertifikasi" },
  { id: "pengujian", name: "Pengujian" },
  { id: "kalibrasi", name: "Kalibrasi" },
  { id: "konsultasi", name: "Konsultasi" },
  { id: "pelatihan", name: "Pelatihan" },
  { id: "profisiensi", name: "Uji Profisiensi" },
  { id: "bahanacuan", name: "Produsen Bahan Acuan" },
  { id: "verifikasi", name: "Verifikasi Validasi" },
  { id: "inspeksi", name: "Inspeksi" },
  { id: "halal", name: "Pemeriksaan Halal" },
  { id: "audit", name: "Audit Teknologi" },
  { id: "miniplant", name: "Miniplant" },
  { id: "sertifikasi_profesi", name: "Sertifikasi Profesi" }
]
const PermohonanPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkAndRun, isLoading } = useProfileStatus();
  const handleNavigate = (serviceId: string) => {
    // Berikan feedback jika masih loading
    if (isLoading) {
      toast("Sedang memverifikasi profil...", { icon: '⏳' });
      return;
    }
    checkAndRun(() => {
      const routes: Record<string, string> = {
        'pelatihan': "/permohonan/pelatihan",
        'sertifikasi_profesi': "/permohonan/sertifikasi-profesi",
      };
      if (routes[serviceId]) {
        navigate(routes[serviceId]);
      } else {
        toast(`Halaman ${serviceId} segera hadir!`, { icon: 'ℹ️' });
      }
    });
  };
  return (
    <div className="w-100">
      <Head title="Permohonan" />
      <Card>
        <Card.Header>
          <div className="w-100 d-flex justify-content-center align-items-center py-2">
            <Card.Title className="pt-2">
              Permohonan
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Body>
          {/* teks tetap tanpa jarak */}
          <div className="text-center mb-2">
            <p className="text-muted">
              Silakan pilih salah satu layanan yang tersedia
            </p>
          </div>
          {/* grid card */}
          <Row className="g-4">
            {services.map((service) => (
              <Col key={service.id} xs={12} sm={6} md={4} lg={3} className="d-flex">
                <Card
                  className="w-100 text-center service-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavigate(service.id)}
                >
                  <Card.Body className="service-inner d-flex align-items-center justify-content-center">
                    <h6 className="mb-0 service-title text-center px-2">
                      {service.name}
                    </h6>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
      <style>
        {`
          .service-card {
            background-color: #e5e5e5;
            border: 1px solid #d1d5db;
            border-radius: 14px;
            overflow: hidden;
            transition: all 0.25s ease;
            height: 70px;
          }
          .service-inner {
            background-color: #ffffff;
            border-left: 6px solid #0d6efd;
            height: 100%;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .service-title {
            font-weight: 500;
            color: #333;
            transition: all 0.25s ease;
          }
          .service-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            border-color: #0d6efd;
          }
          .service-card:hover .service-inner {
            background-color: #f8fbff;
          }
          .service-card:hover .service-title {
            color: #0d6efd;
            letter-spacing: 0.3px;
          }
        `}
      </style>
    </div>
  )
}
export default PermohonanPage