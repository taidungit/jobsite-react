import { Button, Col, Form, Row, Select, notification } from 'antd';
import { EnvironmentOutlined, SearchOutlined, ThunderboltFilled, FireFilled } from '@ant-design/icons';
import { LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from '@/styles/client.module.scss';

const POPULAR_SKILLS = ['Java', 'ReactJS', 'NodeJS', 'Python', 'Golang', 'Tester', 'Frontend', 'Backend'];

const SearchClient = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (location.search) {
            const queryLocation = searchParams.get("location");
            const querySkills = searchParams.get("skills")
            if (queryLocation) {
                form.setFieldValue("location", queryLocation.split(","))
            }
            if (querySkills) {
                form.setFieldValue("skills", querySkills.split(","))
            }
        }
    }, [location.search])

    useEffect(() => {
        fetchSkill();
    }, [])

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await callFetchAllSkill(query);
        if (res && res.data) {
            const arr = res?.data?.result?.map(item => {
                return {
                    label: item.name as string,
                    value: item.id + "" as string
                }
            }) ?? [];
            setOptionsSkills(arr);
        }
    }

    const onFinish = async (values: any) => {
        let query = "";
        if (values?.location?.length) {
            query = `location=${values?.location?.join(",")}`;
        }
        if (values?.skills?.length) {
            query = values.location?.length ? query + `&skills=${values?.skills?.join(",")}`
                :
                `skills=${values?.skills?.join(",")}`;
        }

        if (!query) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: "Vui lòng chọn tiêu chí để search"
            });
            return;
        }
        navigate(`/job?${query}`);
    }

    const handleQuickTagClick = (skillName: string) => {
        const currentSkills: string[] = form.getFieldValue("skills") || [];
        const match = optionsSkills.find(s => s.label.toLowerCase() === skillName.toLowerCase());
        const val = match ? match.value : skillName;
        if (!currentSkills.includes(val)) {
            form.setFieldValue("skills", [...currentSkills, val]);
        }
    }

    return (
        <div className={styles["search-card-wrapper"]}>
            <ProForm
                form={form}
                onFinish={onFinish}
                submitter={{
                    render: () => <></>
                }}
            >
                {/* Search Header Banner */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                    flexWrap: "wrap",
                    gap: 12
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <span style={{
                            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(59, 130, 246, 0.14) 100%)",
                            color: "#2563eb",
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "5px 14px",
                            borderRadius: "20px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            border: "1px solid rgba(37, 99, 235, 0.18)",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase"
                        }}>
                            <ThunderboltFilled style={{ color: "#f59e0b", fontSize: 13 }} /> Cơ Hội Việc Làm IT
                        </span>
                        <h2 style={{
                            margin: 0,
                            fontSize: "20px",
                            fontWeight: 800,
                            color: "#0f172a",
                            letterSpacing: "-0.4px"
                        }}>
                            Việc Làm IT Cho Developer <span style={{
                                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>Chất Lượng Cao</span>
                        </h2>
                    </div>

                    <div style={{
                        fontSize: "13px",
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontWeight: 500
                    }}>
                        <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#10b981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
                            display: "inline-block"
                        }} />
                        <span>1,000+ vị trí đang mở</span>
                    </div>
                </div>

                {/* Input Fields & Submit */}
                <Row gutter={[12, 12]} align="middle">
                    <Col xs={24} md={13}>
                        <div className={styles["search-input-group"]}>
                            <SearchOutlined className={styles["search-icon-prefix"]} style={{ color: "#2563eb" }} />
                            <ProForm.Item
                                name="skills"
                                style={{ marginBottom: 0, width: '100%' }}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    size="large"
                                    bordered={false}
                                    maxTagCount="responsive"
                                    placeholder="Tìm theo kỹ năng (React, Java, Node.js, Spring...)"
                                    optionLabelProp="label"
                                    options={optionsSkills}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </div>
                    </Col>

                    <Col xs={24} md={7}>
                        <div className={styles["search-input-group"]}>
                            <EnvironmentOutlined className={styles["search-icon-prefix"]} style={{ color: "#10b981" }} />
                            <ProForm.Item
                                name="location"
                                style={{ marginBottom: 0, width: '100%' }}
                            >
                                <Select
                                    mode="multiple"
                                    allowClear
                                    size="large"
                                    bordered={false}
                                    maxTagCount="responsive"
                                    placeholder="Chọn địa điểm..."
                                    optionLabelProp="label"
                                    options={optionsLocations}
                                    style={{ width: '100%' }}
                                />
                            </ProForm.Item>
                        </div>
                    </Col>

                    <Col xs={24} md={4}>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={() => form.submit()}
                            className={styles["search-btn-primary"]}
                            style={{ width: '100%' }}
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                </Row>

                {/* Popular Keywords Row */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 16,
                    flexWrap: "wrap"
                }}>
                    <span style={{
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4
                    }}>
                        <FireFilled style={{ color: "#ef4444", fontSize: 13 }} /> Gợi ý:
                    </span>
                    {POPULAR_SKILLS.map(skill => (
                        <span
                            key={skill}
                            onClick={() => handleQuickTagClick(skill)}
                            className={styles["search-quick-tag"]}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </ProForm>
        </div>
    )
}

export default SearchClient;
