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
      message: "只是一条消息提示",
    });
  },
});
</script>
