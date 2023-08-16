import { Button, Divider, Form, Input, Select, Space, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BoxPlotOutlined, AuditOutlined } from '@ant-design/icons';
import { createTermsAndConditions, getTermsAndConditions, updateTermsAndConditions } from '../../services/terms_and_conditions';

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
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "strike", "underline", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video"],
    ],
};
let selectedTerms = null;
const NewTCForm = () => {
    const { termsAndConditions, setTermsAndConditions, show, setShow, user } = useStateContext();
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onChange = (value) => {
        if (value) {
            selectedTerms = termsAndConditions.find(item => item.id === value) ?? null;
            setValue(selectedTerms?.contents || '');
            setShow(false);
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setShow(true);
            }, 1);
        }
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };
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

    const onFinish = (values) => {
        console.log('Received values of form: ', values, value);

        // Validate form fields
        if (values.category == '' || !value || value.toString().length < 10) {
            notifier.notify('error', 'Error!', 'All form values must be provided!');
            return;
        }

        const exists = termsAndConditions.find(item => item.category.toLowerCase() === values.category.toLowerCase());
        if (exists) {
            notifier.notify('error', 'Error!', 'Category already exists!');
            return;
        }

        try {
            setLoading(true);
            createTermsAndConditions({ category: values.category, content: value || '' }).then(() => {
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
        } catch (error) {
            console.log('Error: ', error);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        setLoading(true);
        fetchTermsAndConditions();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <>
            <Notification ref={notificationRef} />
            <Spin spinning={loading} delay={500}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 2,
                    }}
                    wrapperCol={{
                        span: 25,
                    }}
                    style={{
                        // maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="category"
                        style={{
                            width: '75%'
                        }}
                        rules={[
                            {
                                required: true,
                                message: "Input Category",
                            },
                        ]}
                    >
                        {/* {termsAndConditions.length ? (<Select
                            showSearch
                            placeholder="Select Category..."
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={termsAndConditions}
                        />) : ''} */}
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        rules={[
                            {
                                required: false,
                                // message: "Please select a category",
                            },
                        ]}
                    >
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            <ReactQuill
                                theme="snow"
                                onChange={setValue}
                                className="w-full"
                                modules={modules}
                                name="content"
                                style={{
                                    height: 300,
                                    marginBottom: "50px",
                                }}
                            />
                        </Space>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            // offset: 2,
                            span: 16,
                        }}
                    >
                        <Button type="primary" className='quill-button' htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    );
}

export default NewTCForm;