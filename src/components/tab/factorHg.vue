<template>
  <div>
    <el-container>
      <el-header>
        <el-steps
          :active="stepActive"
          align-center
          finish-status="success"
          style="margin-block: 20px"
        >
          <!-- <el-step
        title="选择数据集"
        description="选择构建超图的对象疾病和数据集"
      ></el-step>
      <el-step
        title="提交任务信息"
        description="编辑任务名称和构建超图类型"
      ></el-step> -->
          <el-step
            title="任务编辑"
            icon="el-icon-guide"
            description="编辑任务基础信息"
          ></el-step>
          <el-step title="数据选择" icon="el-icon-s-data"
            ><template #description>
              <div>选择构建超图的<br />目标疾病和数据集</div>
            </template></el-step
          >
          <el-step
            title="算法选择"
            icon="el-icon-data-analysis"
            description="选择构建超图的算法"
          ></el-step>
          <!-- <el-step title="特征选择" icon="el-icon-postcard"
            ><template #description>
              <div>选择算法应用的<br />属性列和标签列</div>
            </template></el-step
          > -->
          <el-step
            title="结果展示"
            icon="el-icon-share"
            description="危险因素超图可视化结果展示"
          ></el-step>
        </el-steps>
      </el-header>
      <el-divider></el-divider>
      <el-main v-if="stepActive === 0">
        <TaskInfo :moduleName="moduleName"></TaskInfo>
      </el-main>
      <el-main v-if="stepActive === 1">
        <DataSelect :moduleName="moduleName"></DataSelect>
      </el-main>
      <el-main v-if="stepActive === 2">
        <AlgorithmSelect :moduleName="moduleName"></AlgorithmSelect>
      </el-main>
      <!-- <el-main v-if="stepActive === 3">
        <FeatureSelect :moduleName="moduleName"></FeatureSelect>
      </el-main> -->
      <el-main v-if="stepActive === 3">
        <FactorHgVis :moduleName="moduleName"></FactorHgVis>
      </el-main>
    </el-container>
  </div>
</template>
  
<script>
import { mapState } from "vuex";
import TaskInfo from "@/components/tab/subcomponents/TaskInfo.vue";
import DataSelect from "@/components/tab/subcomponents/DataSelect.vue";
import AlgorithmSelect from "@/components/tab/subcomponents/AlgorithmSelect.vue";
import FeatureSelect from "@/components/tab/subcomponents/FeatureSelect.vue";
import FactorHgVis from "@/components/tab/subcomponents/factorHgVis.vue";
export default {
  name: "FactorHg",
  components: {
    TaskInfo,
    DataSelect,
    AlgorithmSelect,
    FeatureSelect,
    FactorHgVis,
  },
  data() {
    return {
      moduleName: "factorHg",
    };
  },
  methods: {},
  computed: {
    ...mapState("factorHg", ["stepActive"]),
  },
  watch: {},
  created() {},
  mounted() {},
};
</script>
  
<style scoped>
.el-divider {
  margin-top: 10vh;
}
</style>