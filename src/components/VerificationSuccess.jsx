import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
const VerificationSuccess = ({ title, description, link, status }) => {

	useEffect(() => {

	}, [title, description, link, status]);
	return (<>
		<Result
			style={{ height: '75vh', paddingTop: '150px' }}
			status={status || 'success'}
			title={title || 'Operation Successful'}
			subTitle={description || ''}
			extra={
				[
					<Link to={link || '/poc-verify'} key="console">
						<Button type="primary">
							Scan again
						</Button>
					</Link>,
					<Link to={link || '/'} key="console">
						<Button type="default" >
							Visit Dashboard
						</Button>
					</Link>
				]}
		/>
	</>
	);
};
export default VerificationSuccess;
