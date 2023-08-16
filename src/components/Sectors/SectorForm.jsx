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
import { addSector, getCountries } from '../../services/resources';
import { useStateContext } from '../../contexts/ContextProvider';
import { getPermissions, getUsers } from '../../services/user';
import TextArea from 'antd/es/input/TextArea';

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
let selectedUser = null;

const SectorForm = () => {
	const { setCountries, countries, setPermissions, permissions } = useStateContext();
    const [loading, setLoading] = useState(false);
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    let countriesLoaded = 0;
    let countriesList = []; // List of countries

    const onChange = (value) => {
        if (value) {
            selectedCountry = value;
        }
    };
    const onUserSelected = (value) => {
        if (value) {
            selectedUser = value;
        }
    }
    const onSearch = (value) => {
        console.log('search:', value);
    };

    const fetchUsersData = () => {
        setLoading(true);
        getUsers({}).then((res) => {
            setLoading(false);
            let result = res?.data?.results || [];
            result.forEach((item) => {
                item.value = item?.userId || null;
                item.label = `${item?.firstName || 'NA'} ${item?.lastName || ''}`;
            })
            const tempResult = [...result];
            setUsers(tempResult);
        }).catch((error) => {
            setLoading(false);
        });
    }

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

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        if (values.name == '' || values.country == '' || values.supervisor_id == '') {
            notifier.notify('error', 'Error!', 'All form values must be provided!');
            return;
        }
        setLoading(true);
        addSector({ name: values?.name || '', description: values?.description || '', code: values?.code || '', country: values?.country || '', supervisor_id: values?.supervisor_id || '' }).then(() => {
            notifier.notify('success', 'Success!', 'Operation successful!');
            setLoading(false);
            setTimeout(() => {
                navigate('/sectors');
            }, 1000);
        }).catch((error) => {
            console.log('Error: ', error);
            notifier.notify('error', 'Error!', error?.response?.data?.message || 'Operation failed!');
            setLoading(false);
            return;
        });
    };

    useEffect(() => {
        setLoading(true);
        if (!(countries.length > 0)) {
            fetchCountries();
        }
        if (!(users.length > 0)) {
            fetchUsersData();
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
                        name="name"
                        label="Sector Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input sector name!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: false,
                                message: 'Please input description text!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Sector Code"
                        rules={[
                            {
                                required: false,
                                message: 'Please input sector code!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    
                    { countries.length ? (<Form.Item
                        name="country"
                        label="Country"
                        rules={[
                            {
                                required: true,
                                message: 'Please select country!',
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

                    <Form.Item
                        name="supervisor_id"
                        label="Administrator"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Sector Administrator"
                            optionFilterProp="children"
                            options={users}
                            showSearch
                            onChange={onUserSelected}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                        />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                        style={{ marginBottom: 90, marginTop: 50 }}
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
export default SectorForm;