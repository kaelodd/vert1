import { Button, Dropdown, Form, Input, InputNumber, Modal, Popconfirm, Space, Spin, Table, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { getUsers } from '../../services/user';
import { DownOutlined, UserOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BDRList from './BDRList';


const BDRTable = ({ search }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
    const isEditing = (record) => record.key === editingKey;
    const [modal, contextHolder] = Modal.useModal()
    const navigate = useNavigate();

    const fetchData = () => {
        setLoading(true);
        getUsers({}).then((res) => {
            setLoading(false);
            let result = res?.data?.results || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            setData(tempResult);
            setFilteredList(tempResult);
        }).catch((error) => {
            setLoading(false);
        });
    }

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            console.log('Data: ', row);
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // Action button handler
    const handleAction = (record, key) => {
        // console.log('Action: ', record, key);
        switch (key) {
            case 'view': viewUser(record); break;
            case 'edit': editUser(record); break;
            case 'delete': deleteUser(record); break;
            default: break;
        }
    };

    // view user
    const viewUser = (record) => {
        console.log('View User: ', record);
        navigate(`/bdrs/${record?.userId || ''}`);
    };

    // delete user
    const deleteUser = (record) => {
        console.log('Delete User: ', record);
        modal.confirm({
            title: 'Are you sure you want to delete this user?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                console.log('Delete User: ', record);
                message.success('User deleted successfully');
            },
            onCancel: () => {
                console.log('Cancel Delete User: ', record);
            },
        });
    };

    // edit user
    const editUser = (record) => {
        console.log('Edit User: ', record);
        navigate(`/bdrs/${record?.userId || ''}`);
    };


    const columns = [
        // Table.SELECTION_COLUMN,
        {
            title: 'SN',
            dataIndex: 'key',
            //   width: '15%',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            //   width: '15%',
            editable: false,
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            //   width: '15%',
            editable: false,
        },
        {
            title: 'Sector Code',
            dataIndex: 'sector_code',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'BDRID',
            dataIndex: 'bdrId',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            //   width: '20%',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Country',
            dataIndex: 'country',
            editable: false,
            render: (_, { country }) => (
                <>
                    <Tag name="country" color="blue"><strong>{country || ' '}</strong></Tag>
                </>
            ),
        },
        {
            title: 'role',
            dataIndex: 'role',
            width: '15%',
            editable: false,
            responsive: ['md'],
            render: (_, { role }) => (
                <>
                    {<Tag color={role == 'admin' ? 'red' : 'blue'} key={role}>
                        {role.toUpperCase()}
                    </Tag>}
                </>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return (<>
                    <Dropdown menu={{
                        items: [
                            {
                                label: 'View',
                                key: 'view',
                                icon: <EyeOutlined />,
                            },
                            {
                                label: 'Edit',
                                key: 'edit',
                                icon: <EditOutlined />,
                            },
                            {
                                label: 'Delete',
                                key: 'delete',
                                icon: <DeleteOutlined />,
                                danger: true,
                            }
                        ],
                        // Pass event as props to onClick
                        onClick: ({ key }) => { handleAction(record, key) }
                    }}>
                        <Button type='primary'>
                            <Space>
                                Actions
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
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
            console.log('Searching effects...');
            onSearch(search);
            return;
        }
        fetchData();
    }, [search]);

    return (
        <>
            {contextHolder}
            <Spin spinning={loading} delay={500}>
                <div className='assets-list-view'>
                    <BDRList list={filteredList} />
                </div>
                <div className='assets-table-view'>
                    <Form form={form} component={false}>
                        <Table
                            size='small'
                            // rowSelection={{}}
                            bordered
                            dataSource={filteredList}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            // pagination={{
                            //     onChange: cancel,
                            // }}
                            style={{ overflowX: 'scroll' }}
                        />
                    </Form>
                </div>
            </Spin>
        </>
    );
};
export default BDRTable;