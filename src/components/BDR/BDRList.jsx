import { List, Modal, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useNavigate }  from 'react-router-dom';

const BDRList = ({ list }) => {
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
            navigate(`/bdrs/${data?.userId}`);
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
                    <List.Item className='assets-list-item' onClick={(e) => viewHandler(e, item)}>
                        <List.Item.Meta
                            className='assets-list-item-meta'
                            avatar={<UserOutlined style={{ color: 'green' }} />}
                            title={`${item?.firstName || ''} ${item?.lastName || ''} - ${item?.role || ''}`}
                            description={`${item?.bdrId || ''} - ${item?.sector_code || ''}`}
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
export default BDRList;