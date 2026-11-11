import { Card, Col, Row, Statistic } from "antd";
import CountUp from 'react-countup';
import {
    UserOutlined,
    BankOutlined,
    ScheduleOutlined,
    RiseOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";

const DashboardPage = () => {
    const formatter = (value: number | string) => {
        return (
            <CountUp end={Number(value)} separator="," />
        );
    };

    return (
        <div style={{ paddingBottom: 24 }}>
            {/* Header welcome banner */}
            <div style={{
                background: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
                borderRadius: 16,
                padding: "28px 32px",
                color: "#ffffff",
                marginBottom: 28,
                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.25)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16
            }}>
                <div>
                    <h1 style={{ margin: "0 0 8px 0", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
                        Tổng Quan Hệ Thống JobHunter
                    </h1>
                    <p style={{ margin: 0, fontSize: 14, color: "#dbeafe" }}>
                        Theo dõi thời gian thực số lượng người dùng, doanh nghiệp và hồ sơ ứng tuyển
                    </p>
                </div>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600
                }}>
                    <SafetyCertificateOutlined style={{ color: "#86efac" }} /> Trạng thái máy chủ: Hoạt động tốt
                </div>
            </div>

            {/* Stat Cards */}
            <Row gutter={[20, 20]}>
                <Col span={24} md={8}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 16,
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                            border: "1px solid #e2e8f0",
                            transition: "all 0.25s ease"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                                    Người Dùng Hoạt Động
                                </div>
                                <Statistic
                                    value={112893}
                                    formatter={formatter}
                                    valueStyle={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}
                                />
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
                                    <RiseOutlined /> +14.2% <span style={{ color: "#94a3b8", fontWeight: 400 }}>so với tháng trước</span>
                                </div>
                            </div>
                            <div style={{
                                width: 52,
                                height: 52,
                                borderRadius: 12,
                                background: "#eff6ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#2563eb",
                                fontSize: 24
                            }}>
                                <UserOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={24} md={8}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 16,
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                            border: "1px solid #e2e8f0",
                            transition: "all 0.25s ease"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                                    Doanh Nghiệp Tuyển Dụng
                                </div>
                                <Statistic
                                    value={112893}
                                    formatter={formatter}
                                    valueStyle={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}
                                />
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
                                    <RiseOutlined /> +8.5% <span style={{ color: "#94a3b8", fontWeight: 400 }}>so với tháng trước</span>
                                </div>
                            </div>
                            <div style={{
                                width: 52,
                                height: 52,
                                borderRadius: 12,
                                background: "#ecfdf5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#10b981",
                                fontSize: 24
                            }}>
                                <BankOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col span={24} md={8}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 16,
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                            border: "1px solid #e2e8f0",
                            transition: "all 0.25s ease"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                                    Hồ Sơ Đã Ứng Tuyển
                                </div>
                                <Statistic
                                    value={112893}
                                    formatter={formatter}
                                    valueStyle={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}
                                />
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
                                    <ThunderboltOutlined /> +22.8% <span style={{ color: "#94a3b8", fontWeight: 400 }}>so với tháng trước</span>
                                </div>
                            </div>
                            <div style={{
                                width: 52,
                                height: 52,
                                borderRadius: 12,
                                background: "#fef3c7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#d97706",
                                fontSize: 24
                            }}>
                                <ScheduleOutlined />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default DashboardPage;
