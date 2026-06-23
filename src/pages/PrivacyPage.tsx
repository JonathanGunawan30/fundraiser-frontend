import React from 'react';
import { Typography, Card, Tag, Breadcrumb, Divider } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const PrivacyPage: React.FC = () => {
    return (
        <div style={{ background: '#f8fafc', padding: '60px 5% 100px' }}>
            <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <Breadcrumb style={{ marginBottom: '24px' }}>
                    <Breadcrumb.Item><Link to="/">Beranda</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>Kebijakan Privasi</Breadcrumb.Item>
                </Breadcrumb>

                {/* Hero Header */}
                <div style={{ marginBottom: '40px' }}>
                    <Tag color="green" style={{ borderRadius: '30px', padding: '4px 16px', fontWeight: 600, marginBottom: '16px' }}>
                        PRIVASI & KEAMANAN
                    </Tag>
                    <Title level={1} style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
                        Kebijakan Privasi Pengguna
                    </Title>
                    <Text type="secondary" style={{ fontSize: '0.95rem' }}>Terakhir diperbarui: 23 Juni 2026</Text>
                </div>

                {/* Content Card */}
                <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: '48px' }}>
                    <Paragraph style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7 }}>
                        Kebijakan Privasi ini menjelaskan bagaimana <strong>FundRaiser</strong> mengumpulkan, mencatat, menyimpan, mengolah, dan menggunakan data pribadi Anda ketika Anda mengakses Platform, mendaftar akun, berdonasi, atau berkomunikasi dengan kami. Kami sangat berkomitmen untuk melindungi informasi pribadi Anda dan menjaga kepercayaan yang telah Anda berikan kepada kami.
                    </Paragraph>

                    <Divider style={{ margin: '32px 0' }} />

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>1. Informasi yang Kami Kumpulkan</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Kami mengumpulkan informasi pribadi yang Anda berikan secara langsung saat berinteraksi dengan Platform kami, termasuk namun tidak terbatas pada:
                    </Paragraph>
                    <ul style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px' }}>
                        <li><strong>Informasi Profil Akun:</strong> Nama lengkap, alamat email, nomor telepon, foto profil, dan kata sandi yang dienkripsi ketika Anda mendaftar di Platform kami.</li>
                        <li><strong>Informasi Donasi:</strong> Jumlah donasi, metode pembayaran, tanggal transaksi, nama donatur (termasuk status donatur anonim), serta pesan dukungan yang diberikan.</li>
                        <li><strong>Informasi Verifikasi Penggalang Dana:</strong> Salinan Kartu Tanda Penduduk (KTP), foto wajah (selfie), dokumen izin medis resmi, nomor rekening bank, serta dokumen organisasi legal lainnya guna menjamin kepatuhan hukum (Know Your Customer/KYC).</li>
                    </ul>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>2. Penggunaan Informasi Pribadi</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Data pribadi yang kami kumpulkan digunakan untuk tujuan-tujuan profesional berikut:
                    </Paragraph>
                    <ul style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px' }}>
                        <li>Memproses transaksi donasi dan menyalurkan dana kepada Penggalang Dana yang berhak secara aman.</li>
                        <li>Memverifikasi identitas Penggalang Dana guna mencegah tindak pidana pencucian uang, pendanaan terorisme, dan penipuan online.</li>
                        <li>Mengirimkan email konfirmasi transaksi, kuitansi donasi, laporan perkembangan kampanye terbaru dari Campaigner, serta notifikasi administratif penting lainnya terkait akun Anda.</li>
                        <li>Meningkatkan kualitas layanan Platform, mendeteksi gangguan keamanan sistem, serta menganalisis tren demografi donasi secara agregat tanpa mengidentifikasi informasi sensitif personal Anda.</li>
                    </ul>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>3. Pengungkapan Informasi Kepada Pihak Ketiga</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Kami tidak akan menjual, menyewakan, membagikan, atau menyebarluaskan data pribadi Anda kepada pihak ketiga mana pun tanpa persetujuan Anda, kecuali dalam situasi-situasi khusus berikut:
                    </Paragraph>
                    <ul style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px' }}>
                        <li><strong>Mitra Layanan Pembayaran:</strong> Kami membagikan data transaksi kepada gerbang pembayaran (payment gateway) berlisensi resmi untuk tujuan kliring pembayaran donasi Anda.</li>
                        <li><strong>Kewajiban Hukum:</strong> Kami berhak mengungkapkan informasi pribadi Anda kepada instansi pemerintah, penegak hukum, atau lembaga peradilan apabila diwajibkan oleh undang-undang atau perintah pengadilan yang sah di Republik Indonesia.</li>
                    </ul>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>4. Keamanan Data Anda</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        FundRaiser menerapkan standar keamanan teknis dan administratif yang ketat guna melindungi data pribadi Anda dari akses yang tidak sah, pencurian, kehilangan, perubahan, atau penyalahgunaan. Kami menggunakan protokol enkripsi Secure Socket Layer (SSL/TLS) untuk mengamankan pengiriman data penting melalui internet, dan data sensitif seperti kata sandi disimpan menggunakan fungsi hashing satu arah yang aman.
                    </Paragraph>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Namun demikian, Anda juga harus menyadari bahwa tidak ada metode pengiriman data melalui internet atau penyimpanan digital yang benar-benar 100% aman. Kami menyarankan Anda untuk selalu memperbarui kata sandi secara berkala dan tidak membagikan detail akun Anda kepada siapa pun.
                    </Paragraph>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>5. Kebijakan Cookies</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Platform kami menggunakan "cookies" untuk melacak aktivitas kunjungan Anda, menyimpan sesi login, serta mempersonalisasi preferensi tampilan Anda. Cookies adalah file teks kecil yang diletakkan di hard drive komputer Anda oleh browser web Anda. Anda dapat memilih untuk menolak cookies dengan mengubah pengaturan browser, namun hal tersebut dapat membatasi beberapa fungsi interaktif di Platform kami.
                    </Paragraph>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>6. Hak-Hak Pengguna</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Anda memiliki hak-hak tertentu atas data pribadi Anda yang kami simpan, meliputi:
                    </Paragraph>
                    <ul style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px' }}>
                        <li>Hak untuk mengakses, memperbarui, atau mengoreksi informasi pribadi Anda melalui halaman pengaturan akun.</li>
                        <li>Hak untuk meminta penghapusan akun dan penghapusan permanen data pribadi Anda dari sistem kami, dengan mengirimkan permohonan resmi kepada tim dukungan kami (hak untuk dilupakan).</li>
                    </ul>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>7. Perubahan Kebijakan Privasi</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        FundRaiser berhak memperbarui Kebijakan Privasi ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Segala perubahan akan langsung berlaku setelah dipublikasikan di halaman ini. Kami menyarankan Anda untuk meninjau halaman Kebijakan Privasi ini secara berkala guna mengetahui informasi terbaru mengenai cara kami mengamankan privasi Anda.
                    </Paragraph>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPage;
