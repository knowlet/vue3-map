<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="车辆订单">
      <el-input type="textarea" v-model="form.cars"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onClear">清除</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        cars: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    onClear() {
      this.form.cars = "";
    },
  },
};
</script>