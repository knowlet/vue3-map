<template>
  <el-descriptions
    class="margin-top"
    :title="name"
    :column="1"
    size="mini"
    border
  >
    <template #extra>
      <el-button
        type="primary"
        size="mini"
        @click="onCheck(car.url)"
        v-loading="loading"
        >测试</el-button
      >
    </template>
    <el-descriptions-item min-width="64px">
      <template #label>
        <i class="el-icon-user"></i>
        用户
      </template>
      {{ car.user }}
      <i
        class="el-icon-document-copy copyBtn"
        data-clipboard-action="copy"
        :data-clipboard-text="car.user"
      ></i>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-lock"></i>
        密码
      </template>
      {{ car.pass }}
      <i
        class="el-icon-document-copy copyBtn"
        data-clipboard-action="copy"
        :data-clipboard-text="car.pass"
      ></i>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-mobile-phone"></i>
        ＩＰ
      </template>
      {{ car.ip }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-office-building"></i>
        城市
      </template>
      {{ car.country }} {{ car.province }} {{ car.city }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-location-information"></i>
        座标
      </template>
      <a :href="`http://api.map.baidu.com/marker?location=${car.lat},${car.lng}&output=html&title=車車地圖&content=帶你尋找車車`" target="_blank" rel="noopener noreferrer">
        <el-tag size="small">{{ car.lng }}</el-tag>
        <el-tag size="small">{{ car.lat }}</el-tag>
      </a>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-link"></i>
        地址
      </template>
      <a :href="car.url" target="_blank" rel="noopener noreferrer">{{
        car.url
      }}</a>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-link"></i>
        廠牌
      </template>
      {{ car.vendor }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <i class="el-icon-link"></i>
        模式
      </template>
      {{ car.protocol }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { defineComponent } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import Clipboard from "clipboard";
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
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    onCheck(url) {
      this.loading = true;
      axios
        .post("/api/check", { url: url })
        .then((response) => {
          // handle success
          console.log(response);
          ElMessage.success(response.data.status);
        })
        .catch((err) => {
          // handle error
          console.log(err.response);
          ElMessage.error(err?.response?.data.error ?? err.message);
        })
        .then(() => {
          // always executed
          this.loading = false;
        });
    },
  },
  mounted() {
    const clipboard = new Clipboard(".copyBtn");
    clipboard.on("success", function (e) {
      console.info("Action:", e.action);
      console.info("Text:", e.text);
      console.info("Trigger:", e.trigger);
      ElMessage.success("已复制！");
      e.clearSelection();
    });

    clipboard.on("error", function (e) {
      console.error("Action:", e.action);
      console.error("Trigger:", e.trigger);
    });
  },
});
</script>