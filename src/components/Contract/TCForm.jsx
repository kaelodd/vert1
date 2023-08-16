import { Button, Divider, Form, Input, Select, Space, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BoxPlotOutlined, AuditOutlined } from '@ant-design/icons';
import { getTermsAndConditions, updateTermsAndConditions } from '../../services/terms_and_conditions';

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
const TCForm = ({ mode }) => {
    const { termsAndConditions, setTermsAndConditions, show, setShow, user, userRole } = useStateContext();
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
        if (values.categoryId == '' || !value || value.toString().length < 10) {
            notifier.notify('error', 'Error!', 'All form values must be provided!');
            return;
        }

        setLoading(true);
        updateTermsAndConditions({ id: values.categoryId, content: value || '', updatedBy: user.id || user.userId }).then(() => {
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
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const truncateString = (str, num = 150) => {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    }

    useEffect(() => {
        setLoading(true);
        // if (!(termsAndConditions.length > 0)) {
        fetchTermsAndConditions();
        // }
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
                        name="categoryId"
                        style={{
                            width: '75%'
                        }}
                        rules={[
                            {
                                required: true,
                                message: "Select Contract Category",
                            },
                        ]}
                    >
                        {termsAndConditions.length ? (<Select
                            showSearch
                            placeholder="Select Category..."
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={termsAndConditions}
                        />) : ''}
                    </Form.Item>

                    <Form.Item
                        name="content"
                        rules={[
                            {
                                required: false,
                                message: "Please select a category",
                            },
                        ]}
                    >
                        {show && value && <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            <ReactQuill
                                theme="snow"
                                defaultValue={selectedTerms?.contents || value}
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
                        }
                    </Form.Item>

                    {userRole == 'admin' ? <Form.Item
                        wrapperCol={{
                            // offset: 2,
                            span: 16,
                        }}
                    >
                        <Button type="primary" className='quill-button' htmlType="submit">
                            Save
                        </Button>
                    </Form.Item> : null}
                </Form>
            </Spin>
        </>
    );
}

export default TCForm;