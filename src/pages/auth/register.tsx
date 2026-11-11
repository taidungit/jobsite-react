import { Button, Col, Divider, Form, Input, Row, Select, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from 'config/api';
import styles from 'styles/auth.module.scss';
import { IUser } from '@/types/backend';
import { ArrowLeftOutlined, EnvironmentOutlined, LockOutlined, MailOutlined, NumberOutlined, UserOutlined } from '@ant-design/icons';
import { FaReact } from 'react-icons/fa';
const { Option } = Select;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: IUser) => {
        const { name, email, password, age, gender, address } = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password as string, +age, gender, address);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login')
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
        <div className={styles["register-page"]}>
            <main className={styles.main}>
                <div className={styles.container} style={{ padding: "40px 16px" }}>
                    <section className={styles.wrapper} style={{ maxWidth: "34rem" }}>
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
                                Đăng Ký Tài Khoản
                            </h2>
                            <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                                Bắt đầu hành trình tìm kiếm việc làm mơ ước
                            </p>
                        </div>

                        <Form<IUser>
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Row gutter={[16, 0]}>
                                <Col span={24}>
                                    <Form.Item
                                        label={<span style={{ fontWeight: 600, color: "#334155" }}>Họ tên</span>}
                                        name="name"
                                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                    >
                                        <Input
                                            size="large"
                                            prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                                            placeholder="Nguyễn Văn A"
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label={<span style={{ fontWeight: 600, color: "#334155" }}>Email</span>}
                                        name="email"
                                        rules={[{ required: true, message: 'Email không được để trống!' }]}
                                    >
                                        <Input
                                            type='email'
                                            size="large"
                                            prefix={<MailOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                                            placeholder="yourname@gmail.com"
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label={<span style={{ fontWeight: 600, color: "#334155" }}>Mật khẩu</span>}
                                        name="password"
                                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                    >
                                        <Input.Password
                                            size="large"
                                            prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                                            placeholder="Tối thiểu 6 ký tự"
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label={<span style={{ fontWeight: 600, color: "#334155" }}>Tuổi</span>}
                                        name="age"
                                        rules={[{ required: true, message: 'Tuổi không được để trống!' }]}
                                    >
                                        <Input
                                            type='number'
                                            size="large"
                                            prefix={<NumberOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                                            placeholder="25"
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        name="gender"
                                        label={<span style={{ fontWeight: 600, color: "#334155" }}>Giới tính</span>}
                                        rules={[{ required: true, message: 'Giới tính không được để trống!' }]}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Chọn giới tính"
                                            allowClear
                                            style={{ borderRadius: 8 }}
                                        >
                                            <Option value="MALE">Nam</Option>
                                            <Option value="FEMALE">Nữ</Option>
                                            <Option value="OTHER">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label={<span style={{ fontWeight: 600, color: "#334155" }}>Địa chỉ</span>}
                                        name="address"
                                        rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                                    >
                                        <Input
                                            size="large"
                                            prefix={<EnvironmentOutlined style={{ color: '#94a3b8', marginRight: 4 }} />}
                                            placeholder="Hà Nội, Việt Nam"
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: 16, marginBottom: 16 }}>
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
                                    Đăng ký tài khoản
                                </Button>
                            </Form.Item>

                            <Divider style={{ margin: '20px 0', color: '#94a3b8', fontSize: 13 }}>hoặc</Divider>

                            <div style={{ textAlign: "center", fontSize: 14, color: "#475569" }}>
                                Đã có tài khoản?{' '}
                                <Link to='/login' style={{ color: '#2563eb', fontWeight: 600 }}>
                                    Đăng Nhập
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

export default RegisterPage;
