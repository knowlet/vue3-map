<template>
  {{ car }}
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    car: {
      type: Object,
      required: true,
    },
  },
});
</script>