import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICompany } from "@/types/backend";
import { callFetchCompanyById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Breadcrumb, Card, Col, Row, Skeleton } from "antd";
import { EnvironmentOutlined, HomeOutlined, BankOutlined, CheckCircleOutlined } from "@ant-design/icons";

const ClientCompanyDetailPage = (props: any) => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCompanyById(id);
                if (res?.data) {
                    setCompanyDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
        <div style={{ padding: '24px 0 60px', background: '#f8fafc', minHeight: '85vh' }}>
            <div className={styles["container"]}>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/"><HomeOutlined /> Trang chủ</Link>,
                        },
                        {
                            title: <Link to="/company">Top Công ty IT</Link>,
                        },
                        {
                            title: <span>{companyDetail?.name || "Chi tiết công ty"}</span>,
                        },
                    ]}
                    style={{ marginBottom: 20 }}
                />

                {isLoading ? (
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={16}>
                            <Card style={{ borderRadius: 16 }}>
                                <Skeleton active paragraph={{ rows: 8 }} />
                            </Card>
                        </Col>
                        <Col span={24} md={8}>
                            <Card style={{ borderRadius: 16 }}>
                                <Skeleton active avatar paragraph={{ rows: 3 }} />
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    companyDetail && companyDetail.id && (
                        <Row gutter={[24, 24]}>
                            {/* Main Information */}
                            <Col span={24} md={16}>
                                <div style={{
                                    background: '#ffffff',
                                    borderRadius: 16,
                                    padding: '32px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                    marginBottom: 24
                                }}>
                                    <h1 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '28px',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        lineHeight: 1.3
                                    }}>
                                        {companyDetail.name}
                                    </h1>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: '15px',
                                        color: '#475569',
                                        marginBottom: 16
                                    }}>
                                        <EnvironmentOutlined style={{ color: '#0ea5e9', fontSize: 16 }} />
                                        <span>{companyDetail?.address}</span>
                                    </div>
                                </div>

                                <div style={{
                                    background: '#ffffff',
                                    borderRadius: 16,
                                    padding: '32px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                    lineHeight: 1.8
                                }}>
                                    <h2 style={{
                                        fontSize: '20px',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        marginBottom: 16,
                                        borderBottom: '2px solid #f1f5f9',
                                        paddingBottom: 12
                                    }}>
                                        Giới Thiệu Về Công Ty
                                    </h2>
                                    <div style={{ color: '#334155', fontSize: '15px' }}>
                                        {parse(companyDetail?.description ?? "")}
                                    </div>
                                </div>
                            </Col>

                            {/* Sidebar Logo & Profile */}
                            <Col span={24} md={8}>
                                <div style={{
                                    background: '#ffffff',
                                    borderRadius: 16,
                                    padding: '28px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                    textAlign: 'center',
                                    position: 'sticky',
                                    top: 84
                                }}>
                                    <div style={{
                                        width: 120,
                                        height: 120,
                                        margin: '0 auto 16px',
                                        borderRadius: 16,
                                        padding: 10,
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            alt={companyDetail.name}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${companyDetail?.logo}`}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>

                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        color: '#0f172a',
                                        marginBottom: 8
                                    }}>
                                        {companyDetail?.name}
                                    </h3>

                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        color: '#10b981',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        marginBottom: 16
                                    }}>
                                        <CheckCircleOutlined /> Doanh nghiệp đã xác minh
                                    </div>

                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: 8,
                                        background: '#f8fafc',
                                        border: '1px solid #f1f5f9',
                                        fontSize: '13px',
                                        color: '#64748b',
                                        textAlign: 'left'
                                    }}>
                                        <strong>Địa chỉ trụ sở:</strong>
                                        <div style={{ marginTop: 4 }}>{companyDetail?.address}</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )
                )}
            </div>
        </div>
    )
}
export default ClientCompanyDetailPage;
