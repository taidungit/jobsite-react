import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import { LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { FaReact } from 'react-icons/fa';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    useEffect(() => {
        // Đã login => redirect to '/'
        if (isAuthenticated) {
            window.location.href = '/';
        }
    }, [])

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user))
            message.success('Đăng nhập tài khoản thành công!');
            window.location.href = callback ? callback : '/';
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    return (
        <div className={styles["auth-page"]}>
            <div className={styles["auth-card"]}>
                {/* Brand & Heading */}
                <div className={styles["auth-header"]}>
                    <div
                        onClick={() => navigate('/')}
                        className={styles["auth-brand"]}
                    >
                        <FaReact className={styles["brand-logo"]} />
                        <span className={styles["brand-name"]}>JobHunter</span>
                    </div>

                    <h1 className={styles["auth-title"]}>Đăng Nhập Tài Khoản</h1>
                    <p className={styles["auth-subtitle"]}>
                        Chào mừng bạn quay trở lại với JobHunter
                    </p>
                </div>

                <Form
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Email công việc</span>}
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<MailOutlined style={{ color: '#2563eb', marginRight: 6 }} />}
                            placeholder="yourname@gmail.com"
                            style={{
                                borderRadius: 10,
                                height: 46,
                                fontSize: 14
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Mật khẩu</span>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined style={{ color: '#2563eb', marginRight: 6 }} />}
                            placeholder="••••••••"
                            style={{
                                borderRadius: 10,
                                height: 46,
                                fontSize: 14
                            }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 22, marginBottom: 14 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                            className={styles["auth-btn-primary"]}
                            style={{ width: '100%' }}
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>

                    <Divider style={{ margin: '20px 0', color: '#94a3b8', fontSize: 13 }}>
                        hoặc
                    </Divider>

                    <div style={{ textAlign: "center", fontSize: 14, color: "#475569" }}>
                        Chưa có tài khoản JobHunter?{' '}
                        <Link to='/register' style={{ color: '#2563eb', fontWeight: 700 }}>
                            Đăng Ký Ngay
                        </Link>
                    </div>

                    <div style={{ textAlign: "center", marginTop: 22 }}>
                        <Link to='/' className={styles["auth-back-link"]}>
                            <ArrowLeftOutlined style={{ fontSize: 11 }} /> Quay về trang chủ
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default LoginPage;
