import { Button, Card, DatePicker, Divider, Form, Layout, Space, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import Statistics from '../components/Statistics.jsx';
import { useNavigate } from 'react-router-dom';
import { CloudDownloadOutlined } from '@ant-design/icons';
import RecentVerifications from '../components/POC/RecentVerifications.jsx';
import moment from 'moment';
import dayjs from 'dayjs';

const { Content } = Layout;

const Home = () => {
    const { RangePicker } = DatePicker;
    const { sidebarCollapsed, dateRange, setDateRange } = useStateContext();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const dateFormat = 'YYYY-MM-DD';

    const onSearch = (text) => {
        if (text) {
            setSearchText(text);
        }
    };

    const onChange = (value, dateString) => {
        setDateRange(dateString)
    };
    const onOk = (value) => {
        console.log('onOk: ', value);
        setDateRange(value)
    };

    useEffect(() => {
        if (!dateRange) {
            setDateRange([dayjs(moment().add(-1, 'days').format('YYYY-MM-DD'), dateFormat), dayjs(moment().format('YYYY-MM-DD'), dateFormat)])
        }
    }, [dateRange]);

    return <>

        <Content
            style={{
                margin: '24px 16px',
                // padding: 0,
                minHeight: 280,
                // background: colorBgContainer,
                overflow: 'initial',
            }}
        >
            <Space direction="vertical" size="large" style={{ display: 'flex', minHeight: '70vh' }}>
                <Card size="small">
                    <div style={{}}>
                        <Space direction="horizontal">
                            <Form.Item>
                                <RangePicker
                                    allowClear={false}
                                    // showTime={{
                                    //     format: 'HH:mm',
                                    //   }}
                                      format="YYYY-MM-DD"
                                    onChange={onChange}
                                    onOk={onOk}
                                    defaultValue={[dayjs(moment().add(-1, 'days').format('YYYY-MM-DD'), dateFormat), dayjs(moment().format('YYYY-MM-DD'), dateFormat)]}
                                />
                            </Form.Item>
                            {/* <Button style={{ marginLeft: 5, marginBottom: 20 }} type="primary" icon={<CloudDownloadOutlined />}>
                                Search
                            </Button> */}
                        </Space>
                    </div>
                </Card>

                {/* Statistics */}
                <Statistics dateRange={dateRange} />
                {/* End Statistics */}

                {/* Recent Verification */}
                <Card title="Recent Verification Scans" size="small">
                    <RecentVerifications type={'scans'} search={searchText} />
                </Card>
                {/* End Recent Verification */}

                {/* Recent Issues */}
                <Card title="Recently Reported Issues" size="small">
                    <RecentVerifications type={'issues'} search={searchText} />
                </Card>
                {/* End Recent Issues */}
            </Space>
        </Content>
    </>;
};

export default Home;
