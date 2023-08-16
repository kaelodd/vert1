import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Spin, Table, Tag, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import { getUsers } from '../../services/user';
import { getSectors, removeSector } from '../../services/resources';
import { useNavigate } from 'react-router-dom';
import { getContracts } from '../../services/contracts';
import moment from 'moment';
import { useStateContext } from '../../contexts/ContextProvider';
import ContractList from './ContractList';


const ContractsTable = ({ search }) => {
    const { user, userRole } = useStateContext();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
    const isEditing = (record) => record.key === editingKey;
    const [modal, contextHolder] = Modal.useModal()
    const navigate = useNavigate();
    const formatDate = (date) => {
        return moment(date).format('DD MMM, YYYY');
    };
    const fetchData = () => {
        setLoading(true);
        getContracts().then((res) => {
            setLoading(false);
            let result = res?.data?.results || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            tempResult.sort((a, b) => a.createdOn.localeCompare(b.createdOn));
            // revers the array
            tempResult.reverse();
            if (userRole == 'admin') {
                setData(tempResult);
                setFilteredList(tempResult);
            } else {
                const filtered = tempResult.filter((item) => item?.addedBy == user?.id || item.addedBy == user?.bdrId);
                setData(filtered);
                setFilteredList(filtered);
                // console.log('Contracts', tempResult);
            }
        }).catch((error) => {
            setLoading(false);
        });
    }

    const cancel = () => {
        setEditingKey('');
    };

    const viewSector = (record) => {
        if (record) {
            console.log('Contract: ', record);
            navigate(`/contract/${record?.id || ''}`);
        }
    }

    const terminateContract = (record) => {
        if (record) {
            modal.confirm({
                title: 'Confirm Action!',
                content: 'Are you sure you want to terminate this contract?',
                onOk: () => {
                    console.log('Record', record);
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 2000);
                    // removeSector(record?.id || null).then(() => {
                    //     setLoading(false);
                    //     fetchData();
                    //     notification.success({ type: 'success', message: 'Operation completed successfully' });
                    // }).catch((eror) => {
                    //     setLoading(false);
                    //     notification.error({ type: 'error', message: 'Operation failed!' });
                    // });
                },
                onCancel: () => {
                    console.log('Operation Aborted!', record);
                },
            });
        }
    }

    const columns = [
        {
            title: 'SN',
            dataIndex: 'key',
            //   width: '15%',
            editable: false,
            responsive: ['md'],
            sorter: (a, b) => a.key - b.key,
        },
        {
            title: 'Name',
            dataIndex: 'accountOwnerName',
            width: '15%',
            editable: false,
            responsive: ['md'],
            render: (_, { accountOwnerName }) => (
                <>
                    {<strong>
                        {`${accountOwnerName}`}
                    </strong>}
                </>
            ),
            sorter: (a, b) => a.accountOwnerName.localeCompare(b.accountOwnerName),
        },
        {
            title: 'POC',
            dataIndex: 'pocName',
            //   width: '15%',
            editable: false,
            sortable: true,
            sorter: (a, b) => a.pocName.localeCompare(b.pocName),

        },
        {
            title: 'Asset Type',
            dataIndex: 'assetType',
            //   width: '15%',
            // editable: true,
            sorter: (a, b) => a.assetType.localeCompare(b.assetType),
        },
        {
            title: 'Country',
            dataIndex: 'country',
            //   width: '15%',
            // editable: true,
        },
        {
            title: 'Date',
            dataIndex: 'createdOn',
            render: (_, { createdOn }) => (
                <>
                    {<Tag color={'blue'} key={createdOn + 1}>
                        {formatDate(createdOn)}
                    </Tag>}
                </>
            ),
            sorter: (a, b) => a.createdOn.localeCompare(b.createdOn),
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_, record) => {
                return (<>
                    <Space>
                    <Button type='primary' onClick={() => viewSector(record)}>
                        View
                    </Button>
                    <Button danger onClick={() => terminateContract(record)}>
                        Terminate
                        </Button>
                        </Space>
                </>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const onSearch = (searchText) => {
        if (data && data.length) {
            if (searchText) {
                const result = data.filter(obj => JSON.stringify(obj).toLowerCase().includes(searchText.toString().toLowerCase()));
                setFilteredList(result);
                return result;
            }
        }
        return data;
    }

    useEffect(() => {
        if (search) {
            console.log('Searching effects...', search);
            onSearch(search);
            return;
        }
        fetchData();
    }, [search]);

    return (
        <>
            <Spin spinning={loading} delay={500}>
                {contextHolder}
                <div className='assets-list-view'>
                    <ContractList list={filteredList} />
                </div>
                <div className='assets-table-view'>
                <Form form={form} component={false}>
                    <Table
                        // rowSelection={{}}
                        bordered
                        dataSource={filteredList}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: cancel,
                        }}
                        style={{ overflowX: 'scroll' }}
                        sortDirections={['ascend', 'descend', 'ascend']}
                    />
                </Form>
                </div>
            </Spin>
        </>
    );
};
export default ContractsTable;