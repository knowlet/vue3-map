<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="车辆订单">
      <el-input type="textarea" v-model="form.cars"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-loading="loading" @click="onSubmit"
        >立即创建</el-button
      >
      <el-button @click="onClear">清除</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      loading: false,
      form: {
        cars: "",
      },
    };
  },
  methods: {
    onSubmit() {
      this.loading = true;
      const cars = this.form.cars
        .split(/[\r\n]+/)
        .map((car) => {
          const [url, user, pass] = car.split(/\,/).map((item) => item.trim());
          return {
            url,
            user,
            pass,
          };
        })
        .filter((car) => !!car.url);
      if (cars.length <= 0) {
        ElMessage.error("未输入车辆信息");
      }
      axios
        .post("/api/batch", cars)
        .then((response) => {
          // handle success
          console.log(response);
          ElMessage.success(
            `订单已经提交！输入：${response.data.input}个  建立：${response.data.output}个 `
          );
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
      console.log(cars);
      this.loading = false;
    },
    onClear() {
      this.form.cars = "";
    },
  },
};
</script>