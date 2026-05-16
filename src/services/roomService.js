import { api } from './api';

export const roomService = {
  async getRooms() {
    const result = await api.get('/rooms');
    return result.success ? result.rooms : [];
  },

  async getRoomByCode(code) {
    const result = await api.get(`/rooms/code/${code}`);
    return result.success ? result.room : null;
  },

  async getRoomById(id) {
    const result = await api.get(`/rooms/${id}`);
    return result.success ? result.room : null;
  },

  async createRoom(hostId, hostName, quizId, maxPlayers = 4) {
    return api.post('/rooms', { quizId, maxPlayers });
  },

  async joinRoom(code, userId, username) {
    return api.post('/rooms/join', { code });
  },

  async startGame(code, allQuestionIds = []) {
    const room = await this.getRoomByCode(code);
    if (!room) return { success: false, message: 'Room not found' };
    return api.post(`/rooms/${room.id}/start`);
  },

  async nextPlayerQuestion(code, userId) {
    return { success: true };
  },

  async submitAnswer(code, userId, questionIndex, answer, isCorrect, timeTaken) {
    const room = await this.getRoomByCode(code);
    if (!room) return { success: false };
    return { success: true, room };
  },

  async nextQuestion(code) {
    return { success: true };
  },

  async finishPlayer(code, userId) {
    return { success: true };
  },

  getRoomPlayers(code) {
    return [];
  },

  async updateRoom(id, data) {
    return api.put(`/rooms/${id}`, data);
  },

  async deleteRoom(code) {
    const room = await this.getRoomByCode(code);
    if (room) return api.delete(`/rooms/${room.id}`);
    return { success: false };
  },

  async deleteRoomById(id) {
    return api.delete(`/rooms/${id}`);
  },

  async getUserRooms(userId) {
    const rooms = await this.getRooms();
    return rooms.filter(r => r.players.some(p => p.userId === userId) && r.status === 'finished');
  },
};
