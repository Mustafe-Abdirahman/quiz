import { useState, useEffect, useMemo } from 'react';
import { FiAward, FiUsers } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/common/EmptyState';
import { roomService } from '../../services/roomService';
import { getInitials } from '../../utils/helpers';

export default function CompetitionMonitor() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await roomService.getRooms();
      setRooms(data);
    }
    load();
  }, []);

  const finishedRooms = useMemo(() => rooms.filter(r => r.status === 'finished'), [rooms]);
  const activeRooms = useMemo(() => rooms.filter(r => r.status !== 'finished'), [rooms]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Competition Monitor</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeRooms.length} active • {finishedRooms.length} completed
          </p>
        </div>

        {activeRooms.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiUsers size={18} className="text-indigo-500" />
              Active Rooms
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {activeRooms.map(room => (
                <Card key={room.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Room {room.code}</h3>
                    <Badge variant={room.status}>{room.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Players: {room.players.length}/4</p>
                  <div className="flex flex-wrap gap-2">
                    {room.players.map(p => (
                      <span key={p.userId} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                        {p.username} ({p.score})
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FiAward size={18} className="text-indigo-500" />
            Completed Competitions
          </h2>
          {finishedRooms.length === 0 ? (
            <EmptyState icon={FiAward} title="No competitions yet" description="Completed multiplayer games will appear here." />
          ) : (
            <div className="space-y-3">
              {finishedRooms.map(room => {
                const sorted = [...room.players].sort((a, b) => b.score - a.score);
                return (
                  <Card key={room.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Room {room.code}</h3>
                      <span className="text-xs text-gray-500">{new Date(room.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-2">
                      {sorted.map((p, i) => (
                        <div key={p.userId} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>
                            {i + 1}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {getInitials(p.username)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{p.username}</p>
                            <p className="text-xs text-gray-500">{p.correct} correct • {p.incorrect} incorrect</p>
                          </div>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{p.score}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
