import { callFetchJob } from '@/config/api';
import { convertSlug, getLocationName } from '@/config/utils';
import { IJob } from '@/types/backend';
import { ArrowRightOutlined, BankOutlined, ClockCircleOutlined, EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Pagination, Row, Skeleton } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import { sfIn } from "spring-filter-query-builder";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface IProps {
    showPagination?: boolean;
}

const JobCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery, location]);

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        //check query string
        const queryLocation = searchParams.get("location");
        const querySkills = searchParams.get("skills")
        if (queryLocation || querySkills) {
            let q = "";
            if (queryLocation) {
                q = sfIn("location", queryLocation.split(",")).toString();
            }

            if (querySkills) {
                q = queryLocation ?
                    q + " and " + `${sfIn("skills", querySkills.split(","))}`
                    : `${sfIn("skills", querySkills.split(","))}`;
            }

            query += `&filter=${encodeURIComponent(q)}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false);
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

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item.id}`)
    }

    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className={`${styles["job-content"]}`}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]} style={{ marginBottom: 8 }}>
                            <div>
                                <span className={styles["title"]} style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                                    Công Việc Mới Nhất
                                </span>
                                <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                                    Khám phá các vị trí tuyển dụng công nghệ hot nhất hôm nay
                                </div>
                            </div>
                            {!showPagination &&
                                <Link
                                    to="job"
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
                        Array.from({ length: 6 }).map((_, idx) => (
                            <Col span={24} md={12} key={`skeleton-${idx}`}>
                                <Card style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                    <Skeleton active avatar={{ shape: 'square', size: 54 }} paragraph={{ rows: 2 }} />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        displayJob?.map(item => {
                            return (
                                <Col span={24} md={12} key={item.id}>
                                    <div
                                        onClick={() => handleViewDetailJob(item)}
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: '12px',
                                            padding: '18px 20px',
                                            border: '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                            display: 'flex',
                                            gap: '16px',
                                            height: '100%',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)';
                                            e.currentTarget.style.borderColor = '#93c5fd';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                        }}
                                    >
                                        <div style={{
                                            width: 60,
                                            height: 60,
                                            minWidth: 60,
                                            borderRadius: 10,
                                            border: '1px solid #f1f5f9',
                                            padding: 4,
                                            background: '#ffffff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            <img
                                                alt={item.name}
                                                src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.company?.logo}`}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                onError={(e) => {
                                                    // Fallback icon when company logo fails to load
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>

                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <h3 style={{
                                                    margin: '0 0 6px 0',
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

                                                {item.company?.name && (
                                                    <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                                        <BankOutlined style={{ color: '#94a3b8' }} /> {item.company.name}
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                                                    <span style={{
                                                        fontSize: '13px',
                                                        fontWeight: 700,
                                                        color: '#059669',
                                                        background: '#ecfdf5',
                                                        padding: '3px 8px',
                                                        borderRadius: '6px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 4
                                                    }}>
                                                        <ThunderboltOutlined /> {(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                                                    </span>

                                                    <span style={{
                                                        fontSize: '12px',
                                                        color: '#475569',
                                                        background: '#f8fafc',
                                                        border: '1px solid #e2e8f0',
                                                        padding: '3px 8px',
                                                        borderRadius: '6px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 4
                                                    }}>
                                                        <EnvironmentOutlined style={{ color: '#0ea5e9' }} /> {getLocationName(item.location)}
                                                    </span>
                                                </div>

                                                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <ClockCircleOutlined style={{ fontSize: 11 }} /> {item.updatedAt ? dayjs(item.updatedAt).locale('en').fromNow() : dayjs(item.createdAt).locale('en').fromNow()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })
                    )}

                    {(!displayJob || (displayJob && displayJob.length === 0))
                        && !isLoading &&
                        <Col span={24}>
                            <div className={styles["empty"]} style={{
                                background: '#ffffff',
                                borderRadius: 16,
                                padding: '48px 20px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Empty description="Hiện tại chưa có việc làm nào phù hợp" />
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

export default JobCard;
