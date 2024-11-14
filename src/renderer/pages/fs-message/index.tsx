import React from 'react';
import { Button, Card, Segmented, Table } from 'antd';
import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import Styles from './index.module.scss';
import useAddDialog from './hooks/add-dialog';
import { FormValue } from '../../../utils/type';

type FSMessageProps = {};

enum TableType {
  '飞书' = '飞书',
  'Telegram' = 'Telegram',
}

const FSMessage: React.FC<FSMessageProps> = function FSMessage() {
  const [tableType, setTableType] = React.useState(TableType.飞书);
  const [wrapperRef, setWrapperRef] = React.useState<HTMLDivElement | null>();
  const [scrollHeight, setScrollHeight] = React.useState('0px');
  const [selectionKeys, setSelectKeys] = React.useState<string[]>([]);
  const [leftTableData, setLeftTableData] = React.useState<FormValue[]>([]);
  const [rightFsTableData, setRightFsTableData] = React.useState<
    FormValue['fsSendConfigArray']
  >([]);
  const [rightTgTableData, setRightTgTableData] = React.useState<
    FormValue['tgSendConfigArray']
  >([]);
  const [element, toggleDialog] = useAddDialog({
    afterClose(form, formType) {
      if (formType === 'create') {
        window.electron.ipcRenderer.sendMessage(
          'set-config',
          JSON.stringify([...leftTableData, form]),
        );
      } else if (formType === 'edit') {
        const targetRecord = leftTableData.find(
          (data) => data.feedId === form.feedId,
        );

        if (targetRecord == null) return;

        Object.assign(targetRecord, form);

        window.electron.ipcRenderer.sendMessage(
          'set-config',
          JSON.stringify(leftTableData),
        );
      }
    },
  });

  const handleChange = (record: FormValue) => {
    setRightFsTableData(record.fsSendConfigArray);
    setRightTgTableData(record.tgSendConfigArray);
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

    window.electron.ipcRenderer.once('init-data', (data: string) => {
      const formData = JSON.parse(data) as FormValue[];
      setLeftTableData(formData);
    });

    window.electron.ipcRenderer.sendMessage('init-data');
  });

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.operateArea}>
        <Button
          type="primary"
          onClick={() => {
            toggleDialog();
          }}
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
                  if (value[0] === record.feedId) {
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
              render={(record) => (
                <Button
                  type="text"
                  onClick={() => {
                    toggleDialog(record);
                  }}
                >
                  编辑
                </Button>
              )}
            />
          </Table>
        </Card>

        <Card
          className={Styles.rightTable}
          title={
            <div className={Styles.tableSwitch}>
              <span>发送配置群</span>

              <Segmented<TableType>
                options={Object.values(TableType)}
                onChange={(value) => {
                  setTableType(value);
                }}
              />
            </div>
          }
        >
          <div
            style={{ display: tableType === TableType.飞书 ? 'unset' : 'none' }}
          >
            <Table
              dataSource={rightFsTableData}
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

          <div
            style={{
              display: tableType === TableType.Telegram ? 'unset' : 'none',
            }}
          >
            <Table
              dataSource={rightTgTableData}
              rowKey={(record) => record.topicName}
              size="small"
              scroll={{ y: scrollHeight }}
              bordered
              pagination={false}
            >
              <Table.Column
                title="topicName"
                dataIndex="topicName"
                key="topicName"
              />
              <Table.Column title="botName" dataIndex="botName" key="botName" />
            </Table>
          </div>
        </Card>
        {element}
      </div>
    </div>
  );
};

export default FSMessage;
