import { Button, Divider, Form, Input } from 'antd';
const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
const PasswordChange = () => (
    <Form
        name="basic"
        labelCol={{
            span: 8,
        }}
        wrapperCol={{
            span: 16,
        }}
        style={{
            maxWidth: 600,
        }}
        initialValues={{
            remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Form.Item
            label="Current Password"
            name="current_password"
            rules={[
                {
                    required: true,
                    message: 'Please input your current password!',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>
        <Divider />

        <Form.Item
            label="Password"
            name="password"
            rules={[
                {
                    required: true,
                    message: 'Please input your new password!',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            label="Confirm Password"
            name="password_confirm"
            rules={[
                {
                    required: true,
                    message: 'Please confirm password input!',
                },
            ]}
        >
            <Input.Password />
        </Form.Item>
        
        <Form.Item
            wrapperCol={{
                offset: 8,
                span: 16,
            }}
        >
            <Button type="primary" htmlType="submit">
                Save
            </Button>
        </Form.Item>
    </Form>
);
export default PasswordChange;