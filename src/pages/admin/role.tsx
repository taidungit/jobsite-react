import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IPermission, IRole } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import { callDeleteRole, callFetchPermission } from "@/config/api";
import queryString from 'query-string';
import { fetchRole } from "@/redux/slice/roleSlide";
import ModalRole from "@/components/admin/role/modal.role";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";
import { sfLike } from "spring-filter-query-builder";
import { groupByPermission } from "@/config/utils";

const RolePage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.role.isFetching);
    const meta = useAppSelector(state => state.role.meta);
    const roles = useAppSelector(state => state.role.result);
    const dispatch = useAppDispatch();

    //all backend permissions
    const [listPermissions, setListPermissions] = useState<{
        module: string;
        permissions: IPermission[]
    }[] | null>(null);

    //current role
    const [singleRole, setSingleRole] = useState<IRole | null>(null);

    useEffect(() => {
        const init = async () => {
            const res = await callFetchPermission(`page=1&size=100`);
            if (res.data?.result) {
                setListPermissions(groupByPermission(res.data?.result))
            }
        }
        init();
    }, [])

    const handleDeleteRole = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteRole(id);
            if (res && res.statusCode === 200) {
                message.success('Xóa Role thành công');
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

    const columns: ProColumns<IRole>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 220,
            render: (text, record) => {
                return (
                    <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, color: '#475569', fontSize: 13 }}>
                        {record.id}
                    </code>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Tên Vai Trò',
            dataIndex: 'name',
            sorter: true,
            render: (text) => <span style={{ fontWeight: 600, color: '#0f172a' }}>{text}</span>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render(dom, entity) {
                return (
                    <Tag color={entity.active ? "success" : "error"} style={{ borderRadius: 6, fontWeight: 600 }}>
                        {entity.active ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'createdAt',
            width: 180,
            sorter: true,
            render: (text, record) => {
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
            render: (text, record) => {
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
            render: (_value, entity) => (
                <Space size="middle">
                    <Access
                        permission={ALL_PERMISSIONS.ROLES.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 18,
                                color: '#d97706',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setSingleRole(entity);
                                setOpenModal(true);
                            }}
                            title="Chỉnh sửa vai trò"
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.ROLES.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa role"}
                            description={"Bạn có chắc chắn muốn xóa role này ?"}
                            onConfirm={() => handleDeleteRole(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined
                                style={{
                                    fontSize: 18,
                                    color: '#ef4444',
                                    cursor: 'pointer'
                                }}
                                title="Xóa vai trò"
                            />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        if (clone.name) clone.name = `${sfLike("name", clone.name)}`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name,asc" : "sort=name,desc";
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
                permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}
            >
                <DataTable<IRole>
                    actionRef={tableRef}
                    headerTitle="Danh sách Vai Trò (Roles)"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={roles}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchRole({ query }))
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
                        );
                    }}
                />
            </Access>
            <ModalRole
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                listPermissions={listPermissions}
                singleRole={singleRole}
                setSingleRole={setSingleRole}
            />
        </div>
    )
}

export default RolePage;
