import { useState, useEffect } from 'react';
import { FiWifiOff, FiWifi, FiRefreshCw } from 'react-icons/fi';
import { syncOfflineData, offlineQueue } from '../../services/offlineSync';
import { useToast } from '../ui/Toast';

export default function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    if (online) {
      const pending = offlineQueue.pendingCount;
      if (pending > 0) {
        setSyncing(true);
        syncOfflineData().then(({ synced, failed }) => {
          setSyncing(false);
          if (synced > 0) addToast(`Synced ${synced} offline attempt${synced > 1 ? 's' : ''}`, 'success');
          if (failed > 0) addToast(`${failed} attempt${failed > 1 ? 's' : ''} failed to sync`, 'error');
        });
      }
    }
  }, [online, addToast]);

  if (online) return null;

  return (
    <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 shadow-lg">
      <FiWifiOff size={16} />
      <span>You are offline. Quiz data is loaded from cache.</span>
      {syncing && (
        <span className="flex items-center gap-1 ml-2">
          <FiRefreshCw size={14} className="animate-spin" />
          Syncing...
        </span>
      )}
    </div>
  );
}
