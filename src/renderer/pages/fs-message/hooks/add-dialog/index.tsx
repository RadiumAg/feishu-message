import React from 'react';
import { DeleteFilled, LinkOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Segmented,
  Spin,
} from 'antd';
import { useMount } from 'ahooks';
import Styles from './index.module.scss';
import { FormValue } from '../../../../../utils/type';
import { generatorId } from '../../../../../utils/value';

type FormType = 'create' | 'edit';
type Config = {
  afterClose?: (value: FormValue, type: FormType) => void;
};

const fsConfigFormListName = 'fsSendConfigArray';
const tgConfigFormListName = 'tgSendConfigArray';

enum ConfigList {
  '飞书' = '飞书',
  'Telegram' = 'Telegram',
}

const useAddDialog = (config: Config) => {
  const [form] = Form.useForm();
  const formType = React.useRef<FormType>('create');
  const [showConfig, setShowConfig] = React.useState<ConfigList>(
    ConfigList.飞书,
  );
  const [messageApi, contextHolder] = message.useMessage();
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
      const formValue = form.getFieldsValue();
      if (formType.current === 'create') formValue.id = generatorId();
      afterClose?.(formValue, formType.current);
      form.resetFields();
      setShowConfig(ConfigList.飞书);
      console.log('form.getFieldsValue()', formValue);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGetChatId = (
    sendValue: FormValue['fsSendConfigArray'][number],
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

      if (chatId === 'timeout') {
        messageApi.error({ content: '获取 chatId 超时' });
        return;
      }

      if (setConfig.current.isSendConfig && setConfig.current.name) {
        form.setFieldValue(
          [fsConfigFormListName, ...setConfig.current.name],
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
      {contextHolder}
      <div className={Styles.formWrapper}>
        <Form form={form} style={{ maxWidth: 580 }} labelCol={{ span: 6 }}>
          <Form.Item name="id" noStyle />

          <Form.Item
            name="chatName"
            rules={[{ required: true }]}
            label="chatName"
          >
            <Input />
          </Form.Item>

          <Form.Item name="feedId" rules={[{ required: true }]} label="feedId">
            <Input />
          </Form.Item>

          <div className={Styles.link}>
            <LinkOutlined size={40} />
          </div>

          <div className={Styles.switch}>
            <Segmented<ConfigList>
              options={Object.values(ConfigList)}
              onChange={(value) => {
                setShowConfig(value);
              }}
            />
          </div>

          <div
            style={{
              display: showConfig === ConfigList.飞书 ? 'unset' : 'none',
            }}
          >
            <Form.List name={fsConfigFormListName}>
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
                            name={[field.name, 'chatName']}
                            rules={[{ required: true }]}
                            label="chatName"
                          >
                            <Input />
                          </Form.Item>

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
                              suffix={
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    handleGetChatId(
                                      form.getFieldValue(fsConfigFormListName)[
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
          </div>

          <div
            style={{
              display: showConfig === ConfigList.Telegram ? 'unset' : 'none',
            }}
          >
            <Form.List name={tgConfigFormListName}>
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
                            name={[field.name, 'botName']}
                            rules={[{ required: true }]}
                            label="botName"
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            rules={[{ required: true }]}
                            label="topicName"
                            name={[field.name, 'topicName']}
                          >
                            <Input />
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
          </div>
        </Form>
      </div>
      <Spin fullscreen spinning={isLoading} />
    </Modal>
  );

  return [
    element,
    (formData?: FormValue) => {
      formType.current = formData ? 'edit' : 'create';
      console.log(formData);
      if (formData) form.setFieldsValue(formData);
      setIsModalOpen(!isModalOpen);
    },
  ] as const;
};

export default useAddDialog;
