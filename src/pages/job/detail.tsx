import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IJob } from "@/types/backend";
import { callFetchJobById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Breadcrumb, Button, Card, Col, Divider, Row, Skeleton, Tag } from "antd";
import {
    DollarOutlined,
    EnvironmentOutlined,
    HistoryOutlined,
    HomeOutlined,
    SendOutlined,
    BankOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import { convertSlug, getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
dayjs.extend(relativeTime)

const ClientJobDetailPage = (props: any) => {
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchJobById(id);
                if (res?.data) {
                    setJobDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    const handleViewCompany = () => {
        if (jobDetail?.company?.name && jobDetail?.company?.id) {
            const slug = convertSlug(jobDetail.company.name);
            navigate(`/company/${slug}?id=${jobDetail.company.id}`);
        }
    }

    return (
        <div style={{ padding: '24px 0 60px', background: '#f8fafc', minHeight: '85vh' }}>
            <div className={styles["container"]}>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/"><HomeOutlined /> Trang chủ</Link>,
                        },
                        {
                            title: <Link to="/job">Việc làm IT</Link>,
                        },
                        {
                            title: <span>{jobDetail?.name || "Chi tiết công việc"}</span>,
                        },
                    ]}
                    style={{ marginBottom: 20 }}
                />

                {isLoading ? (
                    <Row gutter={[24, 24]}>
                        <Col span={24} md={16}>
                            <Card style={{ borderRadius: 16 }}>
                                <Skeleton active paragraph={{ rows: 10 }} />
                            </Card>
                        </Col>
                        <Col span={24} md={8}>
                            <Card style={{ borderRadius: 16 }}>
                                <Skeleton active avatar paragraph={{ rows: 4 }} />
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    jobDetail && jobDetail.id && (
                        <Row gutter={[24, 24]}>
                            {/* Main Job Information */}
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
                                        fontSize: '26px',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        lineHeight: 1.3
                                    }}>
                                        {jobDetail.name}
                                    </h1>

                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 16,
                                        alignItems: 'center',
                                        marginBottom: 20,
                                        padding: '16px 20px',
                                        background: '#f8fafc',
                                        borderRadius: 12,
                                        border: '1px solid #f1f5f9'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '18px', fontWeight: 700, color: '#059669' }}>
                                            <DollarOutlined />
                                            <span>{(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                        </div>

                                        <div style={{ width: 1, height: 20, background: '#cbd5e1' }} />

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', color: '#475569' }}>
                                            <EnvironmentOutlined style={{ color: '#0ea5e9' }} />
                                            <span>{getLocationName(jobDetail.location)}</span>
                                        </div>

                                        <div style={{ width: 1, height: 20, background: '#cbd5e1' }} />

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', color: '#94a3b8' }}>
                                            <HistoryOutlined />
                                            <span>{jobDetail.updatedAt ? dayjs(jobDetail.updatedAt).locale("en").fromNow() : dayjs(jobDetail.createdAt).locale("en").fromNow()}</span>
                                        </div>
                                    </div>

                                    {jobDetail?.skills?.length > 0 && (
                                        <div style={{ marginBottom: 24 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
                                                KỸ NĂNG YÊU CẦU:
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                {jobDetail?.skills?.map((item, index) => (
                                                    <Tag
                                                        key={`${index}-key`}
                                                        style={{
                                                            fontSize: '13px',
                                                            padding: '4px 12px',
                                                            borderRadius: 6,
                                                            fontWeight: 600,
                                                            color: '#2563eb',
                                                            background: '#eff6ff',
                                                            border: '1px solid #dbeafe'
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Tag>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<SendOutlined />}
                                        onClick={() => setIsModalOpen(true)}
                                        style={{
                                            width: '100%',
                                            height: 50,
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            borderRadius: 10,
                                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8
                                        }}
                                    >
                                        Ứng Tuyển Ngay (Apply Now)
                                    </Button>
                                </div>

                                {/* Job Description Section */}
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
                                        Mô Tả Công Việc Chi Tiết
                                    </h2>
                                    <div style={{ color: '#334155', fontSize: '15px' }}>
                                        {parse(jobDetail.description || "")}
                                    </div>
                                </div>
                            </Col>

                            {/* Company Sidebar Information */}
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
                                        width: 100,
                                        height: 100,
                                        margin: '0 auto 16px',
                                        borderRadius: 16,
                                        padding: 8,
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            alt={jobDetail.company?.name || "Company Logo"}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company?.logo}`}
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
                                        {jobDetail.company?.name}
                                    </h3>

                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        color: '#10b981',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        marginBottom: 20
                                    }}>
                                        <CheckCircleOutlined /> Nhà tuyển dụng đã xác minh
                                    </div>

                                    <Button
                                        onClick={handleViewCompany}
                                        style={{
                                            width: '100%',
                                            height: 42,
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            color: '#2563eb',
                                            borderColor: '#93c5fd',
                                            background: '#eff6ff'
                                        }}
                                    >
                                        Xem trang công ty
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    )
                )}

                <ApplyModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    jobDetail={jobDetail}
                />
            </div>
        </div>
    )
}
export default ClientJobDetailPage;
