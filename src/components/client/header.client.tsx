import { useState, useEffect } from 'react';
import { CodeOutlined, ContactsOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined, RiseOutlined, TwitterOutlined } from '@ant-design/icons';
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from 'antd';
import { Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc Làm IT</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/company'}>Top Công ty IT</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        }
    ];

    const onClick: MenuProps['onClick'] = (e: any) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer', display: 'block', width: '100%' }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        ...(user.role?.permissions?.length ? [{
            label: <Link
                to={"/admin"}
                style={{ display: 'block', width: '100%' }}
            >Trang Quản Trị</Link>,
            key: 'admin',
            icon: <FireOutlined />
        },] : []),

        {
            label: <label
                style={{ cursor: 'pointer', display: 'block', width: '100%', color: '#ef4444' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined style={{ color: '#ef4444' }} />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]}>
                <div className={styles["container"]}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 32, alignItems: "center", height: "100%" }}>
                            <div
                                className={styles['brand']}
                                onClick={() => navigate('/')}
                                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                            >
                                <FaReact title='JobHunter' />
                                <span style={{
                                    fontWeight: 800,
                                    fontSize: 20,
                                    letterSpacing: "-0.5px",
                                    color: "#fff",
                                    background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>
                                    JobHunter
                                </span>
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#3b82f6',
                                            colorBgContainer: 'transparent',
                                            colorText: '#cbd5e1',
                                            fontSize: 14,
                                        },
                                    }}
                                >
                                    <Menu
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                        style={{ background: 'transparent', borderBottom: 'none', minWidth: 320 }}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <Link
                                            to={'/login'}
                                            style={{
                                                padding: '8px 20px',
                                                borderRadius: '8px',
                                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                                color: '#fff',
                                                fontWeight: 600,
                                                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                                                display: 'inline-block',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            Đăng Nhập
                                        </Link>
                                        :
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']} placement="bottomRight">
                                            <Space style={{
                                                cursor: "pointer",
                                                padding: "6px 14px",
                                                borderRadius: 24,
                                                background: "rgba(255, 255, 255, 0.08)",
                                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                                transition: "all 0.2s ease"
                                            }}>
                                                <Avatar style={{
                                                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                                                    fontWeight: 600,
                                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                                                }}>
                                                    {user?.name?.substring(0, 2)?.toUpperCase()}
                                                </Avatar>
                                                <span style={{ color: "#f8fafc", fontWeight: 500, fontSize: 14 }}>
                                                    {user?.name}
                                                </span>
                                            </Space>
                                        </Dropdown>
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                            <div
                                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                                onClick={() => navigate('/')}
                            >
                                <FaReact style={{ color: '#3b82f6', fontSize: 24 }} />
                                <span style={{
                                    fontWeight: 800,
                                    fontSize: 18,
                                    background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>
                                    JobHunter
                                </span>
                            </div>
                            <MenuFoldOutlined
                                onClick={() => setOpenMobileMenu(true)}
                                style={{ fontSize: 22, color: '#f8fafc', padding: 8, cursor: 'pointer' }}
                            />
                        </div>
                    }
                </div>
            </div>
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FaReact style={{ color: '#2563eb', fontSize: 20 }} />
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>Menu Chức Năng</span>
                    </div>
                }
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                    style={{ border: 'none' }}
                />
            </Drawer>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    )
};

export default Header;
