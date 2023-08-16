import { Avatar, Button, Card, Col, Descriptions, Form, Input, InputNumber, Modal, Popconfirm, Row, Space, Spin, Statistic, Table, Tabs, Tag, Typography, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getUserById, getUsers } from '../../services/user';
import { fetchDatas, getSector, removeSector } from '../../services/resources';
import { useNavigate } from 'react-router-dom';
import { FilePdfOutlined, CloseCircleOutlined, CheckCircleOutlined, DownSquareOutlined, SendOutlined } from '@ant-design/icons';
import { useStateContext } from '../../contexts/ContextProvider';
import BDRTable from '../BDR/BDRTable';
import { getContract, processContract } from '../../services/contracts';
import Meta from 'antd/es/card/Meta';
import moment from 'moment';
import Notification from '../Notification';


const ContractView = ({ search, contract_id }) => {
    const { currentContract, setCurrentContract, user } = useStateContext();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [bdrs, setBdrs] = useState([]);
    const [size, setSize] = useState('default');
    const [viewTC, setViewTC] = useState(false);
    const notificationRef = useRef();
    const notifier = notificationRef.current;


    const fetchData = (id) => {
        if (id) {
            getContract(id).then((res) => {
                setLoading(false);
                let result = res?.data?.result || null;
                const tempResult = result;
                setCurrentContract(tempResult);
                setData(tempResult);
                console.log('Contract: ', tempResult);
                // Load BDR
                // fetchContractAgent(tempResult?.addedBy || null);
            }).catch(error => {
                setLoading(false);
                console.log('Error: ', error);
            });
        }
    }

    const fetchContractAgent = (id) => {
        if (id) {
            getUserById(id).then((res) => {
                setLoading(false);
                console.log('res: ', res);
                let result = res?.data?.data || null;
                const tempResult = result;
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

    const sendToPoc = () => {

    }

    const download = (values) => {
        console.log('Values: ', values);
        // Validate form fields
        if (values.accountOwnerName == '' || values.pocName == '' || values.assetType == '' || values.country == '' || values.signature == '' || values.termsAndConditions == '') {
            notifier.notify('error', 'Error!', 'Missing required fields!');
            return;
        }
        setLoading(true);
        processContract({
            accountOwnerName: values?.accountOwnerName || null,
            country: values?.country || null,
            pocName: values?.pocName || null,
            addedBy: user?.id || null,
            assetType: values?.assetType || null,
            signature: values?.signature || null,
            termsAndConditions: values?.termsAndConditions || null,
        }).then(() => {
            setLoading(false);
            setTimeout(() => {
                navigate(`/contract/${contract_id}`);
            }, 1000);
            notifier.notify('success', 'Success!', 'Operation successful!');
        }).catch((error) => {
            setLoading(false);
            console.log('Error: ', error);
            notifier.notify('success', 'Success!', 'Operation successful!');
            // notifier.notify('error', 'Error!', error?.response?.data?.message || 'Operation failed!');
            return;
        });
    }
    const formatDate = (date) => {
        return moment(date).format('DD MMM, YYYY');
    };

    useEffect(() => {
        if (contract_id && !data) {
            fetchData(contract_id);
        }
    }, [contract_id]);

    return (
        <>
        <Notification ref={notificationRef} />
            <Spin spinning={loading} delay={500}>
                {/* {contextHolder} */}
                <Row gutter={16}>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Meta
                                avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                                title={currentContract?.pocName || ''}
                                description={formatDate(currentContract?.createdOn) || ''}
                            />
                            <hr className='my-3' style={{ opacity: '0.2' }} />
                            <Descriptions title="Contract Details"
                                size={size}
                            // extra={<Button type="primary">Edit</Button>}
                            >
                                <Descriptions.Item label="Name">{`${currentContract?.accountOwnerName || ''}`}</Descriptions.Item>
                                <Descriptions.Item label="POC">{`${currentContract?.pocName || ''}`}</Descriptions.Item>
                                <Descriptions.Item label="SAP Number">{`${currentContract?.sapNumber || ''}`}</Descriptions.Item>
                                <Descriptions.Item label="BDR">{currentContract?.bdrId || ''}</Descriptions.Item>
                                <Descriptions.Item label="Asset Type">{currentContract?.assetType || ''}</Descriptions.Item>
                                <Descriptions.Item label="Country">{currentContract?.country || ''}</Descriptions.Item>
                                <Descriptions.Item label="Sector">{currentContract?.sectorCode || ''}</Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    {(currentContract?.status?.toString().toLowerCase() === 'active') ?
                                        (<Tag icon={<CheckCircleOutlined />} color="success">
                                            {currentContract?.status || ''}
                                        </Tag>)
                                        : ''}
                                    {(currentContract?.status?.toString().toLowerCase() === 'terminated') ?
                                        (<Tag icon={<CloseCircleOutlined />} color="error">
                                            {currentContract?.status || ''}
                                        </Tag>) : ''}
                                </Descriptions.Item>
                                {/* Signature */}
                                {/* <Descriptions.Item label="Signature">
                                    <img src={currentContract?.signature || ''} style={{margin: 0, padding: 0}} alt="Signature" width="200" height="100" />
                                </Descriptions.Item> */}
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16} className='mt-3'>
                    <Col span={24}>
                        <Card bordered={false}>
                            <Descriptions title="Files" size={size}>
                                <Descriptions.Item label="Contract">
                                    <Button onClick={() => { download({...currentContract}) }} style={{ marginLeft: 5, marginBottom: 20 }} type="primary" icon={<FilePdfOutlined color='green' size={'large'} />}>Download</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label="Terms of Agreement">
                                    <Button className='pr-4' onClick={() => { setViewTC(!viewTC) }} style={{ marginLeft: 5, marginBottom: 20, paddingRight: 20 }} danger icon={<FilePdfOutlined color='green' size={'large'} />}>
                                        {viewTC ? 'Hide Document' : 'T&C Document'}
                                    </Button>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {viewTC && <Card className='my-3' title="Terms and Conditions" bordered>
                            <div dangerouslySetInnerHTML={{ __html: currentContract?.termsAndConditions ?? '' }}></div>
                        </Card>}
                    </Col>
                </Row>
            </Spin>
        </>
    );
};
export default ContractView;