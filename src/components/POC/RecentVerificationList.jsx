import { List, Modal, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { BarcodeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useNavigate }  from 'react-router-dom';

const RecentVerificationList = ({ list, type }) => {
    const [dataList, setDataList] = useState([]);
    const [modal, contextHolder] = Modal.useModal();
    const navigate = useNavigate();

    const viewHandler = (e, data) => {
        e.preventDefault();
        if (!data) {
            return;
        }
        if (data) {
            console.log('Asset: ', data);
            navigate(`/sector/${data.id}`);
        }
    }
    useEffect(() => {
        if (list.length) {
            setDataList(list);
        }
    }, [list]);

    return (
        <>
        {contextHolder} 
            <List
                itemLayout="horizontal"
                dataSource={dataList}
                className='assets-list'
                renderItem={(item, index) => (
                    <List.Item className='assets-list-item'>
                        <List.Item.Meta
                            className='assets-list-item-meta'
                            avatar={type == 'scans' ? <BarcodeOutlined style={{ color: item?.verificationStatus == 'UNVERIFIED' || item?.verificationStatus == 'GPS OUT OF RANGE' ? 'red' : 'blue' }} /> : <ClockCircleOutlined style={{ color: 'blue' }} />}
                            title={`${item?.title || item?.assetCode || ''} - ${item?.barcode || item?.assetCode || ''}`}
                            description={`${item?.date || item?.createdAt || ''} - ${item?.verificationStatus || item?.description || ''}`}
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
export default RecentVerificationList;