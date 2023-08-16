import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Spin, Table, Tag, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import { getUsers } from '../../services/user';
import { getSectors, removeSector } from '../../services/resources';
import { useNavigate } from 'react-router-dom';
import SectorList from './SectorList';

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {

    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const SectorTable = ({ search }) => {
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
        getSectors({}).then((res) => {
            setLoading(false);
            let result = res?.data?.results || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item.key = index + 1;
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

    const viewSector = (record) => {
        if (record) {
            console.log('Sector', record);
            navigate(`/sector/${record.id}`);
        }
    }

    const deleteSector = (record) => {
        if (record) {
            modal.confirm({
                title: 'Confirm Delete!',
                content: 'Are you sure you want to delete this sector?',
                onOk: () => {
                    console.log('Sector', record);
                    setLoading(true);
                    removeSector(record?.id || null).then(() => {
                        setLoading(false);
                        fetchData();
                        notification.success({ type: 'success', message: 'Operation completed successfully' });
                    }).catch((eror) => {
                        setLoading(false);
                        notification.error({ type: 'error', message: 'Operation failed!' });
                    });
                },
                onCancel: () => {
                    console.log('Operation Aborted!', record);
                },
            });
        }
    }

    const columns = [
        // Table.SELECTION_COLUMN,
        {
            title: 'SN',
            dataIndex: 'key',
            //   width: '15%',
            editable: false,
            // responsive: ['md'],
        },
        {
            title: 'Name',
            dataIndex: 'name',
            //   width: '15%',
            editable: true,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            //   width: '15%',
            editable: true,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            //   width: '15%',
            editable: true,
        },
        {
            title: 'Admin',
            dataIndex: 'firstName',
            width: '15%',
            editable: false,
            // responsive: ['md'],
            render: (_, { firstName, lastName }) => (
                <>
                    {<Tag color={'blue'} key={firstName + 1}>
                        {`${firstName} ${lastName}`}
                    </Tag>}
                </>
            ),
        },
        // {
        //     title: 'role',
        //     dataIndex: 'role',
        //     width: '15%',
        //     editable: false,
        //     responsive: ['md'],
        //     render: (_, { role }) => (
        //         <>
        //           {<Tag color={role == 'admin' ? 'red' : 'blue'} key={role}>
        //                 {role.toUpperCase()}
        //             </Tag>}
        //         </>
        //       ),
        // },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_, record) => {
                return (<>
                    <Space>
                    <Button type='primary' onClick={() => viewSector(record)}>
                        View
                    </Button>
                    <Button danger onClick={() => deleteSector(record)}>
                        Delete
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
            console.log('Searching effects...');
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
                    <SectorList list={filteredList} />
                </div>
                <div className='assets-table-view'>
                <Form form={form} component={false}>
                    <Table
                        // components={{
                        //     body: {
                        //         cell: EditableCell,
                        //     },
                        // }}
                        // rowSelection={{}}
                        bordered
                        dataSource={filteredList}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: cancel,
                        }}
                        style={{ overflowX: 'scroll' }}
                    />
                </Form>
                </div>
            </Spin>
        </>
    );
};
export default SectorTable;