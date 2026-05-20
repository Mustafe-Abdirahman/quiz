import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiUsers, FiClock, FiZap } from 'react-icons/fi';
import Timer from '../../components/common/Timer';
import { roomService } from '../../services/roomService';
import { quizService } from '../../services/quizService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { getInitials, roomRoute } from '../../utils/helpers';

export default function MultiplayerRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;
  const { addToast } = useToast();

  const [room, setRoom] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [players, setPlayers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  const intervalRef = useRef(null);

  const myQuestions = useMemo(() => {
    if (!room || !allQuestions.length) return [];
    const me = room.players.find(p => p.userId === user?.userId);
    if (!me || !me.questionIds?.length) return [];
    return me.questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean);
  }, [room, allQuestions, user]);

  const refreshRoom = useCallback(async () => {
    const r = await roomService.getRoomById(id);
    if (!r) return;
    setRoom(r);
    setPlayers([...r.players].sort((a, b) => b.score - a.score));
    if (r.status === 'finished') {
      setFinished(true);
      const sorted = [...r.players].sort((a, b) => b.score - a.score);
      setWinner(sorted[0]);
      clearInterval(intervalRef.current);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const r = await roomService.getRoomById(id);
      if (!r || cancelled) { navigate(roomRoute(role, '/rooms')); return; }
      if (cancelled) return;
      setRoom(r);
      setPlayers([...r.players].sort((a, b) => b.score - a.score));

      const q = await quizService.getQuizById(r.quizId);
      if (q && !cancelled) {
        setQuiz(q);
        const qs = await quizService.getQuestionsByQuizId(r.quizId);
        if (!cancelled) setAllQuestions(qs);
      }

      if (r.status === 'finished' && !cancelled) {
        setFinished(true);
        const sorted = [...r.players].sort((a, b) => b.score - a.score);
        setWinner(sorted[0]);
      }

      intervalRef.current = setInterval(() => { refreshRoom(); }, 1000);
    }
    init();
    return () => clearInterval(intervalRef.current);
  }, [id, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartGame = async () => {
    const qIds = allQuestions.map(q => q.id);
    const result = await roomService.startGame(room.code, qIds);
    if (result.success) {
      const updatedRoom = await roomService.getRoomById(room.id);
      setRoom(updatedRoom);
      setPlayers([...updatedRoom.players].sort((a, b) => b.score - a.score));
    }
  };

  const handleRestart = async () => {
    const qIds = allQuestions.map(q => q.id);
    const result = await roomService.startGame(room.code, qIds);
    if (result.success) {
      setFinished(false);
      setWinner(null);
      setCurrentQ(0);
      setSelectedAnswer(null);
      setAnswered(false);
      setIsRunning(true);
      setTimerKey(k => k + 1);
      const updatedRoom = await roomService.getRoomById(room.id);
      setRoom(updatedRoom);
      setPlayers([...updatedRoom.players].sort((a, b) => b.score - a.score));
    }
  };

  const handleAnswer = useCallback(async (idx) => {
    if (answered || !room || !myQuestions[currentQ]) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    setIsRunning(false);
    const isCorrect = idx === myQuestions[currentQ].correctAnswer;
    await roomService.submitAnswer(room.id, user?.userId, currentQ, idx, isCorrect, 0);
    await refreshRoom();
  }, [answered, room, myQuestions, currentQ, user, refreshRoom]);

  const handleTimeUp = useCallback(async () => {
    if (answered || !room || !myQuestions[currentQ]) return;
    setAnswered(true);
    setIsRunning(false);
    await roomService.submitAnswer(room.id, user?.userId, currentQ, -1, false, 60);
    await refreshRoom();
  }, [answered, room, myQuestions, currentQ, user, refreshRoom]);

  const nextQuestion = useCallback(async () => {
    const nextIdx = currentQ + 1;
    if (nextIdx < myQuestions.length) {
      setCurrentQ(nextIdx);
      setSelectedAnswer(null);
      setAnswered(false);
      setIsRunning(true);
      setTimerKey(k => k + 1);
    }
  }, [currentQ, myQuestions.length]);

  useEffect(() => {
    if (!room || !allQuestions.length) return;
    if (room.status === 'finished' && !finished) {
      setFinished(true);
      const sorted = [...room.players].sort((a, b) => b.score - a.score);
      setWinner(sorted[0]);
      clearInterval(intervalRef.current);
    }
  }, [room, myQuestions, finished]);

  const currentPlayerIdx = room?.currentTurn ?? 0;
  const currentPlayer = room?.players?.[currentPlayerIdx];
  const isMyTurn = currentPlayer?.userId === user?.userId;

  if (!room || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (room.status === 'waiting') {
    const myPlayer = room.players.find(p => p.userId === user?.userId);
    const myQCount = myPlayer?.questionIds?.length || allQuestions.length || 0;

    return (
      <div className="flex items-center justify-center p-4 min-h-[100dvh]">
        <div className="w-full max-w-lg text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Waiting Room</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Room: <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{room.code}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Quiz: {quiz.title}</p>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Players ({room.players.length}/{room.maxPlayers || 4}):
              </p>
              <div className="space-y-2">
                {room.players.map((p, i) => (
                  <div key={p.userId} className={`flex items-center gap-3 p-3 rounded-xl ${
                    p.userId === user?.userId
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-200 dark:ring-indigo-800'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                      {getInitials(p.username)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white flex-1 text-left">
                      {p.username}{p.userId === user?.userId ? ' (You)' : ''}
                    </span>
                    {p.userId === room.hostId && (
                      <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">Host</span>
                    )}
                  </div>
                ))}
              </div>
              {myPlayer && (
                <p className="text-xs text-gray-400 mt-4">
                  {allQuestions.length} questions &middot; {room.players.length} player{room.players.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {room.hostId === user?.userId && (
              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                Start Game
              </button>
            )}
            {room.hostId !== user?.userId && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Waiting for host to start the game...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const sorted = [...room.players].sort((a, b) => b.score - a.score);
    const isTie = sorted.length >= 2 && sorted[0].score === sorted[1].score;

    return (
      <div className="flex items-center justify-center p-4 min-h-[100dvh]">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-scaleIn">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{isTie ? '🤝' : '🏆'}</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {isTie ? "It's a Tie!" : 'Winner!'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{quiz.title}</p>
            </div>

            {winner && !isTie && (
              <div className="text-center mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">{winner.username}</div>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Score: {winner.score}</span>
                  <span>Correct: {winner.correct}</span>
                  <span>Incorrect: {winner.incorrect}</span>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-6">
              {sorted.map((p, i) => (
                <div key={p.userId} className={`flex items-center gap-3 p-3 rounded-lg ${
                  i === 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 ring-1 ring-yellow-400' : 'bg-gray-50 dark:bg-gray-700/50'
                }`}>
                  <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {getInitials(p.username)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {p.username}{p.userId === user?.userId ? ' (You)' : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.correct} correct &bull; {p.incorrect} incorrect &bull; {p.answers?.length || 0} answered
                    </p>
                  </div>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{p.score}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(roomRoute(role, '/rooms'))}
                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Rooms
              </button>
              {(room.hostId === user?.userId || role === 'admin') && (
                <button
                  onClick={handleRestart}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (room.status === 'playing' && !isMyTurn) {
    const myPlayer = room.players.find(p => p.userId === user?.userId);
    const myFinished = myPlayer?.finished;

    return (
      <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-full max-w-md text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10">
            {myFinished ? (
              <>
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You&apos;re Done!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  You answered all your questions. Waiting for other players to finish...
                </p>
                {myPlayer && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                    <FiZap size={14} /> Score: {myPlayer.score} &middot; {myPlayer.correct}/{myPlayer.correct + myPlayer.incorrect} correct &middot; {myQuestions.length} questions
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">⏳</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Waiting for Player</h2>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-sm font-bold text-white">
                    {currentPlayer ? getInitials(currentPlayer.username) : '?'}
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{currentPlayer?.username || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">is answering a question...</p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <FiClock size={12} /> Please wait for your turn
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = myQuestions[currentQ];
  const myTotal = myQuestions.length || 1;
  const me = room?.players?.find(p => p.userId === user?.userId);

  if (!question) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[100dvh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {getInitials(me?.username || '?')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Your Turn</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Question {currentQ + 1} of {myTotal}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{me?.score || 0} pts</p>
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / myTotal) * 100}%` }} />
          </div>

          <Timer key={timerKey} duration={quiz.timePerQuestion || 60} onTimeUp={handleTimeUp} isRunning={isRunning} />

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-4 animate-fadeIn">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{question.text}</h2>
            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                let btnClass = 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20';
                if (answered) {
                  if (idx === question.correctAnswer) {
                    btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
                  } else if (idx === selectedAnswer && idx !== question.correctAnswer) {
                    btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
                  } else {
                    btnClass = 'border-gray-200 dark:border-gray-600 opacity-50';
                  }
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} disabled={answered}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${btnClass}`}>
                    <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-sm font-medium">{opt}</span>
                    {answered && idx === question.correctAnswer && <FiCheck className="text-green-500 shrink-0" size={18} />}
                    {answered && idx === selectedAnswer && idx !== question.correctAnswer && <FiX className="text-red-500 shrink-0" size={18} />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 animate-fadeIn">
                <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  selectedAnswer === question.correctAnswer
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {selectedAnswer === question.correctAnswer
                    ? <><FiCheck size={16} /> Correct! +10 points</>
                    : <><FiX size={16} /> Incorrect! Answer: {question.options[question.correctAnswer]}</>}
                </div>
                <button onClick={nextQuestion} className="mt-4 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                  {currentQ + 1 < myTotal ? 'Next Question' : 'Finish'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiUsers size={16} className="text-indigo-500" />
              Leaderboard
            </h3>
            <div className="space-y-2">
              {players.map((p, i) => {
                const pTotal = p.questionIds?.length || allQuestions.length || 0;
                const pProgress = p.finished ? pTotal : Math.min(p.currentQuestion || 0, pTotal);
                const isCurrent = p.userId === currentPlayer?.userId;
                return (
                  <div key={p.userId} className={`flex items-center gap-2 p-2 rounded-lg ${
                    p.userId === user?.userId
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : isCurrent
                        ? 'bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-300 dark:ring-purple-700'
                        : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}>
                    <span className="text-xs font-bold text-gray-500 w-4">{i + 1}</span>
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                      {getInitials(p.username)}
                    </div>
                    <span className="text-xs font-medium text-gray-900 dark:text-white flex-1 truncate">{p.username}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 block">{p.score}</span>
                      <span className="text-[10px] text-gray-400">{pProgress}/{pTotal}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
