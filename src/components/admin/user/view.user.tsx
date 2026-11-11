import { IUser } from "@/types/backend";
import { Descriptions, Drawer, Tag } from "antd";
import dayjs from 'dayjs';
import { isMobile } from 'react-device-detect';
import { UserOutlined, MailOutlined, SafetyCertificateOutlined, CalendarOutlined } from '@ant-design/icons';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IUser | null;
    setDataInit: (v: any) => void;
}

const ViewDetailUser = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    const roleName = typeof dataInit?.role === 'object' && dataInit?.role !== null
        ? (dataInit.role as any)?.name
        : (dataInit?.role || 'N/A');

    const companyName = typeof dataInit?.company === 'object' && dataInit?.company !== null
        ? (dataInit.company as any)?.name
        : 'N/A';

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined style={{ color: '#2563eb' }} />
                    <span style={{ fontWeight: 600 }}>Chi Tiết Người Dùng</span>
                </div>
            }
            placement="right"
            onClose={() => { onClose(false); setDataInit(null) }}
            open={open}
            width={isMobile ? "100%" : 560}
            maskClosable={false}
        >
            <Descriptions bordered column={1} layout="horizontal" size="middle">
                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}><UserOutlined /> Tên hiển thị</span>}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{dataInit?.name || 'N/A'}</span>
                </Descriptions.Item>

                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}><MailOutlined /> Email</span>}>
                    <span style={{ color: '#2563eb', fontWeight: 500 }}>{dataInit?.email || 'N/A'}</span>
                </Descriptions.Item>

                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}>Giới tính</span>}>
                    <Tag color={dataInit?.gender === 'MALE' ? 'blue' : dataInit?.gender === 'FEMALE' ? 'magenta' : 'default'}>
                        {dataInit?.gender === 'MALE' ? 'Nam' : dataInit?.gender === 'FEMALE' ? 'Nữ' : (dataInit?.gender || 'Khác')}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}>Tuổi</span>}>
                    {dataInit?.age || 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}><SafetyCertificateOutlined /> Vai trò</span>}>
                    <Tag color="purple" style={{ fontWeight: 500 }}>{roleName}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}>Công ty</span>}>
                    <span style={{ fontWeight: 500, color: '#0f172a' }}>{companyName}</span>
                </Descriptions.Item>

                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}>Địa chỉ</span>}>
                    {dataInit?.address || 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}><CalendarOutlined /> Ngày tạo</span>}>
                    {dataInit?.createdAt ? dayjs(dataInit.createdAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label={<span style={{ fontWeight: 500, color: '#475569' }}><CalendarOutlined /> Ngày sửa</span>}>
                    {dataInit?.updatedAt ? dayjs(dataInit.updatedAt).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    )
}

export default ViewDetailUser;
