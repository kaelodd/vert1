import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Col, Descriptions, Divider, Empty, Modal, Row, Select, Space, Spin, message, notification } from 'antd';
import Html5QrcodePlugin from "../../plugins/Html5QrcodePlugin";
import { getDistance } from "geolib";
import { useNavigate } from "react-router-dom";
import { useStateContext } from '../../contexts/ContextProvider';
import { getAssets, logAssetScan } from '../../services/assets';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useGeolocated } from "react-geolocated";
import Notification from "../Notification";
import Scanner from "./Scanner";
import Barcode from 'react-barcode';
import { Content } from "antd/es/layout/layout";
import { getCountries } from "../../services/resources";

const beepSound = '/beep-09.wav';
let assetsData = [];

const AssetScanner = ({ location }) => {
	const { currentPOC, currentAssetType, currentAssetTypeAction, setCurrentAssetTypeAction, currentAsset, setCurrentAsset, user, setCountries, countries } = useStateContext();

	const navigate = useNavigate();
	// const { latitude, longitude } = useGeoLocation();
	const { coords, isGeolocationAvailable, isGeolocationEnabled } =
		useGeolocated({
			positionOptions: {
				enableHighAccuracy: false,
			},
			userDecisionTimeout: 5000,
		});

	const [api] = notification.useNotification();
	const notificationRef = useRef();
	const longitude = location?.longitude || 0;
	const latitude = location?.latitude || 0;
	console.log('Cordinates: ', location, latitude);
	const [data, setData] = useState(null);
	const [notFound, setNotFound] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modal, contextHolder] = Modal.useModal();
	const [messageApi, messageContextHolder] = message.useMessage();
	const [scannerActive, setScannerActive] = useState(false);
	let outOfRangeInfo = null;
	let verified = false;
	let busy = false;
	let scannedAsset = null;
	

	const fetchAssets = () => {
		try {
			if (assetsData.length) return;
			getAssets({}).then((res) => {
				let result = res?.data?.results || [];
				const tempResult = [...result];
				assetsData = tempResult;
				console.log("Assets loaded: ", assetsData);
				setLoading(false);
			}).catch(err => {
				setLoading(false);
				console.log('Error setting assets data: ', err);
			})
		} catch (err) {
			setLoading(false);
			console.log('Error getting assets', err);
		}
	}

	const getAssetByBarcode = (barcode) => {
		// return promise when asset is found
		return new Promise((resolve, reject) => {
			console.log('CHECKING: ', barcode, ': ', assetsData);
			if (barcode && assetsData.length) {
				const asset = assetsData.find(item => item.barcode == barcode);
				console.log('SCANNED ASSET', asset);
				asset ? scannedAsset = asset : scannedAsset = null;
				if (asset) resolve(asset);
				else reject(barcode);
			}
			reject(barcode);
		})
	}

	const confirmSubmition = () => {
		setScannerActive(false);
		modal.confirm({
			title: 'Confirm Asset Details',
			icon: <InfoCircleOutlined />,
			content: (<>
				<Barcode style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }} value={currentAsset?.barcode || data || ''} />
				<Descriptions bordered style={{ marginBottom: 20, marginTop: 20 }}>
					<Descriptions.Item label="Barcode" span={3}>{scannedAsset?.barcode || data || 'NA'}</Descriptions.Item>
					<Descriptions.Item label="Asset Desc.:" span={3}>{scannedAsset?.assetDescription || 'NA'}</Descriptions.Item>
					<Descriptions.Item label="Asset Code" span={3}>{scannedAsset?.assetCode || 'NA'}</Descriptions.Item>
					<Descriptions.Item label="Account:" span={3}>{scannedAsset?.accountName || 'NA'}</Descriptions.Item>
					<Descriptions.Item label="Manuf.:" span={3}>{scannedAsset?.manufacturer || 'NA'}</Descriptions.Item>
					<Descriptions.Item label="SAP:" span={3}>{scannedAsset?.sapNumber || 'NA'}</Descriptions.Item>
				</Descriptions>
			</>),
			okText: 'Continue',
			cancelText: 'Cancel',
			onOk: () => {
				busy = false;
				submitScan();
			},
			onCancel: () => {
				busy = false;
				scannedAsset = null;
				data = null;
                setCurrentAsset(null);
			}
		});
	};

	const unknownAsset = () => {
		modal.confirm({
			title: 'Alert',
			icon: <ExclamationCircleOutlined />,
			content: (<>
				<div>
					<h1>Unrecognized Code!</h1>
					<p>Re-scan asset to try again</p>
				</div>
			</>),
			okText: 'Okay, try again',
			cancelText: 'Cancel',
			onOk: () => {
				busy = false;
                setCurrentAsset(null);
			},
			onCancel: () => {
				busy = false;
                setCurrentAsset(null);
			}
		});
	};

	const getAssetCountryGPSRange = (countryCode) => {
		if (countryCode && countries) {
			const country = countries.find(item => item.code == countryCode);
			if (country) {
				return country?.gps_compliance_range || null;
			}
			return null;
		}
		return null;
	}

	const submitScan = () => {
		try {
			openNotification('top');
			if (!getAssetCountryGPSRange(scannedAsset?.country || null)) {
				messageApi.warning(`GPS Error: Compliance range not set for country (${scannedAsset?.country || ''})`, 4);
				return;
			}
			const assetCoordinates = {
				latitude: parseFloat(scannedAsset?.latitude || 0),
				longitude: parseFloat(scannedAsset?.longitude || 0),
			};

			const coordinateOffset = getDistance({ latitude, longitude }, assetCoordinates);

			if ((scannedAsset.latitude === String(latitude) && scannedAsset.longitude === String(longitude)) || coordinateOffset < getAssetCountryGPSRange(scannedAsset.country || null)) {
				verified = true;
				messageApi.info('AVAILABLE: Asset coordinates in range!', 2);
			} else {
				outOfRangeInfo = { outOfRange: true, offset: coordinateOffset };
				// console.log("Coordinates of matched asset: ", assetCoordinates);
				messageApi.warning('UNAVAILABLE: Asset coordinates not in range!', 2);
				console.log(`Coordinate offset is ${coordinateOffset} metres`);
			}

			setLoading(true);
			const payload = {
				assetId: scannedAsset?.assetId || '',
				assetCode: scannedAsset?.assetCode || '',
				assetSerialNumber: scannedAsset?.assetSerialNumber || '',
				barcode: scannedAsset?.barcode || '',
				longitude: longitude,
				latitude: latitude,
				verifiedBy: user?.id || '',
				verificationStatus: verified ? 'VERIFIED' : 'GPS OUT OF RANGE',
			}

			logAssetScan(payload).then(response => {
				console.log('Response: ', response);
				messageApi.success('Operation Successful', 2, () => {
					setLoading(false);
					navigate('/verification-success');
				});

			}).catch(err => {
				setLoading(false);
				messageApi.error('Operation failed!');
				console.log('Error: ', err);
			});
		} catch (err) {
			console.log('Error', err);
		}
	}

	const onNewScanResult = (decodedText, decodedResult) => {
		if (decodedText && busy == false) {
			busy = true;
			setData(decodedText);
			getAssetByBarcode(decodedText).then(asset => {
				setCurrentAsset(asset);
				confirmSubmition();
			}).catch(() => {
				unknownAsset();
			})
			// if (data) {
				// if (scannedAsset) {
				// 	setCurrentAsset(scannedAsset);
				// 	confirmSubmition();
				// } else {
				// 	console.log('Scanned asset: ', scannedAsset);
				// 	unknownAsset();
				// }
			// }
		}
	};

	const openNotification = (placement) => {
		api.info({
			message: `Notification ${placement}`,
			description:
				'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
			placement,
		});
	};

	const fetchCountries = () => {
        try {
            if (countries.length) return;
            setLoading(true);
            getCountries().then((res) => {
                let result = res?.data?.results || [];
                const tempResult = [...result];
                setCountries(tempResult);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('Error setting countries data: ', err);
            })
        } catch (err) {
            setLoading(false);
            console.log('Error getting countries', err);
        }
	}
	
	useEffect(() => {
		if (!(countries.length > 0)) {
			fetchCountries();
		}
		if (!(assetsData.length > 0)) {
			fetchAssets();
		}
		if (verified) {
			return navigate("/success");
		}
		console.log('GPS: ', getAssetCountryGPSRange());
		// user = getUser ? getUser : null;
	}, [verified, data]);

	if (!isGeolocationAvailable) {
		setLoading(true);
		return <Spin spinning={true} delay={500}>
			<Empty
				image="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/512/external-geolocation-online-marketing-and-advertising-smashingstocks-flat-smashing-stocks.png"
				imageStyle={{
					height: 60,
				}}
				description={
					<span>
						Your device does not support Geolocation
					</span>
				} />
		</Spin>;
	}
	if (!isGeolocationEnabled) {
		return <Empty
			image="https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/512/external-geolocation-online-marketing-and-advertising-smashingstocks-flat-smashing-stocks.png"
			imageStyle={{
				height: 60,
			}}
			description={
				<span>
					Your device does not support Geolocation
				</span>
			} />
		// <div>Geolocation is not enabled</div>
	}

	return (
		<>
			<Content
				className="scan-verification"
				style={{
					// margin: '24px 16px',
					// padding: 24,
					minHeight: 280,
					// background: colorBgContainer,
					overflow: 'initial',
					margin: '0px'
				}}
			>
				{/* <Space direction="vertical" size="large" style={{ display: 'flex', minHeight: '70vh'}}> */}

					<Notification ref={notificationRef} />
					<Spin spinning={loading} delay={500}>
						{contextHolder}
						{messageContextHolder}

						{/* {long ? setLongitude(long) : ''}
				{lat ? setLatitude(lat) : ''} */}
						{scannerActive && assetsData.length ? (
							// <Card bordered>
								<div className="scan-box" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
									<Scanner onSuccess={(res) => onNewScanResult(res, null)} onClick={busy = false} pause={busy} playSound={true} />
									{/* </Card> */}
						</div>)
				 : ''}
						{!scannerActive && !currentAsset ?
							(<Card bordered>
								<Space onClick={() => { setScannerActive(true); }} justify={'center'} direction="vertical" align="center" style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex' }}>
									<Card onClick={() => { setScannerActive(true); }} style={{ width: '100%', alignContent: 'center' }}>
										<img src="https://store-images.s-microsoft.com/image/apps.23740.13658934779646393.9a140ebf-2225-4a9b-bf44-3e88fedce5c4.faf38cad-8130-4887-879d-b9b17be8f1c9" justify='center' style={{ width: '50%', border: '1px solid dashed', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} />
									</Card>
									<Button type="default" className='mt-5' size='medium'><strong>Click to Scan</strong></Button>
								</Space></Card>)
							: null}

						{currentAsset ? (<Row>
							<Card span={12} style={{ marginBottom: 50, marginLeft: 'auto', marginRight: 'auto', maxWidth: '100%' }}>
								<div onClick={() => { setScannerActive(true); setCurrentAsset(null) }} style={{ marginBottom: 20, marginRight: 'auto', display: 'contents' }}>
									{currentAsset ? <Barcode value={currentAsset?.barcode || data || ''} /> : ''}
									{/* <br /> */}
									{/* {currentAsset ? <Button onClick={() => { setScannerActive(true); }}>Click to Scan</Button> : ''} */}
								</div>
							</Card>
						</Row>) : ''}
					</Spin>
				{/* </Space> */}
			</Content>
		</>
	);
};
export default AssetScanner;