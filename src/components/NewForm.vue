<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="连结">
      <el-input v-model="form.url"></el-input>
    </el-form-item>
    <el-form-item label="帐户">
      <el-input v-model="form.user"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.pass"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="success"
        ><i class="el-icon-connection"></i> 连接测试
      </el-button>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        url: "",
        user: "",
        pass: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>