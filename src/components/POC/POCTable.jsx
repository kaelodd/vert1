import { Form, Input, InputNumber, Popconfirm, Spin, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getAssets } from '../../services/assets';

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


const POCTable = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(false);
    const isEditing = (record) => record.key === editingKey;

    const fetchData = () => {
        setLoading(true);
        getAssets({}).then((res) => {
            setLoading(false);
            let result = res?.data?.results || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            setData(tempResult);
        }).catch((error) => {
            setLoading(false);
        });
    }

    const edit = (record) => {
        form.setFieldsValue({
            firstName: '',
            lastName: '',
            email: '',
            role: '',
            ...record,
        });
        setEditingKey(record.key);
    };
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


    const columns = [
        Table.SELECTION_COLUMN,
        {
            title: 'SN',
            dataIndex: 'key',
            editable: true,
            responsive: ['md'],
        },
        {
            title: 'Name',
            dataIndex: 'name',
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            //   width: '15%',
            editable: true,
            responsive: ['md'],
        },
        {
            title: 'Address',
            dataIndex: 'address',
            //   width: '20%',
            editable: true,
            responsive: ['md'],
        },
        {
            title: 'BDR',
            dataIndex: 'bdr',
            width: '15%',
            editable: true,
            responsive: ['md'],
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
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

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Spin spinning={loading} delay={500}>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        rowSelection={{}}
                        bordered
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: cancel,
                        }}
                    />
                </Form>
            </Spin>
        </>
    );
};
export default POCTable;