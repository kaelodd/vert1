import { List, Modal, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { GoldOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';

const AssetsList = ({ list }) => {
    const [assetsList, setAssetsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modal, contextHolder] = Modal.useModal();

    const viewAsset = (e, asset) => {
        e.preventDefault();
        if (showModal || !asset) {
            return;
        }
        if (asset) {
            console.log('Asset: ', asset);
            const columns = [
                {
                    title: <small>Property</small>,
                    dataIndex: 'name',
                    key: 'name',
                    render: (_, { name }) => (
                        <small>{name}</small>
                    )
                },
                {
                    title: <small>Value</small>,
                    dataIndex: 'value',
                    key: 'value',
                    render: (_, { value }) => (
                        <small>{value}</small>
                    )
                },
            ];
            const data = [];
            Object.entries(asset).map((item, i) => {
                if (item && item[0] !== 'key') {
                    data.push({
                        name: item?.[0] || '',
                        value: item?.[1] || '',
                        key: i
                    });
                }
            });
            
            modal.confirm({
                title: 'Asset Details',
                icon: <InfoCircleOutlined />,
                width: 800,
                content: (<>
                    <Content
                        className='asset-details'
                        style={{
                            margin: '24px 16px',
                            // padding: 12,
                            minHeight: 280,
                            overflow: 'initial',
                            fontSize: 'xx-small !important',
                        }}
                    >
                        <Table style={{ fontSize: 'xx-small !important' }} columns={columns} dataSource={data} />
                    </Content>
                </>),
                onOk: () => {
                    setShowModal(false);
                },
                onCancel: () => {
                    setShowModal(false);
                }
            });
        }
    }
    useEffect(() => {
        if (list.length) {
            setAssetsList(list);
        }
    }, [list]);

    return (
        <>
        {contextHolder} 
            <List
                itemLayout="horizontal"
                dataSource={assetsList}
                className='assets-list'
                renderItem={(item, index) => (
                    <List.Item className='assets-list-item' onClick={(e) => viewAsset(e, item)}>
                        <List.Item.Meta
                            // onClick={viewAsset}
                            className='assets-list-item-meta'
                            avatar={<GoldOutlined style={{color: item?.verificationStatus == 'UNVERIFIED' || item?.verificationStatus == 'GPS OUT OF RANGE' ? 'red' : (item?.verificationStatus == 'VERIFIED' ? 'green' : 'grey')}} />}
                            title={`${item?.assetCode || ''} ${item?.accountName ? ' - ' + item?.accountName : ''}`}
                            description={item?.assetDescription || ''}
                        />
                    </List.Item>
                )}
                pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 10,
                  }}
            />
        </>
    );
};
export default AssetsList;