import { useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Modal, Row, Upload, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import enUS from 'antd/lib/locale/en_US';
import { UploadOutlined, SendOutlined, BankOutlined, FilePdfOutlined, LockOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { callCreateResume, callUploadSingleFile } from "@/config/api";
import { useState } from 'react';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {
    const { isModalOpen, setIsModalOpen, jobDetail } = props;
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [urlCV, setUrlCV] = useState<string>("");

    const navigate = useNavigate();

    const handleOkButton = async () => {
        if (!urlCV && isAuthenticated) {
            message.error("Vui lòng upload CV!");
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(false);
            navigate(`/login?callback=${window.location.href}`)
        }
        else {
            if (jobDetail) {
                const res = await callCreateResume(urlCV, jobDetail?.id, user.email, user.id);
                if (res.data) {
                    message.success("Rải CV thành công!");
                    setIsModalOpen(false);
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            }
        }
    }

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        accept: "application/pdf,application/msword, .doc, .docx, .pdf",
        async customRequest({ file, onSuccess, onError }: any) {
            const res = await callUploadSingleFile(file, "resume");
            if (res && res.data) {
                setUrlCV(res.data.fileName);
                if (onSuccess) onSuccess('ok')
            } else {
                if (onError) {
                    setUrlCV("");
                    const error = new Error(res.message);
                    onError({ event: error });
                }
            }
        },
        onChange(info: any) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} đã được tải lên thành công`);
            } else if (info.file.status === 'error') {
                message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
            }
        },
    };

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
                            <SendOutlined style={{ fontSize: 18 }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Ứng Tuyển Công Việc</div>
                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>Gửi hồ sơ trực tiếp đến nhà tuyển dụng</div>
                        </div>
                    </div>
                }
                open={isModalOpen}
                onOk={() => handleOkButton()}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                okText={isAuthenticated ? "Nộp Hồ Sơ Ngay" : "Đăng Nhập Để Ứng Tuyển"}
                okButtonProps={{
                    size: 'large',
                    style: {
                        borderRadius: 8,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                        border: 'none',
                        minWidth: 160
                    }
                }}
                cancelButtonProps={{
                    style: { display: "none" }
                }}
                destroyOnClose={true}
                width={560}
                style={{ top: 40 }}
            >
                <div style={{ padding: '16px 0 8px' }}>
                    {isAuthenticated ?
                        <div>
                            {/* Job info card */}
                            <div style={{
                                background: '#f8fafc',
                                borderRadius: 12,
                                padding: '16px',
                                border: '1px solid #e2e8f0',
                                marginBottom: 20
                            }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                                    {jobDetail?.name}
                                </div>
                                <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <BankOutlined /> {jobDetail?.company?.name}
                                </div>
                            </div>

                            <ConfigProvider locale={enUS}>
                                <ProForm
                                    submitter={{
                                        render: () => <></>
                                    }}
                                    layout="vertical"
                                >
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <ProFormText
                                                fieldProps={{
                                                    type: "email",
                                                    size: "large",
                                                    style: { borderRadius: 8 }
                                                }}
                                                label={<span style={{ fontWeight: 600, color: '#334155' }}>Email Ứng Viên</span>}
                                                name={"email"}
                                                disabled
                                                initialValue={user?.email}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <ProForm.Item
                                                label={<span style={{ fontWeight: 600, color: '#334155' }}>Hồ sơ CV của bạn</span>}
                                                rules={[{ required: true, message: 'Vui lòng upload file CV!' }]}
                                                style={{ marginBottom: 0 }}
                                            >
                                                <Upload {...propsUpload} style={{ width: '100%' }}>
                                                    <Button
                                                        icon={<FilePdfOutlined style={{ color: '#ef4444' }} />}
                                                        size="large"
                                                        style={{
                                                            width: '100%',
                                                            height: 48,
                                                            borderRadius: 8,
                                                            borderStyle: 'dashed',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        Chọn file CV (*.pdf, *.doc, *.docx &lt; 5MB)
                                                    </Button>
                                                </Upload>
                                            </ProForm.Item>
                                        </Col>
                                    </Row>
                                </ProForm>
                            </ConfigProvider>
                        </div>
                        :
                        <div style={{
                            padding: '32px 20px',
                            textAlign: 'center',
                            background: '#f8fafc',
                            borderRadius: 12,
                            border: '1px solid #e2e8f0'
                        }}>
                            <div style={{
                                width: 54,
                                height: 54,
                                borderRadius: 14,
                                background: '#eff6ff',
                                color: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                                margin: '0 auto 16px'
                            }}>
                                <LockOutlined />
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                                Yêu Cầu Đăng Nhập
                            </h3>
                            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 360, margin: '0 auto' }}>
                                Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể nộp hồ sơ ứng tuyển vị trí này.
                            </p>
                        </div>
                    }
                </div>
            </Modal>
        </>
    )
}
export default ApplyModal;
