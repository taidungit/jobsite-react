import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    ApiOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AliwangwangOutlined,
    ScheduleOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button, ConfigProvider } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { callLogout } from 'config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { ALL_PERMISSIONS } from '@/config/permissions';
import { FaReact } from 'react-icons/fa';

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const user = useAppSelector(state => state.account.user);

    const permissions = useAppSelector(state => state.account.user.role.permissions);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;
        if (permissions?.length || ACL_ENABLE === 'false') {

            const viewCompany = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
            )

            const viewUser = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )

            const viewJob = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
            )

            const viewResume = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
            )

            const viewRole = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
            )

            const viewPermission = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )

            const full = [
                {
                    label: <Link to='/admin'>Dashboard</Link>,
                    key: '/admin',
                    icon: <AppstoreOutlined style={{ fontSize: 16 }} />
                },
                ...(viewCompany || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/company'>Company</Link>,
                    key: '/admin/company',
                    icon: <BankOutlined style={{ fontSize: 16 }} />,
                }] : []),

                ...(viewUser || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/user'>User</Link>,
                    key: '/admin/user',
                    icon: <UserOutlined style={{ fontSize: 16 }} />
                }] : []),
                ...(viewJob || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/job'>Job</Link>,
                    key: '/admin/job',
                    icon: <ScheduleOutlined style={{ fontSize: 16 }} />
                }] : []),

                ...(viewResume || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/resume'>Resume</Link>,
                    key: '/admin/resume',
                    icon: <AliwangwangOutlined style={{ fontSize: 16 }} />
                }] : []),
                ...(viewPermission || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/permission'>Permission</Link>,
                    key: '/admin/permission',
                    icon: <ApiOutlined style={{ fontSize: 16 }} />
                }] : []),
                ...(viewRole || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/role'>Role</Link>,
                    key: '/admin/role',
                    icon: <ExceptionOutlined style={{ fontSize: 16 }} />
                }] : []),
            ];

            setMenuItems(full);
        }
    }, [permissions])

    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer', display: 'block', width: '100%', color: '#ef4444' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#2563eb',
                }
            }}
        >
            <Layout style={{ minHeight: '100vh', background: '#f8fafc' }} className="layout-admin">
                {!isMobile ?
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value: boolean) => setCollapsed(value)}
                        width={240}
                        style={{
                            borderRight: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            position: 'sticky',
                            top: 0,
                            height: '100vh',
                            zIndex: 100
                        }}
                    >
                        <div style={{
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: collapsed ? '0' : '0 20px',
                            gap: 10,
                            borderBottom: '1px solid #f1f5f9'
                        }}>
                            <FaReact style={{ color: '#2563eb', fontSize: 26, minWidth: 26 }} />
                            {!collapsed && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                                        JobHunter
                                    </span>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Admin Panel
                                    </span>
                                </div>
                            )}
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e: any) => setActiveMenu(e.key)}
                            style={{
                                borderRight: 'none',
                                padding: '12px 8px',
                                fontWeight: 500
                            }}
                        />
                    </Sider>
                    :
                    <div style={{
                        background: '#ffffff',
                        borderBottom: '1px solid #e2e8f0',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1000
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderBottom: '1px solid #f1f5f9'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaReact style={{ color: '#2563eb', fontSize: 22 }} />
                                <span style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>Admin Portal</span>
                            </div>
                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Avatar style={{ background: '#2563eb', cursor: 'pointer' }}>
                                    {user?.name?.substring(0, 2)?.toUpperCase()}
                                </Avatar>
                            </Dropdown>
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            items={menuItems}
                            onClick={(e: any) => setActiveMenu(e.key)}
                            mode="horizontal"
                            style={{ overflowX: 'auto', borderBottom: 'none' }}
                        />
                    </div>
                }

                <Layout style={{ background: '#f8fafc' }}>
                    {!isMobile &&
                        <div
                            className='admin-header'
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "0 28px",
                                height: 64,
                                background: "#ffffff",
                                borderBottom: "1px solid #e2e8f0",
                                position: "sticky",
                                top: 0,
                                zIndex: 99
                            }}
                        >
                            <Button
                                type="text"
                                icon={collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined)}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '18px',
                                    width: 42,
                                    height: 42,
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#475569'
                                }}
                            />

                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']} placement="bottomRight">
                                <Space style={{
                                    cursor: "pointer",
                                    padding: "6px 14px",
                                    borderRadius: 10,
                                    border: "1px solid #e2e8f0",
                                    background: "#f8fafc",
                                    transition: "all 0.2s ease"
                                }}>
                                    <Avatar style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", fontWeight: 600 }}>
                                        {user?.name?.substring(0, 2)?.toUpperCase()}
                                    </Avatar>
                                    <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                                        <span style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", lineHeight: 1.2 }}>
                                            {user?.name}
                                        </span>
                                        <span style={{ fontSize: 11, color: "#64748b" }}>
                                            {user?.role?.name || "Administrator"}
                                        </span>
                                    </div>
                                </Space>
                            </Dropdown>
                        </div>
                    }
                    <Content style={{ padding: isMobile ? '16px' : '28px', maxWidth: 1600, margin: '0 auto', width: '100%' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default LayoutAdmin;
