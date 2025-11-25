import { http } from '@/lib/http.ts';

export function getAutostart() {
  return http.get('/api/vm/autostart');
}

export function uploadAutostart(file: string, content: string) {
    return http.post('/api/vm/autostart', { file, content });
}

export function deleteAutostart(name: string) {
    return http.request({
        url: '/api/vm/autostart',
        method: 'delete',
        data: { name }
    });
}
