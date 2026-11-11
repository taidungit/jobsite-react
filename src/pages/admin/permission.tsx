import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IPermission } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeletePermission } from "@/config/api";
import queryString from 'query-string';
import { fetchPermission } from "@/redux/slice/permissionSlide";
import ViewDetailPermission from "@/components/admin/permission/view.permission";
import ModalPermission from "@/components/admin/permission/modal.permission";
import { colorMethod } from "@/config/utils";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";

const PermissionPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IPermission | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.permission.isFetching);
    const meta = useAppSelector(state => state.permission.meta);
    const permissions = useAppSelector(state => state.permission.result);
    const dispatch = useAppDispatch();

    const handleDeletePermission = async (id: string | undefined) => {
        if (id) {
            const res = await callDeletePermission(id);
            if (res && res.statusCode === 200) {
                message.success('Xóa Permission thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.error
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IPermission>[] = [
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
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            render: (text) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        },
        {
            title: 'API Path',
            dataIndex: 'apiPath',
            sorter: true,
            render: (text) => <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, color: '#0f172a', fontSize: 13 }}>{text}</code>
        },
        {
            title: 'Method',
            dataIndex: 'method',
            sorter: true,
            render(dom, entity) {
                return (
                    <Tag
                        style={{
                            fontWeight: 700,
                            borderRadius: 6,
                            color: colorMethod(entity?.method as string),
                            borderColor: colorMethod(entity?.method as string),
                            background: '#fafafa'
                        }}
                    >
                        {entity?.method || ''}
                    </Tag>
                )
            },
        },
        {
            title: 'Module',
            dataIndex: 'module',
            sorter: true,
            render: (text) => (
                <span style={{
                    background: '#eff6ff',
                    color: '#2563eb',
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 12
                }}>
                    {text}
                </span>
            )
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
                    <Access
                        permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 18,
                                color: '#d97706',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                            title="Chỉnh sửa quyền"
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.PERMISSIONS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa permission"}
                            description={"Bạn có chắc chắn muốn xóa permission này ?"}
                            onConfirm={() => handleDeletePermission(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined
                                style={{
                                    fontSize: 18,
                                    color: '#ef4444',
                                    cursor: 'pointer'
                                }}
                                title="Xóa quyền"
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        if (clone.name) clone.name = `/${clone.name}/i`;
        if (clone.apiPath) clone.apiPath = `/${clone.apiPath}/i`;
        if (clone.method) clone.method = `/${clone.method}/i`;
        if (clone.module) clone.module = `/${clone.module}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
        }
        if (sort && sort.apiPath) {
            sortBy = sort.apiPath === 'ascend' ? "sort=apiPath,asc" : "sort=apiPath,desc";
        }
        if (sort && sort.method) {
            sortBy = sort.method === 'ascend' ? "sort=method,asc" : "sort=method,desc";
        }
        if (sort && sort.module) {
            sortBy = sort.module === 'ascend' ? "sort=module,asc" : "sort=module,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
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
                permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}
            >
                <DataTable<IPermission>
                    actionRef={tableRef}
                    headerTitle="Danh sách Quyền Hạn (Permissions)"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={permissions}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchPermission({ query }))
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
                            <Access
                                permission={ALL_PERMISSIONS.PERMISSIONS.CREATE}
                                hideChildren
                            >
                                <Button
                                    icon={<PlusOutlined />}
                                    type="primary"
                                    onClick={() => setOpenModal(true)}
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
                            </Access>
                        );
                    }}
                />
            </Access>
            <ModalPermission
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDetailPermission
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default PermissionPage;
