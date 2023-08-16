import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Tooltip,
    Typography,
} from 'antd';
import { useState, useRef, useEffect } from 'react';
import Notification from '../../components/Notification';
import { register } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { getCountries, getSectors } from '../../services/resources';
import { useStateContext } from '../../contexts/ContextProvider';
import { getPermissions } from '../../services/user';
import { BarcodeOutlined, CheckOutlined } from '@ant-design/icons';
import { getAllPocs, getUserPocs } from '../../services/pocs';
import AssetScanner from './AssetScanner';
import AssetReporter from './AssetReporter';
import { useGeolocated } from 'react-geolocated';
import { getAssetIssues, getAssets, getDecommissionedAssets, logAssetIssue, logAssetScan } from '../../services/assets';
import Scanner from './Scanner';
import { Content } from 'antd/es/layout/layout';
import Barcode from 'react-barcode';
import { getDistance } from 'geolib';

const ScannerComponent = () => {
    const { setCountries, countries, setPermissions, permissions,
        assetIssues, setAssetIssues,
        pocs, setPocs,
        currentPOC, setCurrentPOC,
        user, userRole,
        currentAssetType, setCurrentAssetType,
        currentAssetTypeAction, setCurrentAssetTypeAction,
        scannerBusy, setScannerBusy,
        currentAsset, setCurrentAsset,
        assets, setAssets,
        decommissionedAssets, setDecommissionedAssets } = useStateContext();

    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentIssue, setCurrentIssue] = useState(null);
    const [barcode, setBarcode] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    const onChange = (value) => {
        if (value) {
            selectedCountry = value;
        }
    };
    const onSearch = (value) => {
        // console.log('search:', value);
    };

    const onPocChange = (value) => {
        if (value) {
            const poc = pocs.find((item) => item.value === value);
            if (poc) {
                // console.log('POC selected:', poc);
                setCurrentPOC(poc);
            }
        }
    };
    const onTypeChange = (value) => {
        if (value) {
            // console.log('Type selected:', value);
            setCurrentAssetType(value);
        }
    };
    const onActionTypeChange = (value) => {
        if (value) {
            // console.log('Action selected:', value);
            setCurrentAssetTypeAction(value);
        }
    };

    const onIssueChange = (value) => {
        if (value) {
            // console.log('Issue selected:', value);
            const issue = assetIssues.find((item) => item.value === value);
            if (issue) {
                setCurrentIssue(issue?.name || '');
            }
        }
    };

    const fetchAssetIssues = () => {
        setLoading(true);
        getAssetIssues({}).then(res => {
            setLoading(false);
            let result = res?.data?.results || [];
            // console.log("Assets loaded: ", result);
            result.forEach((item, index) => {
                item.label = item?.title || '';
                item.value = item?.id || null;
            })
            setAssetIssues(result);
        }).catch((err) => {
            setLoading(false);
            console.log('Error getting assets issues: ', err);
        })
    };

    const fetchCountries = () => {
        try {
            if (countries.length) return;
            setLoading(true);
            getCountries().then((res) => {
                let result = res?.data?.results || [];
                result.forEach((item) => {
                    item.value = item?.code || '';
                    item.label = item?.name || 'NA';
                })
                const tempResult = [...result];
                setCountries(tempResult);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('Error setting countries data: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error getting countries', err);
        }
    };

    const assetTypes = [
        {
            key: '1',
            label: 'Draught TAPs',
            value: 'taps',
        },
        {
            key: '2',
            label: 'Refrigerator',
            value: 'refrigerator',
        }
    ];


    const actionTypes = [
        {
            value: 'report',
            label: 'Report Problem',
        },
        {
            value: 'scan',
            label: 'Scan to Verify',
        }
    ];

    const fetchAssets = () => {
        try {
            setLoading(true);
            getAssets({}).then((res) => {
                let result = res?.data?.results || [];
                const tempResult = [...result];
                setAssets(tempResult);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('Error setting assets data: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error getting assets', err);
        }
    };

    const fetchDecommissionedAssets = () => {
        try {
            setLoading(true);
            getDecommissionedAssets({}).then((res) => {
                let result = res?.data?.results || [];
                const tempResult = [...result];
                setDecommissionedAssets(tempResult);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('Error setting decommissioned assets data: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error getting decommissioned assets', err);
        }
    };


    const fetchPocs = () => {
        try {
            setLoading(true);
            if (!(userRole == 'admin')) {
                getUserPocs(user?.id || null).then((res) => {
                    let result = res?.data?.results || [];
                    // console.log('User POCs: ', result);
                    result.forEach((item, index) => {
                        item.value = item?.sapNumber || '';
                        item.label = `${item?.accountName} (${item?.sapNumber?.toString() || ''} - ${item?.accountOwnerName?.toString() || ''})`;
                        item.key = index;
                    })
                    const tempResult = [...result];
                    setPocs(tempResult);
                    setLoading(false);
                }).catch(err => {
                    setLoading(false);
                    console.log('Error fetching records: ', err);
                })
            } else {
                getAllPocs().then((res) => {
                    let result = res?.data?.results || [];
                    // console.log('All POCs: ', result);
                    result.forEach((item, index) => {
                        item.value = item?.sapNumber || '';
                        item.label = `${item?.accountName || ''} (${item?.sapNumber?.toString() || ''} - ${item?.accountOwnerName?.toString() || ''})`;
                        item.key = index;
                    })
                    const tempResult = [...result];
                    setPocs(tempResult);
                    setLoading(false);
                }).catch(err => {
                    setLoading(false);
                    console.log('Error fetching records: ', err);
                })
            }
        } catch (err) {
            setLoading(false);
            console.log('Error fetching records: ', err);
        }
    };


    const startScan = () => {
        if (!currentPOC) {
            notifier.notify('error', 'Error!', 'Please select a POC!');
            return;
        }
        if (!currentAssetType) {
            notifier.notify('error', 'Error!', 'Please select an asset type!');
            return;
        }
        if (!currentAssetTypeAction) {
            notifier.notify('error', 'Error!', 'Please select an action!');
            return;
        }
        setCurrentAsset(null);
        setShowScanner(true);
        // Show modal to scan
    };

    const getAssetByBarcode = (barcode) => {
        // return promise when asset is found
        return new Promise((resolve, reject) => {
            if (barcode && assets.length) {
                const asset = assets.find(item => item.barcode == barcode);
                const decommissionedAsset = decommissionedAssets.find(item => item.barcode == barcode);
                if (decommissionedAsset) {
                    notifier.notify('error', 'Error!', 'Asset has been decommissioned!');
                    reject(barcode);
                }
                if (asset) resolve(asset);
                else reject(barcode);
            }
            reject(barcode);
        })
    };

    const onNewScanResult = (decodedText, decodedResult) => {
        if (decodedText) {
            setBarcode(decodedText);
            // scanner ? scanner.barcode = decodedText : null;
            let codeField = document.getElementById('barcode');
            // console.log('Code field: ', codeField);
            if (codeField) codeField.value = decodedText;
            getAssetByBarcode(decodedText).then(asset => {
                setShowScanner(false);
                setCurrentAsset(asset);
                // console.log('Asset found: ', asset);
            }).catch((err) => {
                setShowScanner(false);
                console.log('Error getting asset: ', err);
                // unknownAsset();
            })
        }
    };

    const onCodeChange = (e) => {
        setCurrentAsset(null);
        // console.log('Code changed: ', e.target.value);
        const decodedText = e.target.value;
        setBarcode(decodedText);
        getAssetByBarcode(decodedText).then(asset => {
            setShowScanner(false);
            setCurrentAsset(asset);
            // console.log('Asset found: ', asset);
        }).catch((err) => {
            setShowScanner(false);
            console.log('Error getting asset: ', err);
        })
    }

    const getAssetCountryGPSRange = (countryCode) => {
        if (countryCode && countries) {
            const country = countries.find(item => item.code == countryCode);
            if (country) {
                return country?.gps_compliance_range || null;
            }
            return null;
        }
        return null;
    }

    const verifyLocation = () => {
        if (!currentAsset) {
            notifier.notify('error', 'Error!', 'Please scan an asset!');
            return;
        }
        // Check GPS coordinates
        if (!getAssetCountryGPSRange(currentAsset?.country || null)) {
            notifier.notify('error', 'GPS Error', `Compliance range not configured for country (${currentAsset?.country || ''})`);
            return;
        }
        setLoading(true);
        const assetCoordinates = {
            latitude: parseFloat(currentAsset?.latitude || 0),
            longitude: parseFloat(currentAsset?.longitude || 0),
        };

        const coordinateOffset = getDistance({ latitude: coords?.latitude || '', longitude: coords?.longitude || '' }, assetCoordinates);

        if ((currentAsset.latitude === String(coords?.latitude || '') && currentAsset.longitude === String(coords?.longitude || '')) || coordinateOffset < getAssetCountryGPSRange(currentAsset.country || null)) {
            // notifier.notify('info', 'AVAILABLE', 'Asset coordinates in range!');
            // console.log(`Coordinate offset is ${coordinateOffset} metres`);
            setVerificationStatus(true);
            setLoading(false);
            return true;
        } else {
            // notifier.notify('error', 'OUT OF RANGE', 'Asset coordinates out of range!');
            console.log(`Coordinate offset is ${coordinateOffset} metres`);
            setVerificationStatus(false);
            setLoading(false);
            return false;
        }
    }

    const onFinish = (values) => {
        values.barcode = currentAsset?.barcode || barcode || null;
        // console.log('Received values of form: ', values);
        // return true;
        if (!currentPOC || !currentAssetType || !currentAssetTypeAction) {
            notifier.notify('error', 'Error!', 'Please provide input for required fields!');
            return;
        }
        if ((currentAssetTypeAction == 'scan' && !values?.barcode) || (currentAssetTypeAction == 'report' && values?.issue == 'additional' && !values?.barcode)) {
            notifier.notify('error', 'Error!', 'Please scan an asset!');
            return;
        }
        if (currentAssetTypeAction == 'report' && (!values?.issue || !values?.comment)) {
            notifier.notify('error', 'Error!', 'Please provide input for required fields!');
            return;
        }

        try {
            // Verify Location
            verifyLocation();

            setLoading(true);
            // Create payload
            const payload = {
                action: currentAssetTypeAction,
                assetId: currentAsset?.assetId || '',
                assetCode: currentAsset?.assetCode || '',
                assetSerialNumber: currentAsset?.assetSerialNumber || '',
                barcode: currentAsset?.barcode || values?.barcode || '',
                longitude: coords?.longitude || '',
                latitude: coords?.latitude || '',
                verifiedBy: user?.id || user?.userId || '',
                createdBy: user?.id || user?.userId || '',
                verificationStatus: verificationStatus ? 'VERIFIED' : 'GPS OUT OF RANGE',
                issue: values?.issue || '',
                comment: values?.comment || '',
                pocId: values?.poc || '',
                assetType: values?.assetType || '',
                title: currentIssue ? assetIssues.find(item => item.name == currentIssue)?.title : '',
                description: currentIssue ? assetIssues.find(item => item.name == currentIssue)?.description : '',
                assetIssueId: currentIssue ? assetIssues.find(item => item.name == currentIssue)?.id : '',
            }
            // console.log('Payload: ', payload);
            if (!payload.barcode || !payload.longitude || !payload.latitude || !payload.verifiedBy || !payload.verificationStatus || !payload.pocId || !payload.assetType) {
                notifier.notify('error', 'Error!', 'Please provide input for required fields!');
                setLoading(false);
                return;
            }
            if (!payload.assetId) {
                notifier.notify('error', 'Error!', 'Asset ID must be provided');
                setLoading(false);
                return;
            }

            if (currentAssetTypeAction == 'scan') {
                logAssetScan(payload).then(response => {
                    notifier.notify('success', 'Success!', 'Asset scan logged successfully!');
                    setTimeout(() => {
                        setLoading(false);
                        navigate('/verification-success');
                    }, 2000);
                }).catch(err => {
                    setLoading(false);
                    notifier.notify('error', 'Error!', 'An error occurred while processing your request!');
                    console.log('Error: ', err);
                });
            } else if (currentAssetTypeAction == 'report') {
                logAssetIssue(payload).then(response => {
                    notifier.notify('success', 'Success!', 'Asset issue logged successfully!');
                    setTimeout(() => {
                        setLoading(false);
                        navigate('/verification-success');
                    }, 2000);
                }).catch(err => {
                    setLoading(false);
                    notifier.notify('error', 'Error!', 'An error occurred while processing your request!');
                    console.log('Error: ', err);
                });
            }

            return;
        } catch (error) {
            console.log('Error: ', error);
        }

    };

    useEffect(() => {
        setLoading(true);
        if (!(countries.length > 0)) {
            fetchCountries();
        }
        if (!pocs.length) {
            fetchPocs();
        }
        if (!assetIssues.length) {
            fetchAssetIssues();
        }
        if (!assets.length) {
            fetchAssets();
        }
        if (!decommissionedAssets.length) {
            fetchDecommissionedAssets();
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [])

    useEffect(() => {
        setCurrentAsset(null);
    }, []);

    return (
        <>
            <Notification ref={notificationRef} />
            <Modal
                centered
                closable={false}
                open={showScanner}
                width={'100%'}
                style={{ padding: 0, margin: 0 }}
                destroyOnClose={true}
                okType='danger'
                footer={[
                    <Button key="back" onClick={() => setShowScanner(false)} danger>
                        Close
                    </Button>
                ]}
            >
                <Content
                    className="scan-verification"
                    style={{
                        minHeight: 280,
                        overflow: 'initial',
                        margin: '0px'
                    }}
                >
                    <div className="scan-box" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        <Scanner onSuccess={(res) => onNewScanResult(res, null)} onClick={() => setScannerBusy(false)} pause={scannerBusy} stop={!showScanner} playSound={true} />
                    </div>
                </Content>
            </Modal>
            <Spin spinning={loading} delay={500}>
                <Row gutter={[16, 16]}>
                    <Col className='mt-7' xs={24} md={14}>
                        {currentAsset ? (<Row>
                            <Card span={12} style={{ marginBottom: 50, marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%' }}>
                                <div onClick={() => { startScan }} style={{ marginBottom: 20, marginRight: 'auto', display: 'contents' }}>
                                    {currentAsset ? <Barcode value={currentAsset?.barcode || barcode || ''} /> : ''}
                                </div>
                            </Card>
                        </Row>) : ''}
                        <Form
                            name="scanner"
                            className="login"
                            onFinish={onFinish}
                            scrollToFirstError
                            form={form}
                        >
                            <Form.Item
                                name="poc"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select Account',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select an Account"
                                    optionFilterProp="children"
                                    onChange={onPocChange}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={pocs}
                                    allowClear
                                    size='large'
                                />
                            </Form.Item>


                            {assetTypes.length ? (<Form.Item
                                name="assetType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select asset type!',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Asset Type"
                                    optionFilterProp="children"
                                    onChange={onTypeChange}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={assetTypes}
                                    allowClear
                                    size='large'
                                />
                            </Form.Item>) : ''}


                            {actionTypes.length ? (<Form.Item
                                name="actionType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select an action!',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Type of Action"
                                    optionFilterProp="children"
                                    onChange={onActionTypeChange}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={actionTypes}
                                    allowClear
                                    size='large'
                                />
                            </Form.Item>) : ''}

                            {currentAssetTypeAction == 'report' ?
                                (
                                    <>
                                        <Form.Item
                                            name="issue"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please select asset issue!',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder="Select asset issue"
                                                style={{
                                                    width: '100%',
                                                }}
                                                allowClear
                                                onChange={onIssueChange}
                                                options={assetIssues}
                                                size='large'
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="comment"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input comments',
                                                },
                                            ]}
                                        >
                                            <Input.TextArea size='large' placeholder='Input comments' showCount rows={7} maxLength={140} />
                                        </Form.Item>
                                    </>
                                )
                                : ''}

                            {currentAssetTypeAction == 'scan' || (currentAssetTypeAction == 'report' && currentIssue == 'additional') ?
                                <Form.Item
                                    name="barcode"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Please input Serial Number!',
                                        },
                                    ]}>
                                    <Space.Compact direction={'horizontal'} size="large" style={{ width: '100%' }}>
                                        <Input placeholder="Barcode" id={'barcode'} value={barcode} onInput={onCodeChange} style={{ width: 'calc(150% - 200px)' }} prefix={<BarcodeOutlined />} />
                                        <span className="ant-input-suffix">
                                            <Button type={currentAsset ? 'ghost' : 'primary'} style={{ backgroundColor: currentAsset ? '#52c41a' : '', color: currentAsset ? 'white' : '', fontSize: currentAsset ? '20px' : '' }} color='green' disabled={!!currentAsset} onClick={() => { startScan() }}>
                                                {!currentAsset ? <span>Scan</span> : <CheckOutlined />}
                                            </Button>
                                        </span>
                                    </Space.Compact>
                                </Form.Item> : ''}

                            {currentAsset ? <Tooltip title={currentAsset?.barcode || ''}>
                                <Typography.Text color='green' type='success' >{`${currentAsset?.accountName || ''} - ${currentAsset?.assetDescription || ''} (${currentAsset?.manufacturer || ''})`}</Typography.Text>
                            </Tooltip> : ''}

                            <Form.Item className='mt-5'>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                {/* <Button type="primary" onClick={() => { scanner?.submit() || '' }} htmlType="submit">Submit</Button> */}
                            </Form.Item>
                        </Form>
                    </Col>
                    {/* <Col xs={24} md={14}>
                        <AssetScanner location={coords} />
                    </Col> */}
                </Row>
                {/* <Row gutter={[16, 16]} cla>
                    <Col xs={24} md={12}>
                    </Col>
                </Row> */}
            </Spin>
        </>
    );
};
export default ScannerComponent;