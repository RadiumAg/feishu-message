import React from 'react';
import { DeleteFilled, LinkOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Spin } from 'antd';
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
  const sendConfigFormListName = 'sendList';
  const { afterClose } = config;
  const setConfig = React.useRef<{
    isSendConfig: boolean;
    name: [number, string] | undefined;
  }>({
    isSendConfig: false,
    name: [0, ''],
  });
  const [isLoading, setIsLoading] = React.useState(false);
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

  const handleGetChatId = (
    sendValue: FormValue['sendConfig'][number],
    name: [number, string] | undefined,
    isSendConfig = false,
  ) => {
    setConfig.current.isSendConfig = isSendConfig;
    setConfig.current.name = name;

    setIsLoading(true);
    window.electron.ipcRenderer.sendMessage(
      'get-chat-id',
      sendValue.appId,
      sendValue.appSecret,
    );
  };

  useMount(() => {
    window.electron.ipcRenderer.on('get-chat-id', (chatId: string) => {
      setIsLoading(false);

      if (setConfig.current.isSendConfig && setConfig.current.name) {
        form.setFieldValue(
          [sendConfigFormListName, ...setConfig.current.name],
          chatId,
        );
      } else {
        form.setFieldValue('chatId', chatId);
      }
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
            <Input
              disabled
              suffix={
                <Button
                  type="primary"
                  onClick={() => {
                    handleGetChatId(
                      form.getFieldsValue(['appId', 'appSecret']),
                      undefined,
                      false,
                    );
                  }}
                >
                  获取
                </Button>
              }
            />
          </Form.Item>

          <div className={Styles.link}>
            <LinkOutlined size={40} />
          </div>

          <Form.List name={sendConfigFormListName}>
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
                          name={[field.name, 'chatId']}
                          rules={[{ required: true }]}
                          label="chatId"
                        >
                          <Input
                            disabled
                            suffix={
                              <Button
                                type="primary"
                                onClick={() => {
                                  handleGetChatId(
                                    form.getFieldValue(sendConfigFormListName)[
                                      field.name
                                    ],
                                    [field.name, 'chatId'],
                                    true,
                                  );
                                }}
                              >
                                获取
                              </Button>
                            }
                          />
                        </Form.Item>
                      </Card>
                    );
                  })}

                  <Button type="dashed" onClick={() => add()} block>
                    添加发送配置
                  </Button>
                </>
              );
            }}
          </Form.List>
        </Form>
      </div>
      <Spin fullscreen spinning={isLoading} />
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
