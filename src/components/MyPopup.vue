<template>
  {{ name }}
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    popupContent: {
      type: String,
      required: false,
    },
  },
});
</script>