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
        <div className={styles["auth-page"]}>
            <div className={`${styles["auth-card"]} ${styles["register-card"]}`}>
                {/* Brand & Heading */}
                <div className={styles["auth-header"]}>
                    <div
                        onClick={() => navigate('/')}
                        className={styles["auth-brand"]}
                    >
                        <FaReact className={styles["brand-logo"]} />
                        <span className={styles["brand-name"]}>JobHunter</span>
                    </div>

                    <h1 className={styles["auth-title"]}>Đăng Ký Tài Khoản</h1>
                    <p className={styles["auth-subtitle"]}>
                        Bắt đầu hành trình tìm kiếm việc làm IT mơ ước
                    </p>
                </div>

                <Form<IUser>
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Row gutter={[12, 0]}>
                        <Col span={24}>
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Họ và tên</span>}
                                name="name"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input
                                    size="large"
                                    prefix={<UserOutlined style={{ color: '#2563eb', marginRight: 6 }} />}
                                    placeholder="Nguyễn Văn A"
                                    style={{ borderRadius: 10, height: 46 }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Email công việc</span>}
                                name="email"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    type='email'
                                    size="large"
                                    prefix={<MailOutlined style={{ color: '#2563eb', marginRight: 6 }} />}
                                    placeholder="yourname@gmail.com"
                                    style={{ borderRadius: 10, height: 46 }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Mật khẩu</span>}
                                name="password"
                                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined style={{ color: '#2563eb', marginRight: 6 }} />}
                                    placeholder="Tối thiểu 6 ký tự"
                                    style={{ borderRadius: 10, height: 46 }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Tuổi</span>}
                                name="age"
                                rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                            >
                                <Input
                                    type='number'
                                    size="large"
                                    prefix={<NumberOutlined style={{ color: '#2563eb', marginRight: 6 }} />}
                                    placeholder="25"
                                    style={{ borderRadius: 10, height: 46 }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label={<span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Giới tính</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            >
                                <Select
                                    size="large"
                                    placeholder="Chọn giới tính"
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    <Option value="MALE">Nam</Option>
                                    <Option value="FEMALE">Nữ</Option>
                                    <Option value="OTHER">Khác</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label={<span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Địa chỉ</span>}
                                name="address"
                                rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                            >
                                <Input
                                    size="large"
                                    prefix={<EnvironmentOutlined style={{ color: '#2563eb', marginRight: 6 }} />}
                                    placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
                                    style={{ borderRadius: 10, height: 46 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: 10, marginBottom: 14 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                            className={styles["auth-btn-primary"]}
                            style={{ width: '100%' }}
                        >
                            Đăng Ký Tài Khoản
                        </Button>
                    </Form.Item>

                    <Divider style={{ margin: '18px 0', color: '#94a3b8', fontSize: 13 }}>
                        hoặc
                    </Divider>

                    <div style={{ textAlign: "center", fontSize: 14, color: "#475569" }}>
                        Đã có tài khoản JobHunter?{' '}
                        <Link to='/login' style={{ color: '#2563eb', fontWeight: 700 }}>
                            Đăng Nhập
                        </Link>
                    </div>

                    <div style={{ textAlign: "center", marginTop: 20 }}>
                        <Link to='/' className={styles["auth-back-link"]}>
                            <ArrowLeftOutlined style={{ fontSize: 11 }} /> Quay về trang chủ
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default RegisterPage;
