import { Form, Input, InputNumber, Popconfirm, Spin, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getUsers } from '../../services/user';
import { getRecentAssetIssueLog, getRecentAssetScanLogs } from '../../services/assets';
import { useStateContext } from '../../contexts/ContextProvider';
import RecentVerificationList from './RecentVerificationList';

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


const RecentVerifications = ({ search, type }) => {
    const { setCountries, countries, user } = useStateContext();
    const [form] = Form.useForm();
    const [issueData, setIssueData] = useState([]);
    const [scanData, setScanData] = useState([]);
    const [mixedData, setMixedData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
    const [paginationIndex, setPaginationIndex] = useState(5);
    const isEditing = (record) => record.key === editingKey;

    const fetchRecentIssueLogs = () => {
        if (issueData.length > 0 && (type != 'issues' || type != 'double')) return;
        setLoading(true);
        getRecentAssetIssueLog({ length: paginationIndex, createdBy: user?.id || '' }).then(res => {
            setLoading(false);
            let result = res?.data?.results || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            setIssueData(tempResult);
            combineResourceData();
        }).catch(error => {
            setLoading(false);
        });
    }

    const fetchRecentScanLogs = () => {
        if (scanData.length > 0 && (type != 'scans' || type != 'double')) return;
        setLoading(true);
        getRecentAssetScanLogs({ length: paginationIndex, verifiedBy: user?.id || '' }).then(res => {
            setLoading(false);
            let result = res?.data?.results || [];
            const tempResult = [...result];
            tempResult.forEach((item, index) => {
                item['key'] = index + 1;
            });
            setScanData(tempResult);
            combineResourceData();
        }).catch(error => {
            setLoading(false);
        });
    }

    const combineResourceData = () => {
        if (scanData.length || issueData.length) {
            console.log('Combining Data...', scanData, issueData);
            const result = type == 'scans' ? scanData : (type == 'issues' ? issueData : [...scanData, ...issueData]);
            setMixedData(result);
            setFilteredList(result);
        }
    }

    const cancel = () => {
        setEditingKey('');
    };
    let columns = [
        // {
        //     title: 'SN',
        //     dataIndex: 'key',
        //     //   width: '15%',
        //     editable: false,
        //     responsive: ['md'],
        // },
        {
            title: 'AssetCode',
            dataIndex: 'assetCode',
            editable: false,
            responsive: ['md'],
        },
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            //   width: '15%',
            editable: false,
        },
        {
            title: 'Location (Lat,Lon)',
            // dataIndex: 'longitude',
            //   width: '15%',
            editable: false,
            render: (_, { latitude, longitude }) => (
                <>
                    {latitude}, {longitude}
                </>
            ),
        },

        // {
        //     title: 'SerialNumber',
        //     dataIndex: 'assetSerialNumber',
        //     //   width: '20%',
        //     editable: false,
        //     responsive: ['md'],
        // },

    ];

    if (type == 'scans') {
        columns = [...columns, ...[
            {
                title: 'Status',
                dataIndex: 'verificationStatus',
                //   width: '20%',
                editable: false,
                // responsive: ['md'],
                render: (_, { verificationStatus }) => (
                    <>
                        {<Tag color={verificationStatus == 'UNVERIFIED' || verificationStatus == 'GPS OUT OF RANGE' ? 'red' : 'blue'} key={verificationStatus}>
                            {verificationStatus?.toString()?.toUpperCase() || 'NA'}
                        </Tag>}
                    </>
                ),
            },
            {
                title: 'Date',
                dataIndex: 'date',
                //   width: '20%',
                editable: false,
                responsive: ['md'],
            },
        ]]
    } else if (type == 'issues') {
        columns = [...[
            {
                title: 'Title',
                dataIndex: 'title',
                editable: false,
                // responsive: ['md'],
            },
            {
                title: 'Description',
                dataIndex: 'description',
                editable: false,
                responsive: ['md'],
            },
            {
                title: 'Comment',
                dataIndex: 'comments',
                editable: false,
                responsive: ['md'],
            },
        ], ...columns, ...[
            {
                title: 'Date',
                dataIndex: 'createdAt',
                //   width: '20%',
                editable: false,
                responsive: ['md'],
            },
        ]]
    }

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
        if (mixedData && mixedData.length) {
            if (searchText) {
                const result = mixedData.filter(obj => JSON.stringify(obj).toLowerCase().includes(searchText.toString().toLowerCase()));
                setFilteredList(result);
                return result;
            }
        }
        return filteredList;
    }

    useEffect(() => {
        if (search) {
            console.log('Searching effects...');
            onSearch(search);
            return;
        }
        // fetchData();
        fetchRecentIssueLogs();
        fetchRecentScanLogs();
        if (mixedData.length < 1) {
            combineResourceData();
        }
    }, [search, mixedData, scanData, issueData, type]);

    return (
        <>
            <Spin spinning={loading} delay={500}>
                <div className='assets-list-view'>
                    <RecentVerificationList list={filteredList} type={type} />
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
export default RecentVerifications;