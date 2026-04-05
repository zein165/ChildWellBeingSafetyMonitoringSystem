class DevicePresence {
    private onlineDevices = new Map<string, number>();

    private TIMEOUT = 30_000;

    heartbeat(childId: string) {
        this.onlineDevices.set(childId, Date.now());
    }

    isOnline(childId: string): boolean {
        const lastPing = this.onlineDevices.get(childId);
        if (!lastPing) return false;

        return Date.now() - lastPing < this.TIMEOUT;
    }
}

export const devicePresence = new DevicePresence();