import { storage } from './storage';
import { generateId, generateRoomCode } from '../utils/helpers';

export const roomService = {
  getRooms() {
    return storage.get(storage.keys.ROOMS) || [];
  },

  getRoomByCode(code) {
    const rooms = this.getRooms();
    return rooms.find(r => r.code === code);
  },

  createRoom(hostId, hostName, quizId, maxPlayers = 4) {
    const rooms = this.getRooms();
    const code = generateRoomCode();
    const newRoom = {
      id: generateId(),
      code,
      quizId,
      hostId,
      maxPlayers,
      players: [{ userId: hostId, username: hostName, score: 0, correct: 0, incorrect: 0, answers: [], finished: false, questionIds: [], currentQuestion: 0 }],
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    rooms.push(newRoom);
    storage.set(storage.keys.ROOMS, rooms);
    return { success: true, room: newRoom };
  },

  joinRoom(code, userId, username) {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.code === code);
    if (!room) return { success: false, message: 'Room not found' };
    if (room.status !== 'waiting') return { success: false, message: 'Game already started' };
    if (room.players.length >= (room.maxPlayers || 4)) return { success: false, message: 'Room is full' };
    if (room.players.find(p => p.userId === userId)) return { success: false, message: 'Already in room' };
    room.players.push({ userId, username, score: 0, correct: 0, incorrect: 0, answers: [], finished: false, questionIds: [], currentQuestion: 0 });
    storage.set(storage.keys.ROOMS, rooms);
    return { success: true, room };
  },

  startGame(code, allQuestionIds = []) {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.code === code);
    if (!room) return { success: false };
    room.status = 'playing';

    const playerCount = room.players.length;
    if (playerCount > 0 && allQuestionIds.length > 0) {
      const shuffled = [...allQuestionIds].sort(() => Math.random() - 0.5);
      const base = Math.floor(shuffled.length / playerCount);
      const remainder = shuffled.length % playerCount;
      let start = 0;
      room.players.forEach((p, i) => {
        const extra = i < remainder ? 1 : 0;
        const count = base + extra;
        p.questionIds = shuffled.slice(start, start + count);
        p.currentQuestion = 0;
        p.finished = false;
        p.score = 0;
        p.correct = 0;
        p.incorrect = 0;
        p.answers = [];
        start += count;
      });
    }

    storage.set(storage.keys.ROOMS, rooms);
    return { success: true, room };
  },

  nextPlayerQuestion(code, userId) {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.code === code);
    if (!room) return { success: false };
    const player = room.players.find(p => p.userId === userId);
    if (!player) return { success: false };
    player.currentQuestion += 1;
    storage.set(storage.keys.ROOMS, rooms);
    return { success: true, room };
  },

  submitAnswer(code, userId, questionIndex, answer, isCorrect, timeTaken) {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.code === code);
    if (!room) return { success: false };
    const player = room.players.find(p => p.userId === userId);
    if (!player) return { success: false };
    player.answers.push({ questionIndex, answer, isCorrect, timeTaken });
    if (isCorrect) {
      player.score += 10;
      player.correct += 1;
    } else {
      player.incorrect += 1;
    }
    storage.set(storage.keys.ROOMS, rooms);
    return { success: true, room };
  },

  nextQuestion(code) {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.code === code);
    if (!room) return { success: false };
    room.currentQuestion += 1;
    storage.set(storage.keys.ROOMS, rooms);
    return { success: true, room };
  },

  finishPlayer(code, userId) {
    const rooms = this.getRooms();
    const room = rooms.find(r => r.code === code);
    if (!room) return { success: false };
    const player = room.players.find(p => p.userId === userId);
    if (player) {
      player.finished = true;
      player.currentQuestion = player.questionIds.length;
    }
    const allFinished = room.players.every(p => p.finished);
    if (allFinished) {
      room.status = 'finished';
    }
    storage.set(storage.keys.ROOMS, rooms);
    return { success: true, room };
  },

  getRoomPlayers(code) {
    const room = this.getRoomByCode(code);
    if (!room) return [];
    return [...room.players].sort((a, b) => b.score - a.score);
  },

  deleteRoom(code) {
    let rooms = this.getRooms();
    rooms = rooms.filter(r => r.code !== code);
    storage.set(storage.keys.ROOMS, rooms);
  },

  getUserRooms(userId) {
    const rooms = this.getRooms();
    return rooms.filter(r => r.players.some(p => p.userId === userId) && r.status === 'finished');
  },
};
