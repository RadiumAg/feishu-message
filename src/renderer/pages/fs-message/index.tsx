import React from 'react';
import { Button, Card, Table } from 'antd';
import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import Styles from './index.module.scss';
import useAddDialog from './hooks/add-dialog';
import { FormValue } from '../../../utils/type';

type FSMessageProps = {};

const FSMessage: React.FC<FSMessageProps> = function FSMessage() {
  const [wrapperRef, setWrapperRef] = React.useState<HTMLDivElement | null>();
  const [scrollHeight, setScrollHeight] = React.useState('0px');
  const [selectionKeys, setSelectKeys] = React.useState<string[]>([]);
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

  const handleOpenPuppeteer = () => {
    window.electron.ipcRenderer.sendMessage('start-puppeteer');
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
          type="primary"
          onClick={toggleDialog}
          icon={<PlusCircleOutlined />}
        />

        <Button  
          onClick={handleOpenPuppeteer}
          type="primary"
          icon={<ReloadOutlined />}
        />
      </div>

      <div className={Styles.tableWrapper} ref={setWrapperRef}>
        <Card className={Styles.leftTable} title="监听群配置">
          <Table
            rowKey={(record) => record.feedId}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectionKeys,
            }}
            size="small"
            onRow={(record) => ({
              onClick: () => {
                setSelectKeys((value) => {
                  if (value.length > 0) {
                    handleChange([]);
                    return [];
                  }

                  handleChange(record);
                  return [record.feedId];
                });
              },
            })}
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

            <Table.Column
              key="chatName"
              render={() => <Button type="text">编辑</Button>}
            />
          </Table>
        </Card>

        <Card className={Styles.rightTable} title="发送群配置">
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
        </Card>
        {element}
      </div>
    </div>
  );
};

export default FSMessage;
