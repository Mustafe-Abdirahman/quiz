import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiLogIn, FiUsers, FiEdit2, FiTrash2, FiPlay } from 'react-icons/fi';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { useQuiz } from '../../context/QuizContext';
import { roomService } from '../../services/roomService';

export default function AdminRoomManagement() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { quizzes } = useQuiz();
  const [rooms, setRooms] = useState([]);
  const [editModal, setEditModal] = useState({ open: false, room: null });
  const [form, setForm] = useState({ quizId: '', maxPlayers: 4, status: 'waiting' });
  const [createModal, setCreateModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await roomService.getRooms();
      setRooms(data);
    }
    load();
  }, []);

  const refresh = async () => {
    const data = await roomService.getRooms();
    setRooms(data);
  };

  const openEdit = (room) => {
    setForm({ quizId: room.quizId, maxPlayers: room.maxPlayers, status: room.status });
    setEditModal({ open: true, room });
  };

  const handleUpdate = async () => {
    if (!form.quizId) { addToast('Please select a quiz', 'error'); return; }
    const result = await roomService.updateRoom(editModal.room.id, form);
    if (result.success) {
      addToast('Room updated', 'success');
      setEditModal({ open: false, room: null });
      await refresh();
    } else {
      addToast(result.message, 'error');
    }
  };

  const handleCreate = async () => {
    if (!selectedQuiz) { addToast('Please select a quiz', 'error'); return; }
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    const maxPlayers = quiz?.maxPlayers || 4;
    const result = await roomService.createRoom('admin', 'Admin', selectedQuiz, maxPlayers);
    if (result.success) {
      addToast(`Room created! Code: ${result.room.code}`, 'success');
      setCreateModal(false);
      setSelectedQuiz('');
      navigate(`/admin/room/${result.room.id}`);
    }
  };

  const handleJoin = async () => {
    if (!roomCode.trim()) { addToast('Please enter a room code', 'error'); return; }
    const result = await roomService.joinRoom(roomCode.toUpperCase(), 'admin', 'Admin');
    if (result.success) {
      addToast('Joined room!', 'success');
      setJoinModal(false);
      setRoomCode('');
      navigate(`/admin/room/${result.room.id}`);
    } else {
      addToast(result.message, 'error');
    }
  };

  const handleDelete = async (room) => {
    setConfirmDelete(room);
  };

  const confirmDeleteRoom = async () => {
    if (!confirmDelete) return;
    await roomService.deleteRoomById(confirmDelete.id);
    addToast('Room deleted', 'success');
    setConfirmDelete(null);
    await refresh();
  };

  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [rooms]);

  const quizOptions = useMemo(() => quizzes.map(q => ({
    value: q.id,
    label: `${q.thumbnail || '📝'} ${q.title} (${q.maxPlayers || 4}p)`,
  })), [quizzes]);

  const statusOptions = [
    { value: 'waiting', label: 'Waiting' },
    { value: 'playing', label: 'Playing' },
    { value: 'finished', label: 'Finished' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiUsers className="text-indigo-500" />
              Room Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rooms.length} rooms total</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setJoinModal(true)}>
              <FiLogIn size={16} /> Join Room
            </Button>
            <Button onClick={() => setCreateModal(true)}>
              <FiPlus size={16} /> Create Room
            </Button>
          </div>
        </div>

        {sortedRooms.length === 0 ? (
          <EmptyState
            icon={FiUsers}
            title="No rooms yet"
            description="Competition rooms created by users will appear here."
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {sortedRooms.map(room => {
              const quiz = quizzes.find(q => q.id === room.quizId);
              return (
                <Card key={room.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Room {room.code}</h3>
                    <Badge variant={room.status}>{room.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Quiz: {quiz?.title || 'Unknown'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Players: {room.players.length}/{room.maxPlayers || 4}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.players.map(p => (
                      <span key={p.userId} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                        {p.username} ({p.score})
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/room/${room.id}`)} className="flex-1">
                      <FiPlay size={14} /> Play
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openEdit(room)} className="flex-1">
                      <FiEdit2 size={14} /> Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(room)} className="flex-1">
                      <FiTrash2 size={14} /> Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Competition Room">
          <div className="space-y-4">
            <Select label="Select Quiz" value={selectedQuiz} onChange={e => setSelectedQuiz(e.target.value)}
              options={[{ value: '', label: 'Choose a quiz...' }, ...quizOptions]} />
            <Button onClick={handleCreate} className="w-full" disabled={!selectedQuiz}>
              <FiPlus size={16} /> Create Room
            </Button>
          </div>
        </Modal>

        <Modal isOpen={joinModal} onClose={() => setJoinModal(false)} title="Join Room">
          <div className="space-y-4">
            <Input label="Room Code" value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code" maxLength={6} />
            <Button onClick={handleJoin} className="w-full" disabled={roomCode.length < 4}>
              <FiLogIn size={16} /> Join Room
            </Button>
          </div>
        </Modal>

        <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false })} title="Edit Room">
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Room Code: <span className="font-mono font-bold text-gray-900 dark:text-white">{editModal.room?.code}</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Players: {editModal.room?.players.length}/{editModal.room?.maxPlayers}</p>
            </div>
            <Select label="Quiz" value={form.quizId} onChange={e => setForm({ ...form, quizId: e.target.value })}
              options={[{ value: '', label: 'Select a quiz...' }, ...quizOptions]} />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Players</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, maxPlayers: n })}
                    className={`w-10 h-10 rounded-lg text-sm font-medium border-2 transition-all ${
                      form.maxPlayers === n
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={statusOptions} />
            <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteRoom}
          title="Delete Room"
          message={confirmDelete ? `Are you sure you want to delete room "${confirmDelete.code}"? This action cannot be undone.` : ''}
        />
      </div>
    </AdminLayout>
  );
}
