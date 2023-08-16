import { Select } from 'antd';
import { useStateContext } from '../../contexts/ContextProvider';

const AssetTypeAction = () => {
    const { currentAssetType, currentAssetTypeAction, setCurrentAssetTypeAction } = useStateContext();
    const options = [
        {
            value: 'report',
            label: 'Report Problem',
        },
        {
            value: 'scan',
            label: 'Scan to Verify',
        }
    ];

    const handleChange = item => {
        if (item) {
            console.log(item);
            setCurrentAssetTypeAction(item || 'scan');
        }
    }

    return (
        <>
            <Select
                // defaultValue="scan"
                style={{
                    width: '320px',
                }}
                placeholder="Select Action"
                size={'large'} onChange={handleChange}
                span={20} xs={20} sm={20} md={20} lg={20} xl={20} xxl={20}
                disabled={!currentAssetType}
                options={options}
            />
        </>
    );
};
export default AssetTypeAction;