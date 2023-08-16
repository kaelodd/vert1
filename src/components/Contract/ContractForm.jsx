import {
    Button,
    Checkbox,
    Form,
    Image,
    Input,
    Modal,
    Select,
    Space,
    Spin,
} from 'antd';
import { useState, useRef, useEffect } from 'react';
import Notification from '../../components/Notification';
import { register } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { getCountries, getSectors } from '../../services/resources';
import { useStateContext } from '../../contexts/ContextProvider';
import { getPermissions } from '../../services/user';
import SignatureCanvas from "react-signature-canvas";
import { getTermsAndConditions, getTermsAndConditionsById } from '../../services/terms_and_conditions';
import { addContract } from '../../services/contracts';
import { getAllPocs, getUserPocs } from '../../services/pocs';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

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

let selectedCountry = null;
let selectedTermsAndConditions = null;

const ContractForm = () => {
    const { setCountries, countries, sectors, termsAndConditions, setTermsAndConditions, show, setShow, user, userRole, pocs, setPocs, currentPOC, setCurrentPOC } = useStateContext();
    const [loading, setLoading] = useState(false);
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const canvasRef = useRef(null);
    const signatureUploadRef = useRef(null);
    const cropperRef = useRef(null);
    const [imageRef, setImageRef] = useState(null);
    const canvasWidth = 400;
    const canvasHeight = 200;
    const [signature, setSignature] = useState('');
    const [signatureUpload, setSignatureUpload] = useState('');
    const [showTerms, setShowTerms] = useState(false);
    const [termsCondition, setTermsCondition] = useState(null);
    const [cropModal, setCropModal] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);

    const onChange = (value) => {
        if (value) {
            selectedCountry = value;
        }
    };

    const onPocChange = (value) => {
        if (value) {
            const poc = pocs.find((item) => item.value === value);
            if (poc) {
                // console.log('poc: ', poc);
                setCurrentPOC(poc);
                contract.pocName = poc?.accountName || '';
                contract.firstName = poc?.accountOwnerFirstName || '';
                contract.lastName = poc?.accountOwnerLastName || '';
                contract.country = poc?.country || '';
                setShow(false);
                setShow(true);
            }
        }
    };

    const onTypeChange = (value) => {
        if (value) {
            selectedTermsAndConditions = value;
            loadTermsAndCondition(value);
        }
    };

    const loadTermsAndCondition = (id) => {
        try {
            setLoading(true);
            getTermsAndConditionsById(id).then((res) => {
                let result = res?.data?.results || [];
                // console.log('res: ', result);
                setTermsCondition(result);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('Error fetching records: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error fetching records: ', err);
        }
    };

    const onSearch = (value) => {
        // console.log('search:', value);
    };

    const fetchCountries = () => {
        try {
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
    }

    const fetchTermsAndConditions = () => {
        try {
            // if (termsAndConditions) return;
            setLoading(true);
            getTermsAndConditions().then((res) => {
                let result = res?.data?.results || [];
                result.forEach((item, index) => {
                    item.value = item?.id || '';
                    item.label = item?.category.toString().toUpperCase() || 'NA';
                    item.key = index;
                })
                const tempResult = [...result];
                setTermsAndConditions(tempResult);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('Error fetching records: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error fetching records: ', err);
        }
    }

    const fetchPocs = () => {
        try {
            // if (termsAndConditions) return;
            setLoading(true);
            if (!(userRole == 'admin')) {
                getUserPocs(user?.id || null).then((res) => {
                    // console.log('res: ', res?.data || []);
                    let result = res?.data?.results || [];
                    result.forEach((item, index) => {
                        item.value = item?.sapNumber || '';
                        item.label = `${item?.accountName} (${item?.sapNumber.toString() || ''} - ${item?.accountOwnerFirstName.toString() || ''} ${item?.accountOwnerLastName.toString() || ''})`;
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
                    // console.log('res: ', res?.data?.results || []);
                    let result = res?.data?.results || [];
                    result.forEach((item, index) => {
                        item.value = item?.sapNumber || '';
                        item.label = `${item?.accountName} (${item?.sapNumber.toString() || ''} - ${item?.accountOwnerName.toString() || ''})`;
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
    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        values.signature = signature ?? '';
        values.pocName = currentPOC?.accountName || '';
        values.accountOwnerName = currentPOC?.accountOwnerName
        values.country = currentPOC?.country || '';
        values.addedBy = user?.bdrId || user?.id || '';

        // Validate form fields
        if (values.accountOwnerName == '' || values.pocName == '' || values.assetType == '' || values.country == '' || !signature || values.terms_and_conditions == '') {
            notifier.notify('error', 'Error!', 'All form values must be provided!');
            return;
        }

        setLoading(true);
        const payload = {
            accountOwnerName: values?.accountOwnerName || null,
            country: user?.country || null,
            pocName: values?.pocName || null,
            addedBy: user?.id || user?.bdrId || null,
            assetType: values?.assetType || null,
            signature: signature || null,
            sectorCode: currentPOC?.sectorCode || null,
            bdrId: user?.bdrId || user?.id || null,
            sapNumber: currentPOC?.sapNumber ||  null,
        };
        addContract(payload).then(() => {
            notifier.notify('success', 'Success!', 'Operation successful!');
            setLoading(false);
            setTimeout(() => {
                navigate('/contracts');
            }, 1000);
        }).catch((error) => {
            console.log('Error: ', error);
            notifier.notify('error', 'Error!', error?.response?.data?.message || 'Operation failed!');
            setLoading(false);
            return;
        });
    };

    const handleEnd = () => {
        setSignature(canvasRef.current.toDataURL());
        setSignatureUpload(null);
        // console.log('Form values: ', contract || '');
    }

    const clearSignature = () => {
        canvasRef?.current ? canvasRef?.current?.clear() : '';
        setSignature('');
        setSignatureUpload(null);
    }

    const startUploader = () => {
        signatureUploadRef.current.click();
    }

    const uploadOnChange = () => {
        // Javascript upload file and convert to base64
        const file = document?.getElementById('signature')?.files[0] || null;
        if (!file) {
            signatureUploadRef.current.click();
            return;
        }
        if (!validateImageSize(file)) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            clearSignature();
            setSignature(reader.result);
            setSignatureUpload(reader.result);
            setCroppedImage(reader.result);
            if (1) {
                setCropModal(true);
            }
        }
    }

    // Validate image size
    const validateImageSize = (file) => {
        const fileSize = file?.size || 0;
        const maxSize = 1024 * 1024 * 2; // 2MB
        if (fileSize > maxSize) {
            notifier.notify('error', 'Error!', 'Image size must not exceed 2MB!');
            return false;
        }
        return true;
    }

    const viewTerms = () => {
        // Draw modal window and insert terms and conditions
        if (!termsCondition) {
            notifier.notify('warning', 'Error!', 'Select asset type to view terms and conditions!');
            return;
        }
        setShowTerms(true);
    }

    const startCropper = () => {
        if (!signature) {
            notifier.notify('warning', 'Error!', 'Signature is required!');
            return;
        }
        setCropModal(true);
    }


    const onCropChange = (e) => {
        e.preventDefault();
        const cropper = cropperRef.current?.cropper;
        setCroppedImage(cropper?.getCroppedCanvas()?.toDataURL() || null);
    };


    useEffect(() => {
        setLoading(true);
        if (!(termsAndConditions.length > 0)) {
            fetchTermsAndConditions();
        }
        if (!(pocs.length > 0)) {
            fetchPocs();
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <>
            <Modal
                title="Terms and Conditions"
                centered
                open={showTerms}
                okText="Close"
                onOk={() => setShowTerms(false)}
                onCancel={() => setShowTerms(false)}
                width={'100%'}
            >
                <div dangerouslySetInnerHTML={{ __html: termsCondition?.contents ?? '' }}></div>
            </Modal>
            <Modal
                title="Crop Signature"
                centered
                open={cropModal}
                width={'70%'}
                style={{ padding: 0, margin: 0 }}
                destroyOnClose={true}
                okType='danger'
                footer={[
                    <Button key="back" onClick={() => setCropModal(false)} danger>
                        Close
                    </Button>
                ]}
            >
                <div style={{ padding: 0, margin: 0 }}>
                    <Cropper
                        src={signature}
                        style={{ width: '65%', height: '100%' }}
                        // initialAspectRatio={4 / 3}
                        initialAspectRatio={16 / 9}
                        ref={cropperRef}
                        minCropBoxHeight={50}
                        minCropBoxWidth={50}
                        guides={false}
                        checkOrientation={false}
                        crop={onCropChange}
                        onInitialized={(instance) => {
                            // console.log('Cropper initialized: ', instance);
                            // setCropper(instance);
                        }}
                    />
                    <Button type="primary" className='mt-2' onClick={() => { setSignature(croppedImage || null); setCropModal(false) }} style={{ width: '100%' }}>
                        Okay
                    </Button>
                </div>
            </Modal>
            <Notification ref={notificationRef} />
            <Spin spinning={loading} delay={500}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="contract"
                    onFinish={onFinish}
                    style={{
                        maxWidth: 600,
                    }}
                    scrollToFirstError
                >

                    <Form.Item
                        name="poc"
                        label="POC Account"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a Account"
                            optionFilterProp="children"
                            onChange={onPocChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={pocs}
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item
                        name="assetType"
                        label="Asset Type"
                        rules={[
                            {
                                required: true,
                                message: "Please select a asset type for this contract",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select Category..."
                            optionFilterProp="children"
                            onChange={onTypeChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={termsAndConditions}
                            allowClear
                            onClear={() => setTermsCondition(null)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="signature"
                        label="Signature"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                        {!signatureUpload ? (<div className='signature-box' style={{ border: '1px solid #ccc', padding: 1, borderRadius: 5, maxWidth: '100%' }}>
                            <SignatureCanvas
                                penColor="blue"
                                canvasProps={{
                                    width: canvasWidth,
                                    height: canvasHeight,
                                    className: "sigCanvas",
                                }}
                                width={'100%'}
                                onEnd={handleEnd}
                                ref={canvasRef}
                                clearOnResize={true}
                            />
                        </div>) :

                            (<div className='signature-box' style={{ border: '1px solid #ccc', padding: 1, borderRadius: 5, maxWidth: '100%' }}>
                                <Image src={signature} alt="Signature" width={'100%'} height={canvasHeight} style={{ maxWidth: '100%' }} preview={{ src: signature }} />
                            </div>)}
                        <Space direction='horizontal'>
                            <Button style={{ background: 'inherit' }} onClick={() => clearSignature()} title='Clear Signature' className='mt-2'>Clear</Button>
                            <Button onClick={() => startUploader()} type='default' title='Upload Signature' className='mt-2'>Upload</Button>
                            {signatureUpload ? <Button style={{}} onClick={() => startCropper()} type='default' title='Crop Image' className='mt-2'>Crop</Button> : null}
                            <input type="file" ref={signatureUploadRef} id="signature" onInput={uploadOnChange} name="signature" accept="image/png, image/jpeg" style={{ display: 'none' }} />
                        </Space>
                    </Form.Item>

                    <Form.Item
                        name="terms_and_conditions"
                        valuePropName="terms_and_conditions"
                        label=" "
                    >
                        <Checkbox>I agree to the {''}<a className="text-purple-800" href="#" onClick={viewTerms}>
                            terms and conditions
                        </a></Checkbox>
                    </Form.Item>

                    <Form.Item
                        // wrapperCol={{
                        //     offset: 8,
                        //     span: 16,
                        // }}
                        label=" "
                        style={{ marginBottom: 70 }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    );
};
export default ContractForm;