import { Avatar, Button, Card, Col, Descriptions, Form, Input, InputNumber, Modal, Popconfirm, Row, Space, Spin, Statistic, Table, Tabs, Tag, Typography, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getUserById, getUsers } from '../../services/user';
import { fetchDatas, getCountries, getSector, removeSector } from '../../services/resources';
import { useNavigate } from 'react-router-dom';
import { TeamOutlined, ShopOutlined, UserOutlined, BookOutlined, IdcardOutlined, ClusterOutlined } from '@ant-design/icons';
import { useStateContext } from '../../contexts/ContextProvider';
import BDRTable from '../BDR/BDRTable';
import Notification from '../Notification';
import Meta from 'antd/es/card/Meta';
import moment from 'moment';
import { getSectorAccounts, getSectorAssets, getSectorById } from '../../services/sectors';


const BdrView = ({ search, id }) => {
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const { user, userRole, bdr, setBdr, countries, setCountries } = useStateContext();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [bdrs, setBdrs] = useState([]);


    const fetchData = (id) => {
        if (id) {
            getUserById(id).then((res) => {
                setLoading(false);
                console.log('Response: ', res?.data?.results || null);
                let result = res?.data?.results || null;
                result.name = `${result?.firstName || ''} ${result?.lastName || ''}`;
                const tempResult = result;
                setBdr(tempResult);
                setData(tempResult);
            }).catch(error => {
                setLoading(false);
                console.log('Error: ', error);
            });
        }
    }
    // fetch all the countries
    const fetchCountries = () => {
        try {
            getCountries().then((res) => {
                const tempResults = res?.data?.results || [];
                setCountries(tempResults || []);
            }).catch((err) => {
                console.log(err);
            });
        } catch (error) {
            console.log(error);
        }
    };

    // get country name by code
    const getCountryName = (code) => {
        if (!countries || countries.length === 0) return;
        if(!code) return;
        const country = countries.find((item) => item.code === code);
        return country?.name || '';
    };

    const formatDate = (date) => {
        return moment(date).format('DD MMM, YYYY');
    };

    useEffect(() => {
        if (id && !data) {
            fetchData(id);
        }
        if (!countries || countries.length === 0) {
            fetchCountries();
        }
    }, [id]);

    return (
        <>
            <Notification ref={notificationRef} />
            <Spin spinning={loading} delay={500}>
                {contextHolder}
                <Row gutter={16} className='mb-10'>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Meta
                                avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                                title={bdr?.name || ''}
                                description={getCountryName(bdr?.country || '') || ''}
                            />
                            <hr className='my-3' style={{ opacity: '0.2' }} />
                            <Descriptions title="User Details"
                                size={'default'}
                            // extra={<Button type="primary">Edit</Button>}
                            >
                                <Descriptions.Item label="Name">{`${bdr?.name || ''}`}</Descriptions.Item>
                                <Descriptions.Item label="Sector">{`${bdr?.sectorName || ''}`}</Descriptions.Item>
                                <Descriptions.Item label="Country">{ getCountryName(bdr?.country || '') || ''}</Descriptions.Item>
                                <Descriptions.Item label="Date Added">{formatDate(bdr?.registeredOn || null) || ''}</Descriptions.Item>
                                <Descriptions.Item label="Role"><Tag color='blue'>{`${bdr?.role?.toString()?.toUpperCase() || ''}`}</Tag></Descriptions.Item>
                                {!(bdr?.role == 'admin') && <Descriptions.Item label="Supervisor">{`${bdr?.adminFirstName || ''} ${bdr?.adminLastName}`}</Descriptions.Item>}
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8} xs={24} md={12} style={{ marginBottom: '5px' }}>
                        <Card bordered={false}>
                            <Statistic
                                title={<strong>Operational Sectors</strong>}
                                value={bdr?.totalSectors ?? 'NA'}
                                valueStyle={{
                                    color: '#3f8600',
                                }}
                                prefix={<ClusterOutlined className='mr-3' />}
                            />
                        </Card>
                    </Col>
                    <Col span={8} xs={24} md={12} style={{ marginBottom: '5px' }}>
                        <Card bordered={false}>
                            <Statistic
                                title={<strong>Total POC Accounts</strong>}
                                value={bdr?.totalAccounts ?? 'NA'}
                                valueStyle={{
                                    color: '#FF1322',
                                }}
                                prefix={<UserOutlined className='mr-3' />}
                            />
                        </Card>
                    </Col>
                    <Col span={8} xs={24} md={12} style={{ marginBottom: '5px' }}>
                        <Card bordered={false}>
                            <Statistic
                                title={<strong>Total Contracts</strong>}
                                value={bdr?.totalContracts ?? 'NA'}
                                valueStyle={{
                                    color: '#FF1322',
                                }}
                                prefix={<BookOutlined className='mr-3' />}
                            />
                        </Card>
                    </Col>
                    <Col span={8} xs={24} md={12} sm={12} style={{ marginBottom: '5px' }}>
                        <Card bordered={false}>
                            <Statistic
                                title={<strong>Total Assets</strong>}
                                value={bdr?.totalAssets ?? 'NA'}
                                valueStyle={{
                                    color: 'blue',
                                }}
                                prefix={<ShopOutlined className='mr-3' />}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </>
    );
};
export default BdrView;