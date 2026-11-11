import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import { LockOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
        //đã login => redirect to '/'
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
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <div
                                onClick={() => navigate('/')}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    cursor: "pointer",
                                    marginBottom: 12
                                }}
                            >
                                <FaReact style={{ color: "#2563eb", fontSize: 32 }} />
                                <span style={{
                                    fontSize: 24,
                                    fontWeight: 800,
                                    letterSpacing: "-0.5px",
                                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>
                                    JobHunter
                                </span>
                            </div>
                            <h2 className={`${styles.text} ${styles["text-large"]}`} style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                                Đăng Nhập Tài Khoản
                            </h2>
                            <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
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
                                label={<span style={{ fontWeight: 600, color: "#334155" }}>Email</span>}
                                name="username"
                                rules={[{ required: true, message: 'Email không được để trống!' }]}
                            >
                                <Input
                                    size="large"
                                    prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                                    placeholder="yourname@gmail.com"
                                    style={{ borderRadius: 8 }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: "#334155" }}>Mật khẩu</span>}
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                                    placeholder="••••••••"
                                    style={{ borderRadius: 8 }}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 24, marginBottom: 16 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmit}
                                    size="large"
                                    style={{
                                        width: '100%',
                                        height: 44,
                                        fontWeight: 600,
                                        borderRadius: 8,
                                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                                        border: 'none'
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <Divider style={{ margin: '20px 0', color: '#94a3b8', fontSize: 13 }}>hoặc</Divider>

                            <div style={{ textAlign: "center", fontSize: 14, color: "#475569" }}>
                                Chưa có tài khoản?{' '}
                                <Link to='/register' style={{ color: '#2563eb', fontWeight: 600 }}>
                                    Đăng Ký Ngay
                                </Link>
                            </div>

                            <div style={{ textAlign: "center", marginTop: 16 }}>
                                <Link to='/' style={{ fontSize: 13, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                    <ArrowLeftOutlined style={{ fontSize: 11 }} /> Về trang chủ
                                </Link>
                            </div>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;
