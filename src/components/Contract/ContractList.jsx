import { List, Modal, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { BookOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useNavigate }  from 'react-router-dom';

const ContractList = ({ list }) => {
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
                    <List.Item className='assets-list-item' onClick={(e) => viewHandler(e, item)}>
                        <List.Item.Meta
                            className='assets-list-item-meta'
                            avatar={<BookOutlined style={{ color: 'green' }} />}
                            title={`${item?.pocName || ''} - ${item?.sapNumber || ''}`}
                            description={`${item?.assetType || ''} - ${item?.status || ''}`}
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
export default ContractList;