import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiLogIn, FiUsers, FiCopy, FiCheck } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import { useToast } from '../../components/ui/Toast';
import { roomService } from '../../services/roomService';
import { quizService } from '../../services/quizService';
import { roomRoute } from '../../utils/helpers';

export default function CompetitionRooms() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;
  const { quizzes } = useQuiz();
  const { addToast } = useToast();
  const [createModal, setCreateModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [newRoom, setNewRoom] = useState(null);

  const rooms = useMemo(() => roomService.getRooms(), []);
  const userRooms = rooms.filter(r => r.players.some(p => p.userId === user?.userId));
  const availableRooms = rooms.filter(r => r.status === 'waiting' && !r.players.some(p => p.userId === user?.userId));

  const handleCreate = () => {
    if (!selectedQuiz) { addToast('Please select a quiz', 'error'); return; }
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    const maxPlayers = quiz?.maxPlayers || 4;
    const result = roomService.createRoom(user?.userId, user?.username, selectedQuiz, maxPlayers);
    if (result.success) {
      setNewRoom(result.room);
      addToast(`Room created! Code: ${result.room.code}`, 'success');
      setCreateModal(false);
    }
  };

  const handleJoin = () => {
    if (!roomCode.trim()) { addToast('Please enter a room code', 'error'); return; }
    const result = roomService.joinRoom(roomCode.toUpperCase(), user?.userId, user?.username);
    if (result.success) {
      addToast('Joined room!', 'success');
      setJoinModal(false);
      navigate(roomRoute(role, `/room/${result.room.id}`));
    } else {
      addToast(result.message, 'error');
    }
  };

  const handleStart = (roomId) => {
    const room = roomService.getRoomById(roomId);
    const questionIds = quizService.getQuestionsByQuizId(room?.quizId).map(q => q.id);
    const result = roomService.startGame(room.code, questionIds);
    if (result.success) {
      navigate(roomRoute(role, `/room/${roomId}`));
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Code copied!', 'success');
  };

  const quizOptions = quizzes.map(q => ({
    value: q.id,
    label: `${q.thumbnail || '📝'} ${q.title} (${q.maxPlayers || 4}p)`,
  }));

  return (
    
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiUsers className="text-indigo-500" />
              Competition Rooms
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create or join a multiplayer quiz room</p>
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

        {newRoom && (
          <Card className="p-5 border-2 border-indigo-400 dark:border-indigo-500 animate-scaleIn">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Room Created!</p>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">{newRoom.code}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Share this code with other players</p>
              <div className="flex justify-center gap-2 mb-4">
                <Button size="sm" variant="secondary" onClick={() => handleCopyCode(newRoom.code)}>
                  {copied ? <><FiCheck size={14} /> Copied</> : <><FiCopy size={14} /> Copy Code</>}
                </Button>
                <Button size="sm" onClick={() => handleStart(newRoom.id)}>
                  Start Game
                </Button>
              </div>
              <p className="text-xs text-gray-400">Waiting for players... ({newRoom.players.length}/{newRoom.maxPlayers || 4})</p>
            </div>
          </Card>
        )}

        {availableRooms.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Open Rooms</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {availableRooms.map(room => {
                const quiz = quizzes.find(q => q.id === room.quizId);
                return (
                  <Card key={room.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Room {room.code}</h3>
                      <Badge variant="waiting">Open</Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Quiz: {quiz?.title || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Players: {room.players.length}/{room.maxPlayers || 4}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.players.map(p => (
                        <span key={p.userId} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                          {p.username}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" onClick={() => {
                      const result = roomService.joinRoom(room.code, user?.userId, user?.username);
                      if (result.success) navigate(roomRoute(role, `/room/${room.id}`));
                      else addToast(result.message, 'error');
                    }} className="w-full">
                      <FiLogIn size={14} /> Join
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {userRooms.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Rooms</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {userRooms.map(room => {
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
                          {p.username}{p.userId === user?.userId ? ' (You)' : ''}
                        </span>
                      ))}
                    </div>
                    {room.status === 'waiting' && room.hostId === user?.userId && (
                      <Button size="sm" onClick={() => handleStart(room.id)} className="w-full">
                        Start Game
                      </Button>
                    )}
                    {room.status === 'playing' && (
                      <Button size="sm" onClick={() => navigate(roomRoute(role, `/room/${room.id}`))} className="w-full">
                        Rejoin
                      </Button>
                    )}
                    {room.status === 'finished' && (
                      <Button size="sm" variant="secondary" onClick={() => navigate(roomRoute(role, `/room/${room.id}`))} className="w-full">
                        View Results
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {availableRooms.length === 0 && userRooms.length === 0 && !newRoom && (
          <EmptyState icon={FiUsers} title="No rooms available" description="Create a room or join one with a code." />
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
      </div>

  );
}
