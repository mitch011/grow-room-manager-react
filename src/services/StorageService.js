// src/services/StorageService.js

const ROOMS_KEY = 'growRoomManager_rooms';
const LAST_ROOM_KEY = 'growRoomManager_lastActiveRoom';

const StorageService = {
  saveRooms(rooms) {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  },

  loadRooms() {
    const data = localStorage.getItem(ROOMS_KEY);
    return data ? JSON.parse(data) : {};
  },

  saveLastActiveRoom(roomName) {
    localStorage.setItem(LAST_ROOM_KEY, roomName);
  },

  loadLastActiveRoom() {
    return localStorage.getItem(LAST_ROOM_KEY) || '';
  },

  saveRoomData(roomName, roomData) {
    const rooms = StorageService.loadRooms();
    rooms[roomName] = roomData;
    StorageService.saveRooms(rooms);
    StorageService.saveLastActiveRoom(roomName);
  },

  deleteRoom(roomName) {
    const rooms = StorageService.loadRooms();
    delete rooms[roomName];
    StorageService.saveRooms(rooms);

    const remainingRooms = Object.keys(rooms);
    return remainingRooms.length > 0 ? remainingRooms[0] : '';
  }
};

export default StorageService;
