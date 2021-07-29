<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="连结" placeholder="http://router.asus.com" required>
      <el-input v-model="form.url"></el-input>
    </el-form-item>
    <el-form-item label="帐户">
      <el-input v-model="form.user" placeholder="username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.pass" placeholder="password"></el-input>
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

<script>
import axios from "axios";
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      form: {
        url: "",
        user: "",
        pass: "",
      },
      loading: false,
      loading2: false,
    };
  },
  methods: {
    onSubmit() {
      this.loading2 = true;
      axios
        .post("/api/new", this.form)
        .then((response) => {
          // handle success
          console.log(response);
          ElMessage.success("创建成功！");
        })
        .catch((err) => {
          // handle error
          console.log(err.response);
          ElMessage.error(err.response.data.error);
        })
        .then(() => {
          // always executed
          this.loading2 = false;
        });
    },
    onCheck() {
      this.loading = true;
      axios
        .post("/api/check", { url: this.form.url })
        .then((response) => {
          // handle success
          console.log(response);
          ElMessage.success(response.data.status);
        })
        .catch((err) => {
          // handle error
          console.log(err.response);
          ElMessage.error(err.response.data.error);
        })
        .then(() => {
          // always executed
          this.loading = false;
        });
    },
  },
};
</script>