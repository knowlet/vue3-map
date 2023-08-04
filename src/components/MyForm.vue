<template>
  <el-form :model="props.formModel" label-width="80px">
    <el-form-item label="连结" placeholder="http://router.asus.com" required>
      <el-input v-model="props.formModel.url"></el-input>
    </el-form-item>
    <el-form-item label="帐户">
      <el-input v-model="props.formModel.user" placeholder="username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="props.formModel.pass" placeholder="password"></el-input>
    </el-form-item>
    <el-form-item label="地區">
      <el-input v-model="props.formModel.country" placeholder="中国"></el-input>
    </el-form-item>
    <el-form-item label="省份">
      <el-input v-model="props.formModel.province" placeholder="上海"></el-input>
    </el-form-item>
    <el-form-item label="城市">
      <el-input v-model="props.formModel.city" placeholder="上海市"></el-input>
    </el-form-item>
    <el-form-item label="單位">
      <el-input v-model="props.formModel.unit" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="廠牌">
      <el-input v-model="props.formModel.vendor" placeholder="飞鱼星企业级智能上网行为管理系统"></el-input>
    </el-form-item>
    <el-form-item label="模式">
      <el-input v-model="props.formModel.protocol" placeholder="PPTP"></el-input>
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

const loading = ref(false);
const loading2 = ref(false);

export interface Props {
  submitFunc?: Function
  formModel?: any
}

const props = withDefaults(defineProps<Props>(), {
  submitFunc: (form) => {
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
  },
  formModel: reactive({
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
})

const onSubmit = () => {
  if (!props.formModel.url) {
    ElMessage.error("请输入连结！");
    return;
  }
  loading2.value = true;
  props.submitFunc(props.formModel)
  loading2.value = false;
}

const onCheck = () => {
  if (!props.formModel.url) {
    ElMessage.error("请输入连结！");
    return;
  }
  loading.value = true;
  axios
      .post("/api/check", { url: props.formModel.url })
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
