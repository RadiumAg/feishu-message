import React from 'react';
import { Button, Table } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import Styles from './index.module.scss';
import useAddDialog from './hooks/add-dialog';

type FSMessageProps = {};

const FSMessage: React.FC<FSMessageProps> = function FSMessage() {
  const [wrapperRef, setWrapperRef] = React.useState<HTMLDivElement | null>();
  const [scrollHeight, setScrollHeight] = React.useState('0px');
  const [element, toggleDialog] = useAddDialog({
    afterClose(form) {
      console.log(form);
    },
  });

  const data = [];

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
        <Button icon={<SettingOutlined />} type="text" onClick={toggleDialog} />
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
      {element}
    </div>
  );
};

export default FSMessage;
