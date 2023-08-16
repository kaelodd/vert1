import { Button, notification, Space } from 'antd';
import { forwardRef, useImperativeHandle } from 'react';

const Notification = forwardRef((props, ref) => {
  const [api, contextHolder] = notification.useNotification();

  // const notify = (type, title, description) => {
  //   api[type]({
  //     message: title || 'Notification',
  //     description: description || '',
  //   });
  // };

  useImperativeHandle(ref, () => ({
    notify(type, title, description) {
      api[type]({
        message: title || 'Notification',
        description: description || '',
      });
    }
  }));

  return (
    <>
      {contextHolder}
      <Space>
      </Space>
    </>
  );
});
export default Notification;