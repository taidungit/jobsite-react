import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import { ThunderboltOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const HomePage = () => {
    return (
        <div style={{ paddingBottom: 60 }}>
            {/* Hero Section */}
            <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)",
                padding: "60px 0 70px",
                position: "relative",
                overflow: "hidden"
            }}>
                <div className={styles["container"]}>
                    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#ffffff", marginBottom: 36 }}>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 16px",
                            borderRadius: 30,
                            background: "rgba(37, 99, 235, 0.2)",
                            border: "1px solid rgba(96, 165, 250, 0.3)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#93c5fd",
                            marginBottom: 20
                        }}>
                            <ThunderboltOutlined /> Nền tảng tuyển dụng IT hàng đầu
                        </div>
                        <h1 style={{
                            fontSize: "clamp(30px, 4vw, 44px)",
                            fontWeight: 800,
                            lineHeight: 1.25,
                            letterSpacing: "-1px",
                            marginBottom: 16,
                            color: "#ffffff"
                        }}>
                            Tìm Công Việc IT Phù Hợp & Bứt Phá Sự Nghiệp
                        </h1>
                        <p style={{
                            fontSize: "16px",
                            color: "#94a3b8",
                            lineHeight: 1.6,
                            maxWidth: 620,
                            margin: "0 auto"
                        }}>
                            Hơn 1,000+ cơ hội việc làm IT lương cao từ các tập đoàn công nghệ và startup hàng đầu đang chờ đón bạn.
                        </p>

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 32,
                            marginTop: 28,
                            fontSize: 14,
                            color: "#cbd5e1",
                            flexWrap: "wrap"
                        }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <SafetyCertificateOutlined style={{ color: "#10b981" }} /> Việc làm đã xác thực
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <TeamOutlined style={{ color: "#38bdf8" }} /> 500+ Doanh nghiệp IT
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <ThunderboltOutlined style={{ color: "#f59e0b" }} /> Ứng tuyển nhanh chóng
                            </span>
                        </div>
                    </div>

                    <div className="search-content" style={{ maxWidth: 1040, margin: "0 auto" }}>
                        <SearchClient />
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className={`${styles["container"]} ${styles["home-section"]}`} style={{ marginTop: 48 }}>
                <CompanyCard />
                <div style={{ height: 48 }}></div>
                <JobCard />
            </div>
        </div>
    )
}

export default HomePage;
