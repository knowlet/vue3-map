<template>
  {{ name }}
  {{ car }}
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    color: {
      type: String,
      required: false,
    },
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