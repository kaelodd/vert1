import { Avatar, Button, Card, Col, Descriptions, Form, Input, InputNumber, Modal, Popconfirm, Row, Space, Spin, Statistic, Table, Tabs, Tag, Typography, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getUsers } from '../../services/user';
import { fetchDatas, getSector, removeSector } from '../../services/resources';
import { useNavigate } from 'react-router-dom';
import { TeamOutlined, ShopOutlined, UserOutlined, IdcardOutlined, ClusterOutlined } from '@ant-design/icons';
import { useStateContext } from '../../contexts/ContextProvider';
import BDRTable from '../BDR/BDRTable';
import Notification from '../Notification';
import Meta from 'antd/es/card/Meta';
import moment from 'moment';
import { getSectorAccounts, getSectorAssets, getSectorById } from '../../services/sectors';


const SectorView = ({ search, sector_id }) => {
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const { currentSector, setCurrentSector, user, userRole, pocs, setPocs, assets, setAssets } = useStateContext();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [bdrs, setBdrs] = useState([]);
    const tableColumns = [
        {
            title: 'SN',
            dataIndex: 'key',
            editable: false,
            // responsive: ['md'],
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            //   width: '15%',
            editable: false,
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            //   width: '15%',
            editable: false,
        },
        {
            title: 'BDRID',
            dataIndex: 'bdrId',
            editable: false,
            // responsive: ['md'],
        },
        {
            title: 'Sector Code',
            dataIndex: 'sector_code',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Country',
            dataIndex: 'country',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'role',
            dataIndex: 'role',
            width: '15%',
            editable: false,
            // responsive: ['md'],
            render: (_, { role }) => (
                <>
                    {<Tag color={role == 'admin' ? 'red' : 'blue'} key={role}>
                        {role.toUpperCase()}
                    </Tag>}
                </>
            ),
        },
        // {
        //     title: 'Action',
        //     dataIndex: 'operation',
        //     render: (_, record) => {
        //         return (
        //             <span>
        //                 <Typography.Link
        //                     onClick={() => null}
        //                     style={{
        //                         marginRight: 8,
        //                     }}
        //                 >
        //                     Save
        //                 </Typography.Link>
        //                 <Popconfirm title="Sure to cancel?" onConfirm={() => null}>
        //                     <Button color='red' danger>remove</Button>
        //                 </Popconfirm>
        //             </span>
        //         );
        //     },
        // },
    ];

    const pocsTableColumns = [
        {
            title: 'SN',
            dataIndex: 'key',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Account Name',
            dataIndex: 'accountName',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Account Owner',
            dataIndex: 'accountOwnerFirstName',
            editable: false,
            render: (_, { accountOwnerFirstName, accountOwnerLastName }) => (
                <>
                    {`${accountOwnerFirstName} ${accountOwnerLastName}`}
                </>
            ),
        },
        {
            title: 'SAP Number',
            dataIndex: 'sapNumber',
            editable: false,
        },
        {
            title: 'Location',
            dataIndex: 'longitude',
            editable: false,
            render: (_, { longitude, latitude }) => (
                <>
                    {`${longitude}, ${latitude}`}
                </>
            ),
        },
        {
            title: 'Country',
            dataIndex: 'country',
            editable: false,
            render: (_, { country }) => (
                <>
                   <Tag name="country" color="blue"><strong>{country}</strong></Tag>
                </>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_, record) => {
                return (
                    <span>
                        <Popconfirm title="Sure to remove from Sector?" onConfirm={() => null}>
                            <Button color='red' danger>remove</Button>
                        </Popconfirm>
                    </span>
                );
            },
        },
    ];

    const assetsTableColumns = [
        {
            title: 'SN',
            dataIndex: 'key',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Code',
            dataIndex: 'assetCode',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'MF Serial',
            dataIndex: 'manufacturerSerialNumber',
            editable: false,
        },
        {
            title: 'Account Name',
            dataIndex: 'accountName',
            editable: false,
        },
        {
            title: 'Description',
            dataIndex: 'assetDescription',
            editable: false,
        },
        {
            title: 'SAP Number',
            dataIndex: 'sapNumber',
            editable: false,
        },
        {
            title: 'Location',
            dataIndex: 'longitude',
            editable: false,
            render: (_, { longitude, latitude }) => (
                <>
                    {`${longitude}, ${latitude}`}
                </>
            ),
        },
        {
            title: 'Installation Date',
            dataIndex: 'installationDate',
            editable: false,
        },
        // {
        //     title: 'Action',
        //     dataIndex: 'operation',
        //     render: (_, record) => {
        //         return (
        //             <span>
        //                 <Popconfirm title="Sure to remove from Sector?" onConfirm={() => null}>
        //                     <Button color='red' danger>remove</Button>
        //                 </Popconfirm>
        //             </span>
        //         );
        //     },
        // },
    ];

    const tabItems = [
        {
            key: '1',
            label: (
                <span>
                    <TeamOutlined />
                    BDRs
                </span>
            ),
            children: (<Table
                size='large'
                loading={loading}
                bordered
                dataSource={bdrs}
                columns={tableColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: () => null,
                }}
                style={{ overflowX: 'scroll' }}
            />),
        },
        {
            key: '2',
            label: (
                <span>
                    <IdcardOutlined />
                    Accounts
                </span>
            ),
            children: (<Table
                size='large'
                loading={loading}
                bordered
                dataSource={pocs}
                columns={pocsTableColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: () => null,
                }}
                style={{ overflowX: 'scroll' }}
            />),
        },
        {
            key: '3',
            label: (
                <span>
                    <ShopOutlined />
                    Assets
                </span>
            ),
            children: (<Table
                size='large'
                loading={loading}
                bordered
                dataSource={assets}
                columns={assetsTableColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: () => null,
                }}
                style={{ overflowX: 'scroll' }}
            />),
        }
    ];

    const fetchSectorBdrs = (sectorId) => {
        if (!sectorId) return;

        setLoading(true);
        getUsers({}).then((res) => {
            setLoading(false);
            let result = res?.data?.results || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            setBdrs(tempResult);
        }).catch((error) => {
            setLoading(false);
        });
    }

    const fetchSectorAccounts = (sectorCode) => {
        if (!sectorCode) return;

        setLoading(true);
        getSectorAccounts(sectorCode).then((res) => {
            setLoading(false);
            let result = res?.data?.data || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            console.log('Accounts: ', tempResult);
            setPocs(tempResult);
        }).catch((error) => {
            setLoading(false);
        });
    }

    const fetchSectorAssets = (sectorCode) => {
        if (!sectorCode) return;

        setLoading(true);
        getSectorAssets(sectorCode).then((res) => {
            setLoading(false);
            let result = res?.data?.data || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            console.log('Assets: ', tempResult);
            setAssets(tempResult);
        }).catch((error) => {
            setLoading(false);
        });
    }

    const fetchData = (id) => {
        if (id) {
            getSectorById(id).then((res) => {
                setLoading(false);
                let result = res?.data?.data || null;
                const tempResult = result;
                setCurrentSector(tempResult);
                setData(tempResult);
                if (tempResult.code) {
                    console.info('Sector Code: ', tempResult.code);
                    fetchSectorAccounts(tempResult?.code || null);
                    fetchSectorAssets(tempResult?.code || null);
                }
                // Load BDRs and POCs
                fetchSectorBdrs(sector_id);
            }).catch(error => {
                setLoading(false);
                console.log('Error: ', error);
            });
        }
    }

    const deleteSector = (record) => {
        if (record) {
            modal.confirm({
                title: 'Confirm Delete!',
                content: 'Are you sure you want to delete this sector?',
                onOk: () => {
                    setLoading(true);
                    removeSector(record?.id || null).then(() => {
                        setLoading(false);
                        fetchData();
                        notification.success({ type: 'success', message: 'Operation completed successfully' });
                        setTimeout(() => {
                            navigate('/sectors');
                        }, 1000);
                    }).catch((eror) => {
                        setLoading(false);
                        notification.error({ type: 'error', message: 'Operation failed!' });
                    });
                },
                onCancel: () => {
                    console.log('Operation Aborted!', record);
                },
            });
        }
    }

    const formatDate = (date) => {
        return moment(date).format('DD MMM, YYYY');
    };

    useEffect(() => {
        if (sector_id && !data) {
            fetchData(sector_id);
        }
    }, [sector_id]);

    return (
        <>
            <Notification ref={notificationRef} />
            <Spin spinning={loading} delay={500}>
                {contextHolder}
                <Row gutter={16} className='mb-10'>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Meta
                                // avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                                avatar={<ClusterOutlined width={'100%'} height={400}/>}
                                title={currentSector?.name || ''}
                                description={currentSector?.description || ''}
                            />
                            <hr className='my-3' style={{ opacity: '0.2' }} />
                            <Descriptions title="Sector Details"
                                size={'default'}
                            // extra={<Button type="primary">Edit</Button>}
                            >
                                <Descriptions.Item label="Name">{`${currentSector?.name || ''}`}</Descriptions.Item>
                                <Descriptions.Item label="Code">{`${currentSector?.code || ''}`}</Descriptions.Item>
                                <Descriptions.Item label="Country">{currentSector?.country || ''}</Descriptions.Item>
                                <Descriptions.Item label="Last Updated">{formatDate(currentSector?.updated_at) || ''}</Descriptions.Item>
                                <Descriptions.Item label="Supervisor">{`${currentSector?.adminFirstName || ''} ${currentSector?.adminLastName}`}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8} xs={24} md={8} style={{ marginBottom: '5px' }}>
                        <Card bordered={false}>
                            <Statistic
                                title="Total BDRs"
                                value={currentSector?.totalUsers || 'NA'}
                                valueStyle={{
                                    color: '#3f8600',
                                }}
                                prefix={<TeamOutlined className='mr-3' />}
                            />
                        </Card>
                    </Col>
                    <Col span={8} xs={24} md={8} style={{ marginBottom: '5px' }}>
                        <Card bordered={false}>
                            <Statistic
                                title="Total POC Accounts"
                                value={currentSector?.totalAccounts || 'NA'}
                                valueStyle={{
                                    color: '#FF1322',
                                }}
                                prefix={<UserOutlined className='mr-3' />}
                            />
                        </Card>
                    </Col>
                    <Col span={8} xs={24} md={8} style={{ marginBottom: '5px' }}>
                        <Card bordered={false}>
                            <Statistic
                                title="Total Assets"
                                value={currentSector?.totalAssets || 'NA'}
                                valueStyle={{
                                    color: 'blue',
                                }}
                                prefix={<ShopOutlined className='mr-3' />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Tabs
                    className='mt-5'
                    defaultActiveKey="1"
                    items={tabItems}
                />
            </Spin>
        </>
    );
};
export default SectorView;