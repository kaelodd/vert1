import { Avatar, List, Input, Space, message, Spin } from 'antd';
import VirtualList from 'rc-virtual-list';
import { useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider.js';
import { getAllPocs, getUserPocs } from '../../services/pocs.js';
const { Search } = Input;
const fakeDataUrl = 'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';
const ContainerHeight = 400;

const POCList = () => {
    const [data, setData] = useState([]);
    const { currentPOC, setCurrentAssetType, setCurrentAssetTypeAction, setCurrentPOC, currentColor, user, userRole, pocs, setPocs  } = useStateContext();
    const [selectedPOC, setSelectedPOC] = useState(null);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(false);
    const showSkeleton = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    const appendData = () => {
        setLoading(true);
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((body) => {
                setLoading(false);
                setData(data.concat(body.results));
                setFilteredList(data.concat(body.results));
                message.success(`${body.results.length} more items loaded!`);
            });
    };

    const pocSelected = (e, data) => {
        e.preventDefault();
        console.log(`selected POC: ${data}`);
        if (data) {
            setCurrentPOC(data);
            setSelectedPOC(data);
            setCurrentAssetType(null);
            setCurrentAssetTypeAction(null);
        }
    };

    const handleListFilter = (search) => {
        if (search) {
            // const results = data.filter(poc => {
            // return poc.name.last.toLowerCase().includes(poc.name.last.toString().toLowerCase())
            // })

            const results = data.filter(obj => Object.values(obj).some(val => {
                console.log("Filter: ", val);
                return val.name.last?.includes(search);
            }));
            console.log('Results: ', results);
            setFilteredList(results);
        }
    }

    const onSearch = (value) => {
        console.log(value);
        handleListFilter(value);
        console.log("Filtered list: ", filteredList);
    }


    const fetchPocs = () => {
        try {
            // if (termsAndConditions) return;
            setLoading(true);
            if (!(userRole == 'admin')) {
                getUserPocs(user?.id || null).then((res) => {
                    let result = res?.data?.results || [];
                    console.log('POCS: ', result);
                    result.forEach((item, index) => {
                        item.value = item?.sapNumber || '';
                        item.label = `${item?.accountName} (${item?.sapNumber.toString() || ''} - ${item?.accountOwnerFirstName.toString() || ''} ${item?.accountOwnerLastName.toString() || ''})`;
                        item.key = index;
                    })
                    const tempResult = [...result];
                    setPocs(tempResult);
                    setLoading(false);
                }).catch(err => {
                    setLoading(false);
                    console.log('Error fetching records: ', err);
                })
            } else {
                getAllPocs().then((res) => {
                    let result = res?.data?.results || [];
                    console.log('POCS: ', result);
                    result.forEach((item, index) => {
                        item.value = item?.sapNumber || '';
                        item.label = `${item?.accountName} (${item?.sapNumber.toString() || ''} - ${item?.accountOwnerFirstName.toString() || ''} ${item?.accountOwnerLastName.toString() || ''})`;
                        item.key = index;
                    })
                    const tempResult = [...result];
                    setPocs(tempResult);
                    setLoading(false);
                }).catch(err => {
                    setLoading(false);
                    console.log('Error fetching records: ', err);
                })
            }
        } catch (err) {
            setLoading(false);
            console.log('Error fetching records: ', err);
        }
    }

    useEffect(() => {
        // appendData();
        showSkeleton();
        fetchPocs();
    }, []);

    const onScroll = (e) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
            appendData();
        }
    };

    return (
        <>
            <Space direction="vertical">
                <Search
                    placeholder="input search text"
                    onSearch={onSearch}
                    style={{
                        width: '100%',
                        marginBottom: 20
                    }}
                />
            </Space>
            <Spin spinning={loading} delay={500}>
                <List className='poc-list'>
                    <VirtualList
                        data={pocs}
                        height={ContainerHeight}
                        itemHeight={47}
                        itemKey="email"
                        onScroll={onScroll}>
                        {(item, index) => (
                            <List.Item key={item.sapNumber} className={selectedPOC && selectedPOC.sapNumber == item.sapNumber ? 'poc-list-item-selected' : ''} onClick={e => pocSelected(e, item)} style={{ marginLeft: '2px', cursor: 'pointer', backgroundColor: selectedPOC && selectedPOC.sapNumber == item.sapNumber ? '#1890ff' : '' }}>

                                {/* <List.Item.Meta
                            avatar={<Avatar src={item.picture.large} />}
                            title={<a href="https://ant.design">{item.name.last}</a>}
                            description={item.email}
                        /> */}
                                <List.Item.Meta
                                    onClick={e => pocSelected(e, item)}
                                    avatar={<Avatar src={`https://ui-avatars.com/api/?name=${item.accountOwnerFirstName + item.accountOwnerLastName}`} />}
                                    title={item.accountName}
                                    description={`${item.sapNumber} - ${item.accountOwnerFirstName} ${item.accountOwnerLastName}`}
                                    // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                                {/* <div>Content</div> */}
                            </List.Item>
                        )}
                    </VirtualList>
                </List>
            </Spin>
        </>
    );
};
export default POCList;