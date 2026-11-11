import styles from '@/styles/client.module.scss';
import { FaReact } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
            <footer className={styles['footer-section']}>
                <div className={styles['container']}>
                    <div className={styles['footer-content']}>
                        <div className={styles['footer-brand']}>
                            <h3>
                                <FaReact /> JobHunter
                            </h3>
                            <p>
                                Nền tảng kết nối cơ hội việc làm IT hàng đầu dành cho Developer chất lượng cao tại Việt Nam. Tìm kiếm công việc mơ ước với mức đãi ngộ hấp dẫn.
                            </p>
                        </div>

                        <div className={styles['footer-links']}>
                            <h4>Khám Phá</h4>
                            <ul>
                                <li><Link to="/job">Việc làm IT mới nhất</Link></li>
                                <li><Link to="/company">Top công ty công nghệ</Link></li>
                                <li><Link to="/">Tìm việc theo kỹ năng</Link></li>
                            </ul>
                        </div>

                        <div className={styles['footer-links']}>
                            <h4>Dành Cho Ứng Viên</h4>
                            <ul>
                                <li><Link to="/login">Đăng nhập tài khoản</Link></li>
                                <li><Link to="/register">Tạo hồ sơ ứng tuyển</Link></li>
                                <li><Link to="/job">Cơ hội việc làm</Link></li>
                            </ul>
                        </div>

                        <div className={styles['footer-links']}>
                            <h4>Liên Hệ</h4>
                            <ul>
                                <li><span>Hotline: 1900 6868</span></li>
                                <li><span>Email: contact@jobhunter.vn</span></li>
                                <li><span>Hà Nội &bull; TP. Hồ Chí Minh &bull; Đà Nẵng</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles['footer-bottom']}>
                        <div>&copy; {new Date().getFullYear()} JobHunter. All rights reserved. Nền tảng kết nối nhân tài công nghệ.</div>
                    </div>
                </div>
            </footer>
            );
};

            export default Footer;
