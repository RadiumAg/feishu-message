import React from 'react';
import Styles from './index.module.scss';
import { LinkOutlined } from '@ant-design/icons';
import { Form, Input, Modal } from 'antd';

const useAddDialog = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const element = (
    <Modal
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
    >
      <div className={Styles.formWrapper}>
        <Form style={{ maxWidth: 600 }} labelCol={{ span: 4 }}>
          <Form.Item label="appId">
            <Input />
          </Form.Item>

          <Form.Item label="appSecret">
            <Input />
          </Form.Item>
        </Form>

        <div className={Styles.link}>
          <LinkOutlined size={40} />
        </div>
      </div>
    </Modal>
  );

  return [
    element,
    () => {
      setIsModalOpen(!isModalOpen);
    },
  ] as const;
};

export default useAddDialog;
