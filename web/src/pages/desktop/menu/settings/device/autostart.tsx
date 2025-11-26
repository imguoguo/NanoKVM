import * as api from '@/api/autostart.ts';
import { useEffect, useState } from 'react';
import { Button, Modal, Input, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/es/input/TextArea'
import {isKeyboardEnableAtom} from '@/jotai/keyboard.ts';
import { useSetAtom } from 'jotai';


export const Autostart = () => {
    const { t } = useTranslation();

    const setIsKeyboardEnable = useSetAtom(isKeyboardEnableAtom);

    const [isLoading, setIsLoading] = useState(false);
    const [isNewAutostartOpen, setIsNewAutostartOpen] = useState(false);
    const [autostartItems, setAutostartItems] = useState<string[]>([]);
    const [newAutostartName, setNewAutostartName] = useState('');
    const [newAutostartContent, setNewAutostartContent] = useState('');

    useEffect(() => {
        setIsKeyboardEnable(false);
        
        getAutostart();

        return () => {
            setIsKeyboardEnable(true);
        }
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
        api.uploadAutostart(newAutostartName, newAutostartContent).then((rsp) => {
            if (rsp.code !== 0) {
                console.log(rsp.msg);
                return;
            }

            getAutostart();
            setNewAutostartContent('');
            setNewAutostartName('');
            setIsNewAutostartOpen(false);
        });
    }

    function deleteAutostart(name: string) {
        api.deleteAutostart(name).then((rsp) => {
            if (rsp.code !== 0) {
                console.log(rsp.msg);
                return;
            }
            
            getAutostart();
        }
        );
    }

    return (
        <>
            <div className="flex flex-col">
                <span>{t('settings.device.autostart.title')}</span>
                <span className="text-xs text-neutral-500">{t('settings.device.autostart.description')}</span>
            </div>

            <div>
                <Button onClick={() => {setIsNewAutostartOpen(true)}} icon={<PlusOutlined />}>
                    {t('settings.device.autostart.upload')}
                </Button>
                <Modal
                    title={t('settings.device.autostart.title')}
                    open={isNewAutostartOpen}
                    onOk={uploadAutostart}
                    onCancel={() => setIsNewAutostartOpen(false)}>
                        <Input placeholder={t('settings.device.autostart.scriptName')} onChange={(e) => setNewAutostartName(e.target.value)} />
                        <TextArea placeholder={t('settings.device.autostart.scriptContent')} onChange={(e) => setNewAutostartContent(e.target.value)} />
                    </Modal>

                {autostartItems.map((item) => (
                    <div key={item}>{item} 

                    <Popconfirm
                        title={t('settings.device.autostart.delete_confirm')}
                        onConfirm={() => deleteAutostart(item)}
                        okText={t('settings.device.autostart.yes')}
                        cancelText={t('settings.device.autostart.no')}
                    >
                            <DeleteOutlined />
                    </Popconfirm>
                    </div>
                ))}
            </div>
        </>
    );
}