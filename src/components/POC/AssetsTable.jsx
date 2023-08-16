import { Form, Input, InputNumber, Popconfirm, Spin, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getAssets } from '../../services/assets';
import AssetsList from './AssetsList';

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


const AssetsTable = ({ search }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
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
            sorter: (a, b) => a.assetCode.localeCompare(b.assetCode),
        },
        {
            title: 'Account Name',
            dataIndex: 'accountName',
            editable: false,
        },
        {
            title: 'M Serial Number',
            dataIndex: 'manufacturerSerialNumber',
            editable: false,
            responsive: ['md'],
            sorter: (a, b) => a.manufacturerSerialNumber.localeCompare(b.manufacturerSerialNumber),
        },
        {
            title: 'Status',
            dataIndex: 'verificationStatus',
            editable: false,
            render: (_, { verificationStatus }) => (
                <>
                    {<Tag color={verificationStatus == 'UNVERIFIED' || verificationStatus == 'GPS OUT OF RANGE' ? 'red' : 'blue'} key={verificationStatus}>
                        {verificationStatus?.toString()?.toUpperCase() || 'NA'}
                    </Tag>}
                </>
            ),
            sorter: (a, b) => a.verificationStatus.localeCompare(b.verificationStatus),
        },
        {
            title: 'A Serial Number',
            dataIndex: 'assetSerialNumber',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            editable: false,
            responsive: ['md'],
            sorter: (a, b) => a.barcode.localeCompare(b.barcode),
        },
        {
            title: 'Description',
            dataIndex: 'assetDescription',
            editable: false,
        },
        {
            title: 'Installation Date',
            dataIndex: 'installationDate',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Manufacturer',
            dataIndex: 'manufacturer',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'SAP No.',
            dataIndex: 'sapNumber',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Location',
            dataIndex: 'longitude',
            editable: false,
            responsive: ['md'],
            render: (_, record) => (<>{record.longitude}, {record.latitude}</>),
        },
        {
            title: 'Status',
            dataIndex: 'verificationStatus',
            editable: false,
            sorter: (a, b) => a.verificationStatus.localeCompare(b.verificationStatus),
        },
        // {
        //     title: 'Model',
        //     dataIndex: 'model',
        //     editable: false,
        // },
        // {
        //     title: 'Voltage',
        //     dataIndex: 'voltage',
        //     editable: false,
        // },
        // {
        //     title: 'EO Warranty',
        //     dataIndex: 'warrantyEndDate',
        //     editable: false,
        // },
        // {
        //     title: 'Contract',
        //     dataIndex: 'contractUrl',
        //     //   width: '15%',
        //     editable: false,
        //     responsive: ['md'],
        // },
        {
            title: 'Last Verified',
            dataIndex: 'lastVerified',
            //   width: '20%',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Verified By',
            dataIndex: 'verifiedBy',
            // width: '15%',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            render: (_, record) => (
                <span>
                    <Typography.Link
                        onClick={() => save(record.key)}
                        style={{
                            marginRight: 8,
                        }}
                    >
                        View
                    </Typography.Link>
                </span>),
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
        fetchData();
    }, [search]);

    return (
        <>
            <Spin spinning={loading} delay={500}>
                <div className='assets-list-view'>
                    <AssetsList list={filteredList} />
                </div>
                <div className='assets-table-view'>
                    <Form className='assets-table-view' form={form} component={false}>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
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
export default AssetsTable;