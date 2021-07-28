<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :router="true"
  >
    <el-menu-item index="/">处理中心</el-menu-item>
    <el-menu-item index="/new">新增订单</el-menu-item>
    <el-menu-item index="/batch">批量新增</el-menu-item>
  </el-menu>
  <div class="line"></div>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  data() {
    return {
      activeIndex: location.pathname,
    };
  },
});
</script>
<style scoped>
.line {
  padding-bottom: 1em;
}
</style>