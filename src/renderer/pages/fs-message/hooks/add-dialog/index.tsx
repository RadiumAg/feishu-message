import React from 'react';
import { DeleteFilled, LinkOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal } from 'antd';
import { useMount } from 'ahooks';
import Styles from './index.module.scss';

type FormValue = {
  appId: string;
  appSecret: string;
  chatId: string;

  sendConfig: {
    appId: string;
    appSecret: string;
    chatId: string;
  }[];
};

type Config = {
  afterClose?: (value: FormValue) => void;
};

const useAddDialog = (config: Config) => {
  const [form] = Form.useForm();
  const { afterClose } = config;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOk = async () => {
    try {
      await form.validateFields();
      setIsModalOpen(false);
      afterClose?.(form.getFieldsValue());
    } catch (e) {
      console.error(e);
    } finally {
      form.resetFields();
    }
  };

  const handleGetChatId = (sendValue: FormValue['sendConfig'][number]) => {
    window.electron.ipcRenderer.sendMessage(
      'get-chat-id',
      sendValue.appId,
      sendValue.appSecret,
    );
  };

  useMount(() => {
    window.electron.ipcRenderer.on('get-chat-id', (chatId: string) => {
      form.setFieldValue('chatId', chatId);
    });
  });

  const element = (
    <Modal
      destroyOnClose
      open={isModalOpen}
      onOk={handleOk}
      onCancel={() => {
        setIsModalOpen(false);
        form.resetFields();
      }}
    >
      <div className={Styles.formWrapper}>
        <Form form={form} style={{ maxWidth: 580 }} labelCol={{ span: 6 }}>
          <Form.Item name="appId" rules={[{ required: true }]} label="appId">
            <Input />
          </Form.Item>

          <Form.Item
            name="appSecret"
            rules={[{ required: true }]}
            label="appSecret"
          >
            <Input />
          </Form.Item>

          <Form.Item name="chatId" rules={[{ required: true }]} label="chatId">
            <div className={Styles.chatId}>
              <Input disabled />
              <Button
                type="primary"
                onClick={() => {
                  handleGetChatId(form.getFieldsValue(['appId', 'appSecret']));
                }}
              >
                获取
              </Button>
            </div>
          </Form.Item>

          <div className={Styles.link}>
            <LinkOutlined size={40} />
          </div>

          <Form.List name="sendConfig">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field) => {
                    return (
                      <Card
                        key={field.name}
                        size="small"
                        title={
                          <div className={Styles.cardTitle}>
                            {`sendConfig ${field.name + 1}`}
                            <Button
                              icon={<DeleteFilled />}
                              type="text"
                              onClick={() => {
                                remove(field.name);
                              }}
                            />
                          </div>
                        }
                        className={Styles.sendConfigCard}
                      >
                        <Form.Item
                          rules={[{ required: true }]}
                          label="appId"
                          name={[field.name, 'appId']}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          rules={[{ required: true }]}
                          label="appSecret"
                          name={[field.name, 'appSecret']}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          name="chatId"
                          rules={[{ required: true }]}
                          label="chatId"
                        >
                          <div className={Styles.chatId}>
                            <Input disabled />
                            <Button
                              type="primary"
                              onClick={() => {
                                handleGetChatId(
                                  form.getFieldValue('sendConfig')[field.name],
                                );
                              }}
                            >
                              获取
                            </Button>
                          </div>
                        </Form.Item>
                      </Card>
                    );
                  })}

                  <Button type="dashed" onClick={() => add()} block>
                    Add SendConfig
                  </Button>
                </>
              );
            }}
          </Form.List>
        </Form>
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
