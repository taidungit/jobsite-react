import { Button, Col, Form, Row, Select, notification } from 'antd';
import { EnvironmentOutlined, MonitorOutlined, SearchOutlined } from '@ant-design/icons';
import { LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

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

    return (
        <div style={{
            background: "#ffffff",
            padding: "28px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
            border: "1px solid #e2e8f0"
        }}>
            <ProForm
                form={form}
                onFinish={onFinish}
                submitter={{
                    render: () => <></>
                }}
            >
                <Row gutter={[16, 16]} align="middle">
                    <Col span={24}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                            <span style={{
                                background: "#eff6ff",
                                color: "#2563eb",
                                fontSize: "12px",
                                fontWeight: 700,
                                padding: "4px 10px",
                                borderRadius: "6px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                            }}>
                                Khám phá cơ hội
                            </span>
                        </div>
                        <h2 style={{
                            margin: 0,
                            fontSize: "24px",
                            fontWeight: 800,
                            color: "#0f172a",
                            letterSpacing: "-0.5px"
                        }}>
                            Việc Làm IT Cho Developer "Chất"
                        </h2>
                    </Col>
                    <Col span={24} md={14}>
                        <ProForm.Item
                            name="skills"
                            style={{ marginBottom: 0 }}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                size="large"
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <span style={{ color: "#94a3b8" }}>
                                        <MonitorOutlined style={{ marginRight: 6, color: "#2563eb" }} /> Tìm theo kỹ năng (React, Java, Node.js...)...
                                    </span>
                                }
                                optionLabelProp="label"
                                options={optionsSkills}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col span={14} md={6}>
                        <ProForm.Item
                            name="location"
                            style={{ marginBottom: 0 }}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                size="large"
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <span style={{ color: "#94a3b8" }}>
                                        <EnvironmentOutlined style={{ marginRight: 6, color: "#10b981" }} /> Địa điểm...
                                    </span>
                                }
                                optionLabelProp="label"
                                options={optionsLocations}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col span={10} md={4}>
                        <Button
                            type='primary'
                            size="large"
                            icon={<SearchOutlined />}
                            onClick={() => form.submit()}
                            style={{
                                width: '100%',
                                height: 40,
                                fontWeight: 600,
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                                border: 'none'
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </ProForm>
        </div>
    )
}
export default SearchClient;
