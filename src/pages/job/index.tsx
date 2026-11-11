import SearchClient from '@/components/client/search.client';
import { Breadcrumb, Col, Row } from 'antd';
import styles from 'styles/client.module.scss';
import JobCard from '@/components/client/card/job.card';
import { HomeOutlined, CodeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ClientJobPage = (props: any) => {
    return (
        <div style={{ padding: '24px 0 60px', background: '#f8fafc', minHeight: '80vh' }}>
            <div className={styles["container"]}>
                <Breadcrumb
                    items={[
                        {
                            title: <Link to="/"><HomeOutlined /> Trang chủ</Link>,
                        },
                        {
                            title: <span><CodeOutlined /> Danh sách việc làm IT</span>,
                        },
                    ]}
                    style={{ marginBottom: 20 }}
                />

                <Row gutter={[24, 28]}>
                    <Col span={24}>
                        <SearchClient />
                    </Col>

                    <Col span={24}>
                        <JobCard
                            showPagination={true}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ClientJobPage;
