import { callFetchCompany } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { ICompany } from '@/types/backend';
import { ArrowRightOutlined, BankOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';

interface IProps {
    showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompany();
    }, [current, pageSize, filter, sortQuery]);

    const fetchCompany = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchCompany(query);
        if (res && res.data) {
            setDisplayCompany(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: ICompany) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/company/${slug}?id=${item.id}`)
        }
    }

    return (
        <div className={`${styles["company-section"]}`}>
            <div className={styles["company-content"]} style={{ paddingTop: 0 }}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]} style={{ marginBottom: 8 }}>
                            <div>
                                <span className={styles["title"]} style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                                    Nhà Tuyển Dụng Hàng Đầu
                                </span>
                                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                                    Khám phá môi trường làm việc lý tưởng tại các công ty IT hàng đầu
                                </div>
                            </div>
                            {!showPagination &&
                                <Link
                                    to="company"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontWeight: 600,
                                        color: '#2563eb',
                                        fontSize: 14,
                                        padding: '8px 16px',
                                        borderRadius: 8,
                                        background: '#eff6ff',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Xem tất cả <ArrowRightOutlined style={{ fontSize: 12 }} />
                                </Link>
                            }
                        </div>
                    </Col>

                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <Col span={24} sm={12} md={6} key={`company-skel-${idx}`}>
                                <Card style={{ borderRadius: 16, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                    <Skeleton.Avatar active size={80} shape="square" style={{ marginBottom: 16 }} />
                                    <Skeleton active paragraph={{ rows: 1 }} />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        displayCompany?.map(item => {
                            return (
                                <Col span={24} sm={12} md={6} key={item.id}>
                                    <div
                                        onClick={() => handleViewDetailJob(item)}
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: '16px',
                                            padding: '24px 20px',
                                            border: '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            height: '100%',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = '0 16px 24px -6px rgba(0, 0, 0, 0.08), 0 6px 8px -4px rgba(0, 0, 0, 0.04)';
                                            e.currentTarget.style.borderColor = '#93c5fd';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                        }}
                                    >
                                        <div style={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: '16px',
                                            padding: 8,
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 16,
                                            overflow: 'hidden'
                                        }}>
                                            <img
                                                alt={item.name}
                                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.logo}`}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>

                                        <h3 style={{
                                            margin: '0 0 8px 0',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: '#0f172a',
                                            lineHeight: 1.4,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {item.name}
                                        </h3>

                                        <div style={{
                                            marginTop: 'auto',
                                            paddingTop: 12,
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: '#2563eb',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 4
                                        }}>
                                            Xem chi tiết <ArrowRightOutlined style={{ fontSize: 11 }} />
                                        </div>
                                    </div>
                                </Col>
                            )
                        })
                    )}

                    {(!displayCompany || (displayCompany && displayCompany.length === 0))
                        && !isLoading &&
                        <Col span={24}>
                            <div className={styles["empty"]} style={{
                                background: '#ffffff',
                                borderRadius: 16,
                                padding: '48px 20px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Empty description="Hiện tại chưa có công ty nào" />
                            </div>
                        </Col>
                    }
                </Row>
                {showPagination && <>
                    <div style={{ marginTop: 36 }}></div>
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            current={current}
                            total={total}
                            pageSize={pageSize}
                            responsive
                            showSizeChanger
                            onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                        />
                    </Row>
                </>}
            </div>
        </div>
    )
}

export default CompanyCard;
