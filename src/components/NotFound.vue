<template></template>

<script>
import { defineComponent } from "vue";
import { ElMessage } from "element-plus";
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
