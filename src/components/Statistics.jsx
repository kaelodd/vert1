import { useEffect, useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, ShopOutlined, UserOutlined, BarcodeOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import { Card, Col, Row, Skeleton, Spin, Statistic } from 'antd';

import { getAssetReport } from '../services/assets';
import moment from 'moment';
import { getUsers } from '../services/user';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
const App = ({ dateRange }) => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bdrs, setBdrs] = useState(null);
    const { userRole } = useStateContext();
    const navigate = useNavigate();


    const showSkeleton = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    const fetchData = () => {
        setLoading(false);
        getAssetReport({ startDate: startDate, endDate: endDate }).then(res => {
            // console.log('Report loaded: ', res.data.results);
            setReport(res?.data?.results ?? null);
            setLoading(false);
        }).catch(error => {
            console.log('Error: ', error);
            setLoading(false);
        });

        getUsers({}).then((res) => {
            setLoading(false);
            let result = res?.data?.results || [];
            setBdrs(result.filter(v => v.role !== 'admin'));
            return;
        }).catch((error) => {
            setLoading(false);
        });
    }
    useEffect(() => {
        showSkeleton();
        if (dateRange) {
            fetchData();
        }
        if (dateRange && !startDate || !endDate) {
            setStartDate(dateRange?.[0] || moment().format('YYYY-MM-DD'))
            setEndDate(dateRange?.[1] || moment().format('YYYY-MM-DD'))
        }
    }, [dateRange]);

    useEffect(() => {

    }, [userRole]);

    return (
        <Row gutter={16} className='noselect'>
            <Col onClick={() => navigate('/assets')} span={6} xs={12} md={userRole == 'admin' ? 6 : 8} style={{ marginBottom: '5px', cursor: 'pointer' }}>
                <Spin spinning={loading} delay={500}>
                    <Card size='small' bordered>
                        <Statistic title="Assets" value={report?.total ?? 'NA'} prefix={<ShopOutlined />} />
                    </Card>
                </Spin>
            </Col>


            {userRole == 'admin' && <Col onClick={() => navigate('/bdrs')} span={6} xs={12} md={userRole == 'admin' ? 6 : 8} style={{ marginBottom: '5px', cursor: 'pointer' }}>
                <Spin spinning={loading} delay={500}>
                    <Card size='small' bordered>
                        <Statistic
                            title="BDRs"
                            value={bdrs?.length ?? 'NA'}
                            valueStyle={{
                                color: 'orange',
                            }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Spin>
            </Col>}


            <Col onClick={() => navigate('/assets')} span={6} xs={12} md={userRole == 'admin' ? 6 : 8} style={{ marginBottom: '5px', cursor: 'pointer' }}>
                <Spin spinning={loading} delay={500}>
                    <Card size='small' bordered>
                        <Statistic
                            title="Verified Assets"
                            value={report?.verified ?? 'NA'}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            prefix={<BarcodeOutlined />}
                        />
                    </Card>
                </Spin>
            </Col>


            <Col span={6} xs={12} md={userRole == 'admin' ? 6 : 8} style={{ marginBottom: '5px' }}>
                <Spin spinning={loading} delay={500}>
                    <Card size='small' bordered>
                        <Statistic
                            title="Issues"
                            value={2}
                            valueStyle={{
                                color: '#cf1322',
                            }}
                            prefix={<IssuesCloseOutlined />}
                        />
                    </Card>
                </Spin>
            </Col>

        </Row>
    );
}
export default App;