import { Button, Col, Empty, Form, Modal, Row, Select, Table, Tabs, Tag, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume, ISubscribers } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callCreateSubscriber, callFetchAllSkill, callFetchResumeByUser, callGetSubscriberSkills, callUpdateSubscriber } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
    MonitorOutlined,
    UserOutlined,
    FileTextOutlined,
    MailOutlined,
    KeyOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ToolOutlined,
    EyeOutlined
} from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppSelector } from "@/redux/hooks";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}

const UserResume = (props: any) => {
    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result as IResume[])
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const getStatusTag = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Tag color="warning" icon={<ClockCircleOutlined />}>Đang chờ duyệt</Tag>;
            case 'REVIEWING':
                return <Tag color="processing" icon={<EyeOutlined />}>Đang xem xét</Tag>;
            case 'APPROVED':
                return <Tag color="success" icon={<CheckCircleOutlined />}>Đã phê duyệt</Tag>;
            case 'REJECTED':
                return <Tag color="error">Từ chối</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const columns: ColumnsType<IResume> = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: "center",
            render: (text: any, record: IResume, index: number) => {
                return (
                    <span style={{ fontWeight: 600, color: '#64748b' }}>
                        {(index + 1)}
                    </span>
                )
            }
        },
        {
            title: 'Công Ty',
            dataIndex: "companyName",
            render: (text: any) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        },
        {
            title: 'Vị trí công việc',
            dataIndex: ["job", "name"],
            render: (text: any) => <span style={{ color: '#2563eb', fontWeight: 500 }}>{text}</span>
        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
            render: (status: any) => getStatusTag(status)
        },
        {
            title: 'Ngày nộp CV',
            dataIndex: "createdAt",
            render(value: any, record: IResume, index: number) {
                return (
                    <span style={{ color: '#64748b', fontSize: 13 }}>
                        {dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </span>
                )
            },
        },
        {
            title: 'Hành động',
            dataIndex: "",
            align: "center",
            render(value: any, record: IResume, index: number) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            fontWeight: 600,
                            color: '#2563eb',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            background: '#eff6ff',
                            display: 'inline-block'
                        }}
                    >
                        Xem CV
                    </a>
                )
            },
        },
    ];

    return (
        <div style={{ paddingTop: 8 }}>
            <Table<IResume>
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
                bordered={false}
                rowKey={(record: IResume) => record.id || Math.random().toString()}
                locale={{
                    emptyText: <Empty description="Bạn chưa nộp hồ sơ ứng tuyển nào" />
                }}
                style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #f1f5f9' }}
            />
        </div>
    )
}

const UserUpdateInfo = (props: any) => {
    return (
        <div style={{
            padding: '48px 20px',
            textAlign: 'center',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e2e8f0'
        }}>
            <div style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                margin: '0 auto 16px'
            }}>
                <ToolOutlined />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                Cập Nhật Thông Tin Cá Nhân
            </h3>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto' }}>
                Tính năng đang được hoàn thiện và sẽ sớm khả dụng trong bản cập nhật kế tiếp.
            </p>
        </div>
    )
}

const JobByEmail = (props: any) => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.account.user);
    const [optionsSkills, setOptionsSkills] = useState<{
        label: string;
        value: string;
    }[]>([]);

    const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);

    useEffect(() => {
        const init = async () => {
            await fetchSkill();
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                setSubscriber(res.data);
                const d = res.data.skills;
                const arr = d.map((item: any) => {
                    return {
                        label: item.name as string,
                        value: item.id + "" as string
                    }
                });
                form.setFieldValue("skills", arr);
            }
        }
        init();
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
        const { skills } = values;

        const arr = skills?.map((item: any) => {
            if (item?.id) return { id: item.id };
            return { id: item }
        });

        if (!subscriber?.id) {
            const data = {
                email: user.email,
                name: user.name,
                skills: arr
            }

            const res = await callCreateSubscriber(data);
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callUpdateSubscriber({
                id: subscriber?.id,
                skills: arr
            });
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    return (
        <div style={{ paddingTop: 8 }}>
            <div style={{
                background: '#eff6ff',
                borderRadius: 10,
                padding: '16px 20px',
                border: '1px solid #dbeafe',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 12
            }}>
                <MailOutlined style={{ fontSize: 24, color: '#2563eb' }} />
                <div>
                    <div style={{ fontWeight: 700, color: '#1e40af', fontSize: 14 }}>Nhận thông báo việc làm tự động</div>
                    <div style={{ color: '#3b82f6', fontSize: 13 }}>
                        Hệ thống sẽ gửi các cơ hội việc làm IT mới nhất phù hợp với kỹ năng bạn đã chọn đến email <b>{user.email}</b>.
                    </div>
                </div>
            </div>

            <Form
                onFinish={onFinish}
                form={form}
                layout="vertical"
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={<span style={{ fontWeight: 600, color: '#334155' }}>Kỹ năng bạn quan tâm</span>}
                            name={"skills"}
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                size="large"
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined style={{ marginRight: 6 }} /> Chọn các kỹ năng (React, Java, Node.js...)...
                                    </>
                                }
                                optionLabelProp="label"
                                options={optionsSkills}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => form.submit()}
                            style={{
                                borderRadius: 8,
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                                border: 'none',
                                minWidth: 140
                            }}
                        >
                            Lưu Thay Đổi
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileTextOutlined /> Lịch sử ứng tuyển (Rải CV)
                </span>
            ),
            children: <UserResume />,
        },
        {
            key: 'email-by-skills',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MailOutlined /> Nhận Jobs qua Email
                </span>
            ),
            children: <JobByEmail />,
        },
        {
            key: 'user-update-info',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserOutlined /> Cập nhật thông tin
                </span>
            ),
            children: <UserUpdateInfo />,
        },
        {
            key: 'user-password',
            label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <KeyOutlined /> Đổi mật khẩu
                </span>
            ),
            children: (
                <div style={{
                    padding: '48px 20px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{
                        width: 52,
                        height: 52,
                        borderRadius: 12,
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        margin: '0 auto 16px'
                    }}>
                        <KeyOutlined />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                        Đổi Mật Khẩu
                    </h3>
                    <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto' }}>
                        Tính năng bảo mật đang được cấu hình và sẽ có mặt trong phiên bản tiếp theo.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <>
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2563eb'
                        }}>
                            <UserOutlined style={{ fontSize: 18 }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Quản Lý Tài Khoản Cá Nhân</div>
                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>Theo dõi hồ sơ và tùy chỉnh nhận thông báo việc làm</div>
                        </div>
                    </div>
                }
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "960px"}
                style={{ top: 30 }}
            >
                <div style={{ minHeight: 420, paddingTop: 8 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ManageAccount;
