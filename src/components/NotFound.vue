<template></template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent } from "vue";
import router from "../router";

export default defineComponent({
  setup() {
    ElMessage({
      onClose: () => {
        router.push("/");
      },
      message: "找不到页面 ",
      type: "error",
    });
  },
});
</script>
