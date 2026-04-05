import { useState, useEffect } from 'react';
import { deviceService, Device } from '../../../../services/device/deviceService';

export const useDevices = (parentId: string) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const data = await deviceService.getDevicesByParent(parentId);
            setDevices(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch devices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (parentId) fetchDevices();
    }, [parentId]);

    return { devices, loading, error, refresh: fetchDevices };
};