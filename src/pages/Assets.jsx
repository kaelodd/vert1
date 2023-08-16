import { App, Button, Card, Descriptions, Divider, Form, Layout, Modal, Progress, Space, Spin, Upload, message, notification, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.js';
import Search from 'antd/es/input/Search.js';
import { CloudUploadOutlined, InboxOutlined, UploadOutlined, FileAddOutlined } from '@ant-design/icons';
import POCTable from '../components/POC/POCTable.jsx';
import AssetsTable from '../components/POC/AssetsTable.jsx';
import Breadcrumb from '../components/Layout/Breadcrum.jsx';
import { Link } from 'react-router-dom';
import Dragger from 'antd/es/upload/Dragger.js';
import Dropzone from 'react-dropzone';
import { uploadCSVAssets } from '../services/assets.js';
import assetsTemplate from '../data/assetsTemplate.csv';

const { Content } = Layout;

const breadCrumbLinks = [
    {
        title: <Link to={'/'}>Home</Link>,
    },
    // {
    //     title: <a href="">Application Center</a>,
    // },
    {
        title: 'Assets',
    },
]
const Assets = () => {
    const [loading, setLoading] = useState(false);
    const { sidebarCollapsed } = useStateContext();
    const [searchText, setSearchText] = useState();
    const [modal, contextHolder] = Modal.useModal();
    let file = null;

    let displayKey = 0;
    const {
        token: { colorBgContainer },
    } = theme.useToken();


    const submitAssetsUpload = () => {
        if (!file) return;
        const formData = new FormData()
        // formData.append('file', file);
        const payload = {
            csvFile: file
        };
        setLoading(true);
        uploadCSVAssets(payload).then(res => {
            setLoading(false);
            notification.success({
                type: 'success',
                message: 'Uploaded assets were successfully uploaded'
            })
        }).catch(error => {
            console.log('Error uploading assets: ', error);
            setLoading(false);
        })
    }

    const fileSelected = (files) => {
        // Get uploaded file and assign to variable
        if (!files.length) return;
        file = files[0];
        displayKey = displayKey + 1;
    }

    const uploadCSV = () => {
        file = null;
        modal.confirm({
            title: 'Assets Upload Form',
            // icon: <InfoCircleOutlined />,
            width: 800,
            content: (<>
                <Content
                    style={{
                        margin: '24px 16px',
                        // padding: 12,
                        minHeight: 280,
                        overflow: 'initial',
                    }}
                >
                    <Spin spinning={loading} delay={500}>
                        <form id="file-upload-form" className="uploader">
                            <Dropzone onDrop={fileSelected}>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} accept='.csv' />

                                            <label htmlFor="file-upload" className='mb-4' id="file-drag">
                                                <FileAddOutlined size={500}></FileAddOutlined>
                                                {!file ?
                                                    (<div id="start">
                                                        <i className="fa fa-download" aria-hidden="true"></i>
                                                        <div>Select or drag a CSV file here</div>
                                                        {/* <div id="notimage" className="hidden">Please select an image</div> */}
                                                        <span id="file-upload-btn" className="btn btn-primary">Select a file</span>
                                                    </div>) :
                                                    (<div id="response" style={{ display: file ? true : false, }}>
                                                        <div id="messages">{file?.name || ''}</div>
                                                        <Space wrap>
                                                            <Progress type="circle" percent={100} size={'default'} />
                                                        </Space>
                                                    </div>)}
                                            </label>
                                        </div>
                                        <div className='block mb-4 text-sm text-dark dark:text-gray-800' id='combo_account_help'>
                                            <Link to={assetsTemplate} className='font-bold' target='_blank' download>
                                                <Button danger>Download Template</Button>
                                            </Link>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </form>
                    </Spin>
                </Content>
            </>),
            okText: 'Submit',
            // cancelText: 'Cancel',
            onOk: () => {
                submitAssetsUpload();
            },
            onCancel: () => {
                // 
            }
        });
    }

    const onSearch = (text) => {
        if (text) {
            // console.log(text);

            setSearchText(text);
        }
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [file]);

    return <>
        {contextHolder}
        <Content
            style={{
                margin: '24px 16px',
                // padding: 24,
                minHeight: 280,
                overflow: 'initial',
            }}
        >
            <Breadcrumb links={breadCrumbLinks} />
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Spin spinning={loading} delay={500}>
                    <Card size="small">
                        <div style={{}}>
                            <Space direction="horizontal">
                                <Search
                                    placeholder="input search text"
                                    onSearch={onSearch}
                                    style={{
                                        width: '100%',
                                        marginBottom: 20
                                    }}
                                />
                                <Button onClick={() => { uploadCSV() }} style={{ marginLeft: 5, marginBottom: 20, marginRight: 5 }} type="primary" icon={<CloudUploadOutlined />}>
                                    Upload 
                                </Button>
                            </Space>
                        </div>
                        <AssetsTable search={searchText} />
                    </Card>
                </Spin>
            </Space>
        </Content>
    </>;
};

export default Assets;
