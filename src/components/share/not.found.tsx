import { useNavigate } from "react-router-dom";
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            padding: "24px"
        }}>
            <div style={{
                background: "#ffffff",
                padding: "48px 36px",
                borderRadius: "20px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                maxWidth: "520px",
                width: "100%",
                textAlign: "center"
            }}>
                <Result
                    status="404"
                    title={<span style={{ fontWeight: 800, fontSize: 32, color: "#0f172a" }}>404</span>}
                    subTitle={<span style={{ fontSize: 16, color: "#64748b" }}>Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</span>}
                    extra={
                        <Button
                            type="primary"
                            icon={<HomeOutlined />}
                            size="large"
                            onClick={() => navigate('/')}
                            style={{
                                borderRadius: "10px",
                                padding: "0 28px",
                                height: "46px",
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)"
                            }}
                        >
                            Về Trang Chủ
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

export default NotFound;
