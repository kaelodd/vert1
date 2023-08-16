import { ArrowDownOutlined, ArrowUpOutlined, BoxPlotOutlined, AuditOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Radio, Row, Statistic } from 'antd';
import React, { useEffect } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import AssetTypeAction from './AssetTypeAction';

const AssetTypes = () => {
    const { currentAssetType, setCurrentAssetType, currentAsset, setCurrentAsset } = useStateContext();

    const itemSelected = (e, type) => {
        e.preventDefault();
        if (currentAsset) {
            setCurrentAsset(null);
        }
        if (type) {
            const previousSelection = document.getElementsByClassName('asset-type-item-selected');
            const element = document.getElementById(type.value);
            if (element) {
                if (previousSelection.length > 0) {
                    for (let i = 0; i < previousSelection.length; i++) {
                        const element = previousSelection[i];
                        element.classList.remove('asset-type-item-selected');
                    }
                }
                console.log(previousSelection.length)
                element.classList.add('asset-type-item-selected');
            }
            // =========================

            setCurrentAssetType(type?.value || 'refrigerator');
        }
        
    }

    useEffect(() => {

    }, []);

    const assetTypeList = [
        {
            key: '1',
            label: 'Draught TAPs',
            value: 'taps',
            icon: <AuditOutlined />,
        },
        {
            key: '2',
            label: 'Refrigerator',
            value: 'refrigerator',
            icon: <BoxPlotOutlined />,
        }
    ];

    // const assetTypeCards = 
    return (
        <Row gutter={16} className='asset-types' key={'asset-type'}>
            {assetTypeList.map((type, index) => {
                return (<Col className='asset-type-item' onClick={e => itemSelected(e, type)} key={index + '-asset-type-item'} id={type.value} span={6} xs={20} sm={20} md={6} lg={8} xl={6} xxl={6}>
                    <Card bordered>
                        <Statistic
                            // title={type.label || '' }
                            value={type.label || ''}
                            precision={2}
                            valueStyle={{
                                // color: '#3f8600',
                            }}
                            prefix={type.icon}
                        />
                    </Card>
                </Col>);
            })}
            <Divider></Divider>
            <Col span={16}>
                {currentAssetType ? <AssetTypeAction /> : '' }
            </Col>
        </Row>
    );
}
export default AssetTypes;