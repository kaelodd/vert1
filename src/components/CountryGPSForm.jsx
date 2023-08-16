import { Button, Divider, Form, Input, Select, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import { getCountries, updateGPSComplianceRange } from '../services/resources';

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
let updateKey = 1;

const CountryGPSForm = () => {
    const { setCountries, countries, setPermissions, permissions, sectors, setSectors } = useStateContext();
    const [loading, setLoading] = useState(false);
    const notificationRef = useRef();
    const notifier = notificationRef.current;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    let countriesLoaded = 0;
    let countriesList = []; // List of countries

    const onChange = (value) => {
        if (value) {
            selectedCountry = countries.find(item => item.code === value) ?? null;
            updateKey = 0;
            updateKey = 1;
            // console.log('Country selected:', selectedCountry);
        }
    };
    const onSearch = (value) => {
        // console.log('search:', value);
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

    const onFinish = (values) => {
        // console.log('Success:', values);
        // console.log('Received values of form: ', values);
        if (values.country == '' || values.range == '') {
            notifier.notify('error', 'Error!', 'All form values must be provided!');
            return;
        }
        if (values.range < 10 || values.range > 1000) {
            notifier.notify('error', 'Error!', 'Invalid range specified!');
            return;
        }
        setLoading(true);
        updateGPSComplianceRange({ range: parseFloat(values?.range || 10), countryCode: values?.country || '', updatedBy: 1 }).then(() => {
            notifier.notify('success', 'Success!', 'Operation successful!');
            setLoading(false);
            fetchCountries();
            values.country = '';
            values.range = '';
            setTimeout(() => {
                navigate('/account-settings');
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

    useEffect(() => {
        setLoading(true);
        if (!(countries.length > 0)) {
            fetchCountries();
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <>
            <Notification ref={notificationRef} />
            <Spin spinning={loading} delay={500}>
                <Form
                    name="gps"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[
                            {
                                required: true,
                                message: "Please select a country",
                            },
                        ]}
                    >
                        {countries.length ? (<Select
                            showSearch
                            placeholder="Select a Country"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={countries}
                        />) : ''}
                    </Form.Item>

                    { updateKey ? (<Form.Item
                        key={updateKey}
                        label="Complaince Range"
                        name="range"
                        rules={[
                            {
                                required: true,
                                message: 'Please input a range!',
                            },
                        ]}
                    >
                        <Input type='number' min={10} max={1000} defaultValue={selectedCountry ? selectedCountry.gps_compliance_range : ''} />
                    </Form.Item>) : ''}

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    );
}

export default CountryGPSForm;