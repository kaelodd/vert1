import { Select, Avatar, Segmented, Space, Button, Card, Form, Input, Empty, Spin, Modal, message, QRCode, Col, Row, Descriptions } from 'antd';
import { useStateContext } from '../../contexts/ContextProvider';
import { UserOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import { getAssetIssues, getAssets, logAssetIssue } from '../../services/assets';
import { useEffect, useRef, useState } from 'react';
import { getUser } from '../../auth';
import { useNavigate } from 'react-router-dom';
import Notification from '../Notification';
import { useGeolocated } from 'react-geolocated';

// import BarcodeGenerator from '../../plugins/BarcodeGenerator';
import Barcode from 'react-barcode';
import Scanner from './Scanner';
const beepSound = '/beep-09.wav';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const AssetReporter = ({ location }) => {
    const { currentAssetType, currentAssetTypeAction, setCurrentAssetTypeAction, currentAsset, setCurrentAsset, user } = useStateContext();
    const [form] = Form.useForm();
    let assetIssues = [];
    // let selectedIssue = null;
    // let user = null;
    let assetData = null;
    let scannedAsset = null;
    let barcode = null;
    let busy = false;
    const [displayKey, setDisplayKey] = useState(0);
    const longitude = location?.longitude || 0;
    const latitude = location?.latitude || 0;
    const [modal, contextHolder] = Modal.useModal();
    const [messageApi, messageContextHolder] = message.useMessage();
    const [issues, setIssues] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const notificationRef = useRef();
    const [scannerActive, setScannerActive] = useState(false);
    const scannerRef = useRef()
    const fps = 10;
    const boxDimensions = { width: 350, height: 350 };
    const [showScanner, setShowScanner] = useState(true);

    const handleScan = (data) => {
        this.setState({
            result: data,
        })
    }
    const handleError = (err) => {
        console.error(err)
    }

    // const { latitude, longitude } = useGeoLocation();
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    const getIssues = () => {
        setLoading(true);
        getAssetIssues({}).then(res => {
            console.log("Assets loaded: ", res);
            setLoading(false);
            let result = res?.data?.results || [];
            result.forEach((item, index) => {
                item.label = item?.title || '';
                item.value = item?.id || null;
            })
            assetIssues = result;
            setIssues(result);
        }).catch((err) => {
            setLoading(false);
            console.log('Error getting assets issues: ', err);
        })
    }
    const fetchAssets = () => {
        try {
            getAssets({}).then((res) => {
                console.log("Assets loaded: ", res);
                setLoading(false);
                let result = res?.data?.results || [];
                const tempResult = [...result];
                setAssets(tempResult);
            }).catch(err => {
                console.log('Error: ', err);
            })
        } catch (err) {
            console.log('Error getting assets', err);
        }
    }
    const getAssetByBarcode = (barcode) => {
        if (barcode && assets.length) {
            const asset = assets.find(item => item.barcode == barcode);
            console.log('SCANNED ASSET', asset);
            asset ? scannedAsset = asset : scannedAsset = null;
            return asset ? asset : null;
        }
        return null;
    }
    const onNewScanResult = (decodedText, decodedResult) => {
        if (decodedText && busy == false) {
            setDisplayKey(0);
            setDisplayKey(1);
            busy = true;
            barcode = decodedText;
            getAssetByBarcode(decodedText);
            if (scannerRef?.current) scannerRef.current.clear();
            if (scannedAsset) {
                confirmSubmition();
                setCurrentAsset(scannedAsset);
            } else {
                unknownAsset();
            }
        }
    };

    const confirmSubmition = () => {
        setScannerActive(false);
        modal.confirm({
            title: 'Confirm Asset Details',
            icon: <InfoCircleOutlined />,
            content: (<>
                <Barcode style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }} value={currentAsset?.barcode || barcode || ''} />
                <Descriptions bordered style={{ marginBottom: 20, marginTop: 20 }}>
                    <Descriptions.Item label="Barcode" span={3}>{scannedAsset?.barcode || barcode || 'NA'}</Descriptions.Item>
                    <Descriptions.Item label="Asset Desc.:" span={3}>{scannedAsset?.assetDescription || 'NA'}</Descriptions.Item>
                    <Descriptions.Item label="Asset Code" span={3}>{scannedAsset?.assetCode || 'NA'}</Descriptions.Item>
                    <Descriptions.Item label="Account:" span={3}>{scannedAsset?.accountName || 'NA'}</Descriptions.Item>
                    <Descriptions.Item label="Manuf.:" span={3}>{scannedAsset?.manufacturer || 'NA'}</Descriptions.Item>
                    <Descriptions.Item label="SAP:" span={3}>{scannedAsset?.sapNumber || 'NA'}</Descriptions.Item>
                </Descriptions>
            </>),
            okText: 'Continue',
            cancelText: 'Cancel',
            onOk: () => {
                busy = false;
                setLoading(false);
            },
            onCancel: () => {
                busy = false;
                barcode = null;
                scannedAsset = null;
                setCurrentAsset(null);
            }
        });
    };

    const unknownAsset = () => {
        modal.confirm({
            title: 'Alert',
            icon: <ExclamationCircleOutlined />,
            content: (<>
                <div>
                    <h1>Unrecognized Code!</h1>
                    <p>Re-scan asset to try again</p>
                </div>
            </>),
            okText: 'Okay, try again',
            cancelText: 'Cancel',
            onOk: () => {
                setLoading(false);
                busy = false;
                setCurrentAsset(null);
            },
            onCancel: () => {
                setLoading(false);
                busy = false;
                setCurrentAsset(null);
            }
        });
    };

    const getSelectedIssueById = (id) => {
        if (id && issues) {
            const result = issues.find(item => item.id);
            return result || null;
        }
        return null;
    }

    const handleSubmit = (values) => {
        try {
            setLoading(true);
            console.log('VALUES: ', values);
            const selectedIssue = getSelectedIssueById(values?.issue || null);
            const payload = {
                assetIssueId: values?.issue || null,
                title: selectedIssue?.title || null,
                description: selectedIssue?.description || null,
                longitude: location?.longitude || null,
                latitude: location?.latitude || null,
                comment: values.comment || null,
                createdBy: user?.id || null,
                barcode: currentAsset?.barcode || null,
                assetSerialNumber: currentAsset?.assetSerialNumber || null,
                assetCode: currentAsset?.assetCode || null,
                assetId: currentAsset?.assetId || null,
            }
            if (!payload.title || !payload.description || !payload.longitude || !payload.comment || !payload.assetIssueId) {
                messageApi.warning('All fields are required', 2, () => {
                    setLoading(false);
                    return;
                });
            }
            console.log('Payload', payload);
            logAssetIssue(payload).then(response => {
                console.log('Response: ', response);
                messageApi.success('Operation Successful', 2, () => {
                    setLoading(false);
                    navigate('/verification-success');
                });
            }).catch(error => {
                setLoading(false);
                messageApi.error('Operation failed!');
                console.log('Error: ', error);
                return;
            });
        } catch (error) {
            console.log('Error: ', error);
            setLoading(false);
        }
    };

    const issueSelected = (value) => {
        console.log('Issue: ', value);
        if (value && value == 1) {
            setShowScanner(false);
        } else {
            setShowScanner(true);
        }
    }

    useEffect(() => {
        if (!(issues.length)) {
            getIssues();
        }
        if (!(assets.length)) {
            fetchAssets();
        }
    }, [issues, displayKey, showScanner]);

    if (!isGeolocationAvailable) {
        setLoading(true);
        return <Spin spinning={true} delay={500}>
            <Empty
                image="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/512/external-geolocation-online-marketing-and-advertising-smashingstocks-flat-smashing-stocks.png"
                imageStyle={{
                    height: '200px',
                }}
                description={
                    <span>
                        Your device does not support Geolocation
                    </span>
                } />
        </Spin>;
    }
    if (!isGeolocationEnabled) {
        return <Empty
            image="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/512/external-geolocation-online-marketing-and-advertising-smashingstocks-flat-smashing-stocks.png"
            imageStyle={{
                height: 60,
            }}
            description={
                <span>
                    Your device does not support Geolocation
                </span>
            } />
        // <div>Geolocation is not enabled</div>
    }


    return (
        <>
            <Notification ref={notificationRef} />
            <Card bordered >
                <Spin spinning={loading} delay={500}>
                    {contextHolder}
                    {messageContextHolder}
                    {showScanner ?
                        (<Row bordered style={{ marginTop: 20 }}>
                            <Col span={12} sm={12} xs={12} lg={12} style={{ marginLeft: 'auto', marginRight: 'auto', display: 'contents' }}>
                                {!scannerActive && !currentAsset ? (
                                    <Space onClick={() => { setScannerActive(true); }} justify={'center'} direction="vertical" align="center">
                                        <Card onClick={() => { setScannerActive(true); }} style={{ width: '100%', alignContent: 'center' }}>
                                            <img src="https://store-images.s-microsoft.com/image/apps.23740.13658934779646393.9a140ebf-2225-4a9b-bf44-3e88fedce5c4.faf38cad-8130-4887-879d-b9b17be8f1c9" justify='center' style={{ width: '50%', border: '1px solid dashed', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
                                        </Card>
                                        <Button type="default" className='mt-5' size='medium'><strong>Click to Scan</strong></Button>
                                    </Space>) : null}
                                {scannerActive ? (
                                    <div className="scan-box" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                        <Scanner onSuccess={(res) => onNewScanResult(res, null)} playSound={true} pause={busy} />
                                        {/* </Space> */}
                                    </div>) : null}
                            </Col>
                        </Row>) : ''}
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="reporter"
                        onFinish={handleSubmit}
                        style={{
                            marginTop: 40,
                            maxWidth: 600,
                        }}
                        scrollToFirstError
                    >
                        {currentAsset ? (<Row>
                            <Card span={12} style={{ marginBottom: 50, marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%' }}>
                                <div onClick={() => { setScannerActive(true); setCurrentAsset(null) }} style={{ marginBottom: 20, marginRight: 'auto', display: 'contents' }}>
                                    {currentAsset ? <Barcode value={currentAsset?.barcode || barcode || ''} /> : ''}
                                    {/* <br /> */}
                                    {/* {currentAsset ? <Button onClick={() => { setScannerActive(true); }}>Click to Scan</Button> : ''} */}
                                </div>
                            </Card>
                        </Row>) : ''}

                        <Form.Item
                            name="issue"
                            label="Asset Issue"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select asset issue!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Please select type of issue"
                                style={{
                                    width: '100%',
                                }}
                                allowClear
                                onChange={issueSelected}
                                options={issues}
                            />
                        </Form.Item>
                        <Form.Item
                            name="comment"
                            label="Comments"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input comments',
                                },
                            ]}
                        >
                            <Input.TextArea showCount rows={5} maxLength={140} />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" className='mt-5' size='large' htmlType="submit">
                                Submit Report
                            </Button>
                        </Form.Item>

                    </Form>
                    {/* <Select
                defaultValue="scan"
                style={{
                    width: '320px',
                }}
                placeholder="Select Action"
                size={'large'} onChange={handleChange}
                span={20} xs={20} sm={20} md={20} lg={20} xl={20} xxl={20}
                disabled={!currentAssetType}
                options={options}
            /> */}
                    {/* <Segmented className='mb-4' options={assetIssues}
                />
                <br />
                <Button type="primary" className='mt-5' size='large' onClick={() => alert('Report Submiited')}>
                    Submit Report
                </Button> */}
                </Spin>
            </Card>
        </>
    );
};
export default AssetReporter;