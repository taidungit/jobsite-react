import { Breadcrumb, Col, Row } from 'antd';
import styles from 'styles/client.module.scss';
import CompanyCard from '@/components/client/card/company.card';
import { HomeOutlined, BankOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ClientCompanyPage = (props: any) => {
    return (
        <div style={{ padding: '24px 0 60px', background: '#f8fafc', minHeight: '80vh' }}>
            <div className={styles["container"]}>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/"><HomeOutlined /> Trang chủ</Link>,
                        },
                        {
                            title: <span><BankOutlined /> Danh sách công ty IT</span>,
                        },
                    ]}
                    style={{ marginBottom: 24 }}
                />

                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <CompanyCard
                            showPagination={true}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ClientCompanyPage;
