<template>
  <el-select v-model="value" placeholder="下載省份資料" size="large" @change="downloadCar" :loading="loading">
    <el-option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref('')
const options = ref<string[]>([]);
const loading = ref(false);

fetch("/api/provinces")
  .then((res) => res.json())
  .then((data) => {
    options.value = data;
    loading.value = false;
  })
  .catch((err) => {
    options.value = [];
    console.log(err);
    loading.value = false;
  });

function downloadCar() {
  loading.value = true;
  if (value.value) {
    window.open("/api/cars/" + value.value);
  }
  value.value = "";
  loading.value = false;
}
</script>