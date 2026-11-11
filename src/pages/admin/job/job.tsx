import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IJob } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteJob } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchJob } from "@/redux/slice/jobSlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfIn } from "spring-filter-query-builder";

const JobPage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.job.isFetching);
    const meta = useAppSelector(state => state.job.meta);
    const jobs = useAppSelector(state => state.job.result);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDeleteJob = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteJob(id);
            if (res && res.data) {
                message.success('Xóa Job thành công');
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

    const columns: ProColumns<IJob>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: "center",
            render: (text, record, index) => {
                return (
                    <span style={{ fontWeight: 600, color: '#64748b' }}>
                        {(index + 1) + (meta.page - 1) * (meta.pageSize)}
                    </span>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Tên Job',
            dataIndex: 'name',
            sorter: true,
            render: (text) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        },
        {
            title: 'Công ty',
            dataIndex: ["company", "name"],
            sorter: true,
            hideInSearch: true,
            render: (text) => <span style={{ color: '#475569' }}>{text}</span>
        },
        {
            title: 'Mức lương',
            dataIndex: 'salary',
            sorter: true,
            render(dom, entity, index, action, schema) {
                const str = "" + entity.salary;
                return (
                    <span style={{ fontWeight: 600, color: '#059669' }}>
                        {str?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                    </span>
                )
            },
        },
        {
            title: 'Level',
            dataIndex: 'level',
            render(dom, entity) {
                return (
                    <Tag color="blue" style={{ borderRadius: 6, fontWeight: 500 }}>
                        {entity.level}
                    </Tag>
                )
            },
            renderFormItem: (item, props, form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        INTERN: 'INTERN',
                        FRESHER: 'FRESHER',
                        JUNIOR: 'JUNIOR',
                        MIDDLE: 'MIDDLE',
                        SENIOR: 'SENIOR',
                    }}
                    placeholder="Chọn level"
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render(dom, entity, index, action, schema) {
                return (
                    <Tag color={entity.active ? "success" : "error"} style={{ borderRadius: 6, fontWeight: 600 }}>
                        {entity.active ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                )
            },
            hideInSearch: true,
        },

        {
            title: 'CreatedAt',
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
            title: 'UpdatedAt',
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
            title: 'Actions',
            hideInSearch: true,
            width: 90,
            align: 'center',
            render: (_value, entity, _index, _action) => (
                <Space size="middle">
                    <Access
                        permission={ALL_PERMISSIONS.JOBS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 18,
                                color: '#d97706',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                navigate(`/admin/job/upsert?id=${entity.id}`)
                            }}
                            title="Chỉnh sửa công việc"
                        />
                    </Access >
                    <Access
                        permission={ALL_PERMISSIONS.JOBS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa job"}
                            description={"Bạn có chắc chắn muốn xóa job này ?"}
                            onConfirm={() => handleDeleteJob(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined
                                style={{
                                    fontSize: 18,
                                    color: '#ef4444',
                                    cursor: 'pointer'
                                }}
                                title="Xóa công việc"
                            />
                        </Popconfirm>
                    </Access>
                </Space >
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {

        const clone = { ...params };
        let parts = [];
        if (clone.name) parts.push(`name ~ '${clone.name}'`);
        if (clone.salary) parts.push(`salary ~ '${clone.salary}'`);
        if (clone?.level?.length) {
            parts.push(`${sfIn("level", clone.level).toString()}`);
        }

        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;
        delete clone.name;
        delete clone.salary;
        delete clone.level;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        const fields = ["name", "salary", "createdAt", "updatedAt"];
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
                permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}
            >
                <DataTable<IJob>
                    actionRef={tableRef}
                    headerTitle="Danh sách Jobs"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={jobs}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchJob({ query }))
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
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => navigate('upsert')}
                                style={{
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                                    border: 'none'
                                }}
                            >
                                Thêm mới
                            </Button>
                        );
                    }}
                />
            </Access>
        </div >
    )
}

export default JobPage;
