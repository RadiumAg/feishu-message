import React from 'react';
import { Button, Table } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import Styles from './index.module.scss';

type FSMessageProps = {};

const FSMessage: React.FC<FSMessageProps> = function FSMessage() {
  const [wrapperRef, setWrapperRef] = React.useState<HTMLDivElement | null>();
  const [scrollHeight, setScrollHeight] = React.useState('0px');

  const data = [
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
    {
      chatName: '测试1',
      chatId: '123',
      appId: '123',
      appSecret: '123',
    },
  ];

  React.useEffect(() => {
    if (wrapperRef == null) return;

    const sizeObserver = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setScrollHeight(`${height - 32 - 55}px`);
    });

    sizeObserver.observe(wrapperRef);

    // eslint-disable-next-line consistent-return
    return () => {
      sizeObserver.unobserve(wrapperRef);
    };
  }, [wrapperRef]);

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.operateArea}>
        <Button icon={<SettingOutlined />} type="text" />
      </div>

      <div className={Styles.tableWrapper} ref={setWrapperRef}>
        <div className={Styles.leftTable}>
          <Table
            size="small"
            scroll={{ y: scrollHeight }}
            bordered
            sticky
            rowHoverable
            dataSource={data}
            pagination={false}
          >
            <Table.Column
              title="chatName"
              dataIndex="chatName"
              key="chatName"
            />
          </Table>
        </div>

        <div className={Styles.rightTable}>
          <Table
            size="small"
            scroll={{ y: scrollHeight }}
            bordered
            dataSource={data}
            pagination={false}
          >
            <Table.Column
              title="chatName"
              dataIndex="chatName"
              key="chatName"
            />
            <Table.Column title="chatId" dataIndex="chatId" key="chatId" />
            <Table.Column title="appId" dataIndex="appId" key="appId" />
            <Table.Column
              title="appSecret"
              dataIndex="appSecret"
              key="appSecret"
            />
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FSMessage;
