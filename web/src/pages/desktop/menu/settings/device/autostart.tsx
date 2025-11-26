import { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Popconfirm, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import * as api from '@/api/autostart.ts';
import { isKeyboardEnableAtom } from '@/jotai/keyboard.ts';

export const Autostart = () => {
  const { t } = useTranslation();

  const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);

  const [isEditAutostartOpen, setIsEditAutostartOpen] = useState(false);
  const [isAutostartNameEditable, setIsAutostartNameEditable] = useState(true);
  const [autostartItems, setAutostartItems] = useState<string[]>([]);
  const [autostartName, setAutostartName] = useState('');
  const [autostartContent, setAutostartContent] = useState('');

  useEffect(() => {
    setIsKeyboardEnable(false);

    getAutostart();

    return () => {
      setIsKeyboardEnable(true);
    };
  }, []);

  function getAutostart() {
    api.getAutostart().then((rsp) => {
      if (rsp.code !== 0) {
        console.log(rsp.msg);
        return;
      }

      if (rsp.data?.files?.length > 0) {
        setAutostartItems(rsp.data.files);
      } else {
        setAutostartItems([]);
      }
    });
  }

  function uploadAutostart() {
    api.uploadAutostart(autostartName, autostartContent).then((rsp) => {
      if (rsp.code !== 0) {
        console.log(rsp.msg);
        return;
      }

      getAutostart();
      setAutostartContent('');
      setAutostartName('');
      setIsEditAutostartOpen(false);
    });
  }

  function editAutostart(name: string) {
    api.getAutostartContent(name).then((rsp) => {
      if (rsp.code !== 0) {
        console.log(rsp.msg);
        return;
      }
      setAutostartName(name);
      setAutostartContent(rsp.data);
      setIsEditAutostartOpen(true);
      setIsAutostartNameEditable(false);
    });
  }

  function closeEditAutostart() {
    setAutostartContent('');
    setAutostartName('');
    setIsAutostartNameEditable(true);
    setIsEditAutostartOpen(false);
  }

  function deleteAutostart(name: string) {
    api.deleteAutostart(name).then((rsp) => {
      if (rsp.code !== 0) {
        console.log(rsp.msg);
        return;
      }

      getAutostart();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-base font-medium">{t('settings.device.autostart.title')}</span>
        <span className="text-xs text-neutral-500">
          {t('settings.device.autostart.description')}
        </span>
      </div>

      <div>
        <Button
          type="primary"
          onClick={() => {
            setIsEditAutostartOpen(true);
          }}
          icon={<PlusOutlined />}
        >
          {t('settings.device.autostart.new')}
        </Button>
      </div>

      <Modal
        title={t('settings.device.autostart.title')}
        open={isEditAutostartOpen}
        onOk={uploadAutostart}
        onCancel={closeEditAutostart}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input
            placeholder={t('settings.device.autostart.scriptName')}
            value={autostartName}
            disabled={!isAutostartNameEditable}
            onChange={(e) => setAutostartName(e.target.value)}
          />
          <TextArea
            placeholder={t('settings.device.autostart.scriptContent')}
            value={autostartContent}
            onChange={(e) => setAutostartContent(e.target.value)}
          />
        </Space>
      </Modal>

      <div className="flex flex-col gap-2">
        {autostartItems.map((item) => (
          <Card key={item} size="small" className="transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{item}</span>
              </div>

              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => editAutostart(item)}
                />

                <Popconfirm
                  title={t('settings.device.autostart.deleteConfirm')}
                  onConfirm={() => deleteAutostart(item)}
                  okText={t('settings.device.autostart.yes')}
                  cancelText={t('settings.device.autostart.no')}
                >
                  <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
