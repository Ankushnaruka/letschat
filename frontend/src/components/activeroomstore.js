import { create } from 'zustand';

const roomStore = create((set) => ({
  activeroom: "",
  setactiveroom: (room) => set({ activeroom: room })
}));

export default roomStore;