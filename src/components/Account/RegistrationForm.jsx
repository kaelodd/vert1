import {
    Button,
    Form,
    Input,
    Select,
    Spin,
} from 'antd';
import { useState, useRef, useEffect } from 'react';
import Notification from '../../components/Notification';
import { register } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { getCountries, getSectors } from '../../services/resources';
import { useStateContext } from '../../contexts/ContextProvider';
import { getPermissions } from '../../services/user';

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

const RegistrationForm = () => {
	const { setCountries, countries, setPermissions, permissions, sectors, setSectors } = useStateContext();
    const [loading, setLoading] = useState(false);
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    let countriesLoaded = 0;
    let countriesList = []; // List of countries
    let sectorsLoaded = 0;

    const onChange = (value) => {
        if (value) {
            selectedCountry = value;
        }
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    const fetchCountries = () => {
        try {
            if (countriesList.length) return;
            setLoading(true);
            countriesLoaded = 0;
            getCountries().then((res) => {
                let result = res?.data?.results || [];
                result.forEach((item) => {
                    item.value = item?.code || '';
                    item.label = item?.name || 'NA';
                })
                const tempResult = [...result];
                countriesList = tempResult;
                setCountries(countriesList);
                setLoading(false);
            }).catch(err => {
                countriesLoaded = 0;
                setLoading(false);
                console.log('Error setting countries data: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error getting countries', err);
        }
    }

    const fetchSectors = () => {
        try {
            if (countriesList.length) return;
            setLoading(true);
            sectorsLoaded = 0;
            getSectors().then((res) => {
                let result = res?.data?.results || [];
                result.forEach((item) => {
                    item.value = item?.code || '';
                    item.label = item?.name || 'NA';
                })
                const tempResult = [...result];
                setSectors(tempResult);
                setLoading(false);
            }).catch(err => {
                sectorsLoaded = 0;
                setLoading(false);
                console.log('Error setting sectors data: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error getting sectors', err);
        }
    }

    const fetchPermissions = () => {
        try {
            if (permissions.length) return;
            setLoading(true);
            getPermissions().then((res) => {
                let result = res?.data?.results || [];
                result.forEach((item) => {
                    item.value = item?.code || '';
                    item.label = item?.name || 'NA';
                })
                const tempResult = [...result];
                setPermissions(tempResult);
                setLoading(false);
            }).catch(err => {
                countriesLoaded = 0;
                setLoading(false);
                console.log('Error setting permissions data: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error getting permissions', err);
        }
    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        if (values.firstName == '' || values.lastName == '' || values.email == '' || values.password == '' || values.password !== values.password_confirm || values.country == '' || values.role == '' || values.sector == '') {
            notifier.notify('error', 'Error!', 'All form values must be provided!');
            return;
        }
        if (values.password !== values.password_confirm) {
            notifier.notify('error', 'Error!', 'Passwords do not match!');
            return;
        }
        setLoading(true);
        register({ firstName: values?.firstName || '', lastName: values?.lastName || '', email: values?.email || '', password: values?.password || '', role: values?.role || '', country: values?.country || '', sector: values?.sector || '', bdrId: values?.bdrId || '' }).then(() => {
            notifier.notify('success', 'Success!', 'Registration successful!');
            setLoading(false);
            setTimeout(() => {
                navigate('/bdrs');
            }, 1000);
        }).catch((error) => {
            console.log('Error: ', error);
            notifier.notify('error', 'Error!', error?.response?.data?.message || 'User registration failed!');
            setLoading(false);
            return;
        });
    };

    useEffect(() => {
        setLoading(true);
        if (!(countries.length > 0)) {
            fetchCountries();
        }
        if (!(permissions.length > 0)) {
            fetchPermissions();
        }
        if (!sectors.length) {
            fetchSectors();
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [])

    return (
        <>
            <Notification ref={notificationRef} />
            <Spin spinning={loading} delay={500}>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{
                        residence: ['zhejiang', 'hangzhou', 'xihu'],
                        prefix: '86',
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your first name!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your last name!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="bdrId"
                        label="BDR ID"
                        rules={[
                            {
                                required: false,
                                message: 'Please input BDR ID!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="password_confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    { countries.length ? (<Form.Item
                        name="country"
                        label="Country"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a Country"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={countries}
                            allowClear
                        />
                    </Form.Item>) : '' }

                    { sectors.length ? (<Form.Item
                        name="sector"
                        label="User Sector"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a Sector"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={sectors}
                            allowClear
                        />
                    </Form.Item>) : '' }

                    <Form.Item
                        name="role"
                        label="User Role"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select user role"
                            optionFilterProp="children"
                            options={[
                                {
                                    value: 'admin',
                                    label: 'Admin',
                                },
                                {
                                    value: 'user',
                                    label: 'User',
                                }
                            ]}
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
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
export default RegistrationForm;