import React from 'react';
import { Button, Table } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import Styles from './index.module.scss';
import useAddDialog from './hooks/add-dialog';
import { FormValue } from '../../../utils/type';

type FSMessageProps = {};

const FSMessage: React.FC<FSMessageProps> = function FSMessage() {
  const [wrapperRef, setWrapperRef] = React.useState<HTMLDivElement | null>();
  const [scrollHeight, setScrollHeight] = React.useState('0px');
  const [leftTableData, setLeftTableData] = React.useState<FormValue[]>([]);
  const [rightTableData, setRightTableData] = React.useState<
    FormValue['sendConfigArray']
  >([]);
  const [element, toggleDialog] = useAddDialog({
    afterClose(form) {
      window.electron.ipcRenderer.sendMessage(
        'set-config',
        JSON.stringify([...leftTableData, form]),
      );
    },
  });

  const handleChange = (record: FormValue) => {
    setRightTableData(record.sendConfigArray);
  };

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

  useMount(() => {
    window.electron.ipcRenderer.on('update-data', (data: string) => {
      const formData = JSON.parse(data) as FormValue[];
      setLeftTableData(formData);
    });
  });

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.operateArea}>
        <Button
          icon={<PlusCircleOutlined />}
          type="text"
          onClick={toggleDialog}
        />
      </div>

      <div className={Styles.tableWrapper} ref={setWrapperRef}>
        <div className={Styles.leftTable}>
          <Table
            rowKey={(record) => record.appId}
            rowSelection={{ onSelect: handleChange, type: 'radio' }}
            size="small"
            scroll={{ y: scrollHeight }}
            bordered
            sticky
            rowHoverable
            dataSource={leftTableData}
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
            dataSource={rightTableData}
            rowKey={(record) => record.appId}
            size="small"
            scroll={{ y: scrollHeight }}
            bordered
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
