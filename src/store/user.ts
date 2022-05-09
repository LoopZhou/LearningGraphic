import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      name: 'loopzhou',
      age: 30,
    };
  },
  actions: {
    updateName(name: string) {
      this.name = name;
    },
    updateAge(age: number) {
      this.age = age;
    },
  },
});
