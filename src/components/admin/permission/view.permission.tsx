import { IPermission } from "@/types/backend";
import { Descriptions, Drawer, Tag } from "antd";
import dayjs from 'dayjs';
import { isMobile } from 'react-device-detect';
import { ApiOutlined } from '@ant-design/icons';
import { colorMethod } from "@/config/utils";

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IPermission | null;
    setDataInit: (v: any) => void;
}
const ViewDetailPermission = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <>
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ApiOutlined style={{ color: '#2563eb', fontSize: 18 }} />
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>Chi Tiết Quyền Hạn (Permission)</span>
                    </div>
                }
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={isMobile ? "100%" : 560}
                maskClosable={false}
            >
                <Descriptions bordered column={2} layout="vertical">
                    <Descriptions.Item label="Tên Quyền Hạn">
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{dataInit?.name}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="API Path">
                        <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, color: '#0f172a' }}>
                            {dataInit?.apiPath}
                        </code>
                    </Descriptions.Item>

                    <Descriptions.Item label="Phương Thức (Method)">
                        <Tag
                            style={{
                                fontWeight: 700,
                                borderRadius: 6,
                                color: colorMethod(dataInit?.method as string),
                                borderColor: colorMethod(dataInit?.method as string),
                                background: '#fafafa'
                            }}
                        >
                            {dataInit?.method}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thuộc Module">
                        <span style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            padding: '3px 10px',
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: 12
                        }}>
                            {dataInit?.module}
                        </span>
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

export default ViewDetailPermission;
