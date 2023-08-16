import { Form, Input, InputNumber, Popconfirm, Spin, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getDecommissionedAssets } from '../../services/assets';
import { useStateContext } from '../../contexts/ContextProvider';
import DecommissionedAssetsList from './DecommissionedAssetsList';

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


const DecommissionedAssetsTable = ({ search }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(false);
    const isEditing = (record) => record.key === editingKey;
    const { decommissionedAssets, setDecommissionedAssets } = useStateContext();

    const fetchData = () => {
        setLoading(true);
        getDecommissionedAssets({}).then((res) => {
            setLoading(false);
            let result = res?.data?.results || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            setData(tempResult);
            setDecommissionedAssets(tempResult);
            setFilteredList(tempResult);
        }).catch((error) => {
            setLoading(false);
        });
    }

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
        // Table.SELECTION_COLUMN,
        // {
        //     title: 'SN',
        //     dataIndex: 'key',
        //     editable: true,
        //     responsive: ['md'],
        // },
        {
            title: 'Code',
            dataIndex: 'assetCode',
            editable: false,
        },
        {
            title: 'M Serial Number',
            dataIndex: 'manufacturerSerialNumber',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Description',
            dataIndex: 'description',
            editable: false,
        },
        {
            title: 'Tech Indent Number',
            dataIndex: 'techIdentNumber',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Functional Location',
            dataIndex: 'functionalLocation',
            editable: false,
            responsive: ['md'],
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
        if (search) {
            onSearch(search);
            return;
        }
        if (JSON.stringify(decommissionedAssets) !== JSON.stringify(filteredList) || !decommissionedAssets[0]) {
            fetchData();
        }
    }, [search, decommissionedAssets]);

    return (
        <>
            <Spin spinning={loading} delay={500}>
                <div className='assets-list-view'>
                    <DecommissionedAssetsList list={filteredList} />
                </div>
                <div className='assets-table-view'>
                    <Form form={form} component={false}>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
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
export default DecommissionedAssetsTable;