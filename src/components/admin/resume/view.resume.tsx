import { callUpdateResumeStatus } from "@/config/api";
import { IResume } from "@/types/backend";
import { Button, Descriptions, Drawer, Form, Select, message, notification } from "antd";
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { FileTextOutlined } from '@ant-design/icons';
const { Option } = Select;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IResume | null | any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}
const ViewDetailResume = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { onClose, open, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();

    const handleChangeStatus = async () => {
        setIsSubmit(true);

        const status = form.getFieldValue('status');
        const res = await callUpdateResumeStatus(dataInit?.id, status)
        if (res.data) {
            message.success("Cập nhật trạng thái hồ sơ thành công!");
            setDataInit(null);
            onClose(false);
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }

        setIsSubmit(false);
    }

    useEffect(() => {
        if (dataInit) {
            form.setFieldValue("status", dataInit.status)
        }
        return () => form.resetFields();
    }, [dataInit])

    return (
        <>
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileTextOutlined style={{ color: '#2563eb', fontSize: 18 }} />
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>Chi Tiết Hồ Sơ Ứng Tuyển</span>
                    </div>
                }
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={isMobile ? "100%" : 560}
                maskClosable={false}
                destroyOnClose
                extra={
                    <Button
                        loading={isSubmit}
                        type="primary"
                        onClick={handleChangeStatus}
                        style={{
                            borderRadius: 8,
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                            border: 'none'
                        }}
                    >
                        Lưu Trạng Thái
                    </Button>
                }
            >
                <Descriptions bordered column={2} layout="vertical">
                    <Descriptions.Item label="Email Ứng Viên">{dataInit?.email}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Form form={form} style={{ margin: 0 }}>
                            <Form.Item name={"status"} style={{ marginBottom: 0 }}>
                                <Select
                                    style={{ width: "100%" }}
                                    defaultValue={dataInit?.status}
                                >
                                    <Option value="PENDING">PENDING (Chờ duyệt)</Option>
                                    <Option value="REVIEWING">REVIEWING (Đang xem xét)</Option>
                                    <Option value="APPROVED">APPROVED (Chấp thuận)</Option>
                                    <Option value="REJECTED">REJECTED (Từ chối)</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên Công Việc">
                        <span style={{ fontWeight: 600, color: '#2563eb' }}>{dataInit?.job?.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Công Ty Tuyển Dụng">
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{dataInit?.companyName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="File CV Đã Nộp" span={2}>
                        {dataInit?.url ? (
                            <a
                                href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${dataInit?.url}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    fontWeight: 600,
                                    color: '#2563eb',
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    background: '#eff6ff',
                                    display: 'inline-block'
                                }}
                            >
                                Xem & Tải File CV Ứng Tuyển
                            </a>
                        ) : "Chưa có file"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày Tạo">
                        {dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày Cập Nhật">
                        {dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailResume;
