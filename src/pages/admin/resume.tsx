import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IResume } from "@/types/backend";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteResume } from "@/config/api";
import queryString from 'query-string';
import { fetchResume } from "@/redux/slice/resumeSlide";
import ViewDetailResume from "@/components/admin/resume/view.resume";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { sfIn } from "spring-filter-query-builder";
import { EditOutlined, ClockCircleOutlined, CheckCircleOutlined, EyeOutlined } from "@ant-design/icons";

const ResumePage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.resume.isFetching);
    const meta = useAppSelector(state => state.resume.meta);
    const resumes = useAppSelector(state => state.resume.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IResume | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const handleDeleteResume = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteResume(id);
            if (res && res.data) {
                message.success('Xóa Resume thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const getStatusTag = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Tag color="warning" icon={<ClockCircleOutlined />} style={{ borderRadius: 6, fontWeight: 500 }}>Đang chờ duyệt</Tag>;
            case 'REVIEWING':
                return <Tag color="processing" icon={<EyeOutlined />} style={{ borderRadius: 6, fontWeight: 500 }}>Đang xem xét</Tag>;
            case 'APPROVED':
                return <Tag color="success" icon={<CheckCircleOutlined />} style={{ borderRadius: 6, fontWeight: 500 }}>Đã phê duyệt</Tag>;
            case 'REJECTED':
                return <Tag color="error" style={{ borderRadius: 6, fontWeight: 500 }}>Từ chối</Tag>;
            default:
                return <Tag color="default" style={{ borderRadius: 6 }}>{status}</Tag>;
        }
    };

    const columns: ProColumns<IResume>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 70,
            render: (text, record, index, action) => {
                return (
                    <a
                        href="#"
                        style={{ fontWeight: 600, color: '#2563eb' }}
                        onClick={(e) => {
                            e.preventDefault();
                            setOpenViewDetail(true);
                            setDataInit(record);
                        }}
                    >
                        #{record.id}
                    </a>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            sorter: true,
            render(dom, entity) {
                return entity.status ? getStatusTag(entity.status) : <></>;
            },
            renderFormItem: (item, props, form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        PENDING: 'PENDING',
                        REVIEWING: 'REVIEWING',
                        APPROVED: 'APPROVED',
                        REJECTED: 'REJECTED',
                    }}
                    placeholder="Chọn trạng thái"
                />
            ),
        },

        {
            title: 'Job',
            dataIndex: ["job", "name"],
            hideInSearch: true,
            render: (text) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        },
        {
            title: 'Company',
            dataIndex: "companyName",
            hideInSearch: true,
            render: (text) => <span style={{ color: '#475569' }}>{text}</span>
        },

        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            width: 180,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <span style={{ color: '#64748b', fontSize: 13 }}>
                        {record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </span>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày Cập Nhật',
            dataIndex: 'updatedAt',
            width: 180,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <span style={{ color: '#64748b', fontSize: 13 }}>
                        {record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </span>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Hành Động',
            hideInSearch: true,
            width: 90,
            align: 'center',
            render: (_value, entity, _index, _action) => (
                <Space size="middle">
                    <EditOutlined
                        style={{
                            fontSize: 18,
                            color: '#d97706',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(entity);
                        }}
                        title="Xem & Cập nhật trạng thái"
                    />
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        let parts = [];

        if (clone?.status?.length) {
            parts.push(`${sfIn("status", clone.status).toString()}`);
        }

        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;
        delete clone.status;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        const fields = ["status", "createdAt", "updatedAt"];
        if (sort) {
            for (const field of fields) {
                if (sort[field]) {
                    sortBy = `sort=${field},${sort[field] === 'ascend' ? 'asc' : 'desc'}`;
                    break;
                }
            }
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
            >
                <DataTable<IResume>
                    actionRef={tableRef}
                    headerTitle="Danh sách Hồ Sơ Ứng Tuyển"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={resumes}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchResume({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.page,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total: number, range: [number, number]) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <></>
                        );
                    }}
                />
            </Access>
            <ViewDetailResume
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div>
    )
}

export default ResumePage;
