import React from 'react';
import { Typography, Card, Tag, Breadcrumb, Divider } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const TermsPage: React.FC = () => {
    return (
        <div style={{ background: '#f8fafc', padding: '60px 5% 100px' }}>
            <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <Breadcrumb style={{ marginBottom: '24px' }}>
                    <Breadcrumb.Item><Link to="/">Beranda</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>Syarat & Ketentuan</Breadcrumb.Item>
                </Breadcrumb>

                {/* Hero Header */}
                <div style={{ marginBottom: '40px' }}>
                    <Tag color="blue" style={{ borderRadius: '30px', padding: '4px 16px', fontWeight: 600, marginBottom: '16px' }}>
                        LEGAL & DOKUMEN
                    </Tag>
                    <Title level={1} style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
                        Syarat & Ketentuan Layanan
                    </Title>
                    <Text type="secondary" style={{ fontSize: '0.95rem' }}>Terakhir diperbarui: 23 Juni 2026</Text>
                </div>

                {/* Content Card */}
                <Card style={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }} bodyStyle={{ padding: '48px' }}>
                    <Paragraph style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7 }}>
                        Selamat datang di <strong>FundRaiser</strong>. Syarat dan ketentuan penggunaan layanan ini ("Ketentuan Layanan") mengatur hak, kewajiban, dan tata cara penggunaan platform FundRaiser baik bagi Penggalang Dana (Campaigner), Donatur, maupun pengunjung umum. Harap membaca seluruh ketentuan ini dengan saksama sebelum menggunakan platform kami.
                    </Paragraph>

                    <Divider style={{ margin: '32px 0' }} />

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>1. Ketentuan Umum</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Dengan mengakses dan menggunakan platform FundRaiser, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Ketentuan Layanan ini serta Kebijakan Privasi kami. Jika Anda tidak menyetujui bagian mana pun dari ketentuan ini, Anda tidak diperkenankan untuk menggunakan platform atau layanan yang kami sediakan.
                    </Paragraph>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Layanan kami hanya ditujukan bagi individu yang telah berusia minimal 18 tahun atau telah cakap hukum menurut peraturan perundang-undangan yang berlaku di Republik Indonesia. Apabila Anda mendaftar atas nama badan hukum atau organisasi, Anda menyatakan bahwa Anda memiliki wewenang hukum untuk bertindak dan mengikat organisasi tersebut pada Ketentuan Layanan ini.
                    </Paragraph>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>2. Definisi & Istilah</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Dalam Ketentuan Layanan ini, istilah-istilah di bawah ini memiliki makna sebagai berikut:
                    </Paragraph>
                    <ul style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px' }}>
                        <li><strong>Platform:</strong> Website, aplikasi mobile, dan seluruh subdomain resmi yang dioperasikan oleh FundRaiser.</li>
                        <li><strong>Penggalang Dana (Campaigner):</strong> Pengguna terdaftar yang membuat kampanye (campaign) penggalangan dana di Platform.</li>
                        <li><strong>Donatur:</strong> Pengguna baik terdaftar maupun tidak terdaftar yang memberikan sumbangan dana (donasi) secara sukarela untuk kampanye tertentu.</li>
                        <li><strong>Kampanye (Campaign):</strong> Upaya penggalangan dana secara online untuk tujuan sosial, medis, pendidikan, tanggap bencana, atau tujuan kemanusiaan lainnya yang disetujui oleh FundRaiser.</li>
                        <li><strong>Dana Terkumpul:</strong> Total akumulasi donasi yang disalurkan oleh Donatur pada suatu kampanye sebelum dikurangi biaya administrasi platform dan biaya gerbang pembayaran (payment gateway).</li>
                    </ul>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>3. Pendaftaran Akun & Keamanan</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Untuk mengakses beberapa fitur utama, Anda diwajibkan membuat akun resmi di Platform dengan memberikan data yang akurat, lengkap, dan terbaru. Anda bertanggung jawab penuh atas keamanan kredensial akun Anda, termasuk kata sandi (password), serta segala aktivitas yang terjadi di bawah akun Anda.
                    </Paragraph>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Anda dilarang keras menggunakan identitas palsu, menggunakan nama orang lain tanpa izin tertulis, atau membuat akun tiruan dengan niat menyesatkan orang lain. Apabila ditemukan indikasi penyalahgunaan akun, FundRaiser berhak menangguhkan atau menghapus akun tersebut secara sepihak demi keamanan ekosistem platform.
                    </Paragraph>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>4. Hak & Kewajiban Penggalang Dana</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Sebagai Penggalang Dana, Anda diwajibkan untuk:
                    </Paragraph>
                    <ul style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '20px' }}>
                        <li>Menjamin bahwa seluruh informasi, deskripsi, foto, dokumen pendukung medis, dan rincian alokasi dana kampanye adalah benar, akurat, dan tidak mengandung kebohongan.</li>
                        <li>Menyediakan pembaruan (update) secara berkala mengenai perkembangan penggunaan dana dan implementasi kegiatan kepada Donatur melalui Platform.</li>
                        <li>Tidak menggunakan dana terkumpul untuk kegiatan ilegal, terorisme, pencucian uang, politik praktis, pornografi, atau kegiatan yang bertentangan dengan hukum dan ketertiban umum di Republik Indonesia.</li>
                    </ul>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>5. Ketentuan Donasi & Pembayaran</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Seluruh donasi yang dilakukan di Platform adalah bentuk transaksi sukarela dan non-transaksional. Donatur memahami bahwa donasi tidak memberikan hak kepemilikan, keuntungan finansial, atau kompensasi materi apa pun dari Penggalang Dana maupun dari FundRaiser.
                    </Paragraph>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Semua donasi yang telah sukses diproses melalui gerbang pembayaran bersifat final dan tidak dapat ditarik kembali (non-refundable), kecuali terdapat kekeliruan sistematis pembayaran yang dapat dibuktikan secara tertulis dan diverifikasi oleh tim administrasi FundRaiser.
                    </Paragraph>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>6. Pencairan & Potongan Dana</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        FundRaiser berhak mengenakan biaya administrasi (platform fee) sebesar 5% (lima persen) dari setiap donasi terkumpul pada kampanye umum, kecuali untuk kampanye kategori Bencana Alam khusus yang disetujui dengan potongan 0%. Potongan administrasi ini digunakan untuk pemeliharaan sistem, server, keamanan transaksi, dan promosi platform agar kebaikan tetap berjalan berkelanjutan.
                    </Paragraph>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Biaya administrasi bank atau biaya gerbang pembayaran (payment gateway) dari pihak ketiga ditanggung oleh masing-masing transaksi donasi sesuai dengan jenis pembayaran yang dipilih oleh Donatur.
                    </Paragraph>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>7. Batasan Tanggung Jawab</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        FundRaiser berperan sebagai perantara teknologi yang memfasilitasi penggalangan dana secara online. Kami tidak bertanggung jawab atas keberhasilan, kelangsungan, atau efektivitas proyek yang digalang oleh Campaigner. Seluruh risiko penggunaan dana dan pelaksanaan program sepenuhnya menjadi tanggung jawab moral dan hukum Penggalang Dana bersangkutan.
                    </Paragraph>

                    <Title level={3} style={{ fontWeight: 800, color: '#0f172a', marginTop: '32px' }}>8. Hukum yang Berlaku & Penyelesaian Sengketa</Title>
                    <Paragraph style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                        Ketentuan Layanan ini tunduk pada dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap sengketa, perselisihan, atau tuntutan yang timbul dari atau terkait dengan penggunaan Platform akan diselesaikan terlebih dahulu secara musyawarah untuk mencapai mufakat. Apabila kesepakatan tidak tercapai, sengketa akan dirujuk dan diselesaikan melalui Badan Arbitrase Nasional Indonesia (BANI) atau pengadilan negeri berwenang.
                    </Paragraph>
                </Card>
            </div>
        </div>
    );
};

export default TermsPage;
