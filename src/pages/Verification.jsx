import { Card, Divider, Layout, Space, theme, Button, message, Steps, Col, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import POCList from '../components/POC/POCList.jsx';
import AssetTypes from '../components/POC/AssetTypes.jsx';
import AssetScanner from '../components/POC/AssetScanner.jsx';
import AssetReporter from '../components/POC/AssetReporter.jsx';
import { useGeolocated } from 'react-geolocated';
const { Content } = Layout;
const { confirm } = Modal;


const Verification = () => {
    const { currentPOC, setCurrentPOC, currentAssetType, setCurrentAssetType, currentAssetTypeAction, setCurrentAssetTypeAction } = useStateContext();
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });
    const steps = [
        {
            key: 1,
            title: 'POCs',
            content: <POCList />,
        },
        {
            key: 2,
            title: 'Asset Type',
            content: <AssetTypes />,
        },
        {
            key: 3,
            title: currentAssetTypeAction || '',
            content: currentAssetTypeAction == 'scan' ? <AssetScanner location={ coords } /> : <AssetReporter location={ coords } />
        },
    ];
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    const content1Style = {
        // lineHeight: '260px',
        color: token.colorTextTertiary,
        backgroundColor: 'white',
        marginLeft: 'auto',
        marginRight: 'auto',
        // maxHeight: '300px',
    };

    const completed = () => {
        confirm({
            title: 'Do you want to upload result result?',
            icon: <ExclamationCircleFilled />,
            content: 'This action will upload result and cannot be undone',
            onOk() {
                message.success('Processing completed successfully!');
                setCurrentPOC(null);
                setCurrentAssetType(null);
                setCurrentAssetTypeAction(null);
                setCurrent(0);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        // setCurrent(0);
    }

    return <>

        <Content
            style={{
                margin: '24px 16px',
                // padding: 24,
                minHeight: 280,
                // background: colorBgContainer,
                overflow: 'initial',
            }}
        >
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Steps current={current} items={items} />

                {/* Steeps Contents */}
                {steps[current].key === 1 ? (
                    // <div style={content1Style}>
                    <Col span={20} xs={20} sm={20} md={20} lg={20} xl={20} xxl={20} style={{ maxWidth: '100%' }}>
                        <Card bordered style={{ marginTop: '5%', ...content1Style }}>
                            {steps[current].content}
                        </Card>
                    </Col>
                    // </div>
                ) : null}

                {steps[current].key === 2 ? (
                    <Col span={20} xs={20} sm={20} md={20} lg={20} xl={20} xxl={20} style={{ maxWidth: '100%', marginTop: '40px', marginBottom: '40px' }}>
                            {steps[current].content}
                    </Col>
                ) : null}

                {steps[current].key === 3 ? (
                    <Col span={20} xs={20} sm={20} md={20} lg={20} xl={20} xxl={20} style={{ maxWidth: '100%', marginTop: '40px', marginBottom: '40px' }}>
                        {steps[current].content}
                    </Col>
                ) : null}

                {/* End Steps Contents  */}
                

                <div style={{ marginTop: 24 }}>
                    {current < steps.length - 1 && (
                        <Button type="primary" size='large' onClick={() => next()} disabled={!currentPOC || (steps[current].key == 2 && !currentAssetType) || (steps[current].key === 2 && !currentAssetTypeAction)}>
                            Next
                        </Button>
                    )}
                    {/* {current === steps.length - 1 && (
                        <Button type="primary" size='large' onClick={() => completed() }>
                            Done
                        </Button>
                    )} */}
                    {current > 0 && (
                        <Button size='large'
                            style={{
                                margin: '0 8px',
                            }}
                            onClick={() => prev()}
                        >
                            Previous
                        </Button>
                    )}
                </div>
            </Space>
        </Content>
    </>;
};

export default Verification;
