<template>
  <p>Name:</p>
  <div>{{ userStore.name }}</div>
  <p>Age:</p>
  <div>{{ userStore.age }}</div>
  <button type="button" @click="onChangeAge">增加Age</button>
  <button type="button" @click="onChangeName">改变Name</button>
  <button type="button" @click="reset">重置</button>
  <button type="button" @click="onChange">批量改变</button>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
const onChangeAge = () => {
  // 使用action
  userStore.updateAge(userStore.age + 1);
};
const onChangeName = () => {
  // 直接调整
  userStore.name = `${userStore.name}-${userStore.age}`;
};
const reset = () => {
  // 重置
  userStore.$reset();
};
const onChange = () => {
  // 批量调整
  userStore.$patch({
    name: 'loop',
    age: 1,
  });

  const { name, age } = storeToRefs(userStore);
  setTimeout(() => {
    name.value = '123';
    age.value = 20;
  }, 2000);
};
</script>
