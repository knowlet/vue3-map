<template>
  <el-form :model="form" label-width="80px">
    <el-form-item label="连结" placeholder="http://router.asus.com" required>
      <el-input v-model="form.url"></el-input>
    </el-form-item>
    <el-form-item label="帐户">
      <el-input v-model="form.user" placeholder="username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.pass" placeholder="password"></el-input>
    </el-form-item>
    <el-form-item label="地區">
      <el-input v-model="form.country" placeholder="中国"></el-input>
    </el-form-item>
    <el-form-item label="省份">
      <el-input v-model="form.province" placeholder="上海"></el-input>
    </el-form-item>
    <el-form-item label="城市">
      <el-input v-model="form.city" placeholder="上海市"></el-input>
    </el-form-item>
    <el-form-item label="單位">
      <el-input v-model="form.unit" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="廠牌">
      <el-input v-model="form.vendor" placeholder="飞鱼星企业级智能上网行为管理系统"></el-input>
    </el-form-item>
    <el-form-item label="模式">
      <el-input v-model="form.protocol" placeholder="PPTP"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="success" v-loading="loading" @click="onCheck"
        >连接测试</el-button
      >
      <el-button type="primary" v-loading="loading2" @click="onSubmit"
        >立即创建</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { encode } from "@msgpack/msgpack";
import axios from "axios";
import { ElMessage } from "element-plus";
import { reactive, ref } from 'vue';

// do not use same name with ref
const form = reactive({
  url: "",
  user: "",
  pass: "",
  country: "",
  province: "",
  city: "",
  unit: "",
  vendor: "",
  protocol: "",
  lng: 0,
  lat: 0,
})


const loading = ref(false);
const loading2 = ref(false);

const onSubmit = () => {
  loading2.value = true;
  axios
      .post("/api/new", encode(form))
      .then((response) => {
      // handle success
      console.log(response);
      ElMessage.success("创建成功！");
  })
      .catch((err) => {
      // handle error
      console.log(err);
      ElMessage.error(err?.response?.data.error ?? err.message);
  })
      .then(() => {
      // always executed
      loading2.value = false;
  });
}

const onCheck = () => {
  if (!form.url) {
    ElMessage.error("请输入连结！");
    return;
  }
  loading.value = true;
  axios
      .post("/api/check", { url: form.url })
      .then((response) => {
      // handle success
      console.log(response);
      ElMessage.success(response.data.status);
  })
      .catch((err) => {
      // handle error
      console.log(err.response);
      ElMessage.error(err?.response?.data.error ?? err.message);
  })
      .then(() => {
      // always executed
      loading.value = false;
  });
}
</script>
