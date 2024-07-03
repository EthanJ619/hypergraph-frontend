<template>
  <div>
    <div class="container">
      <div style="font-size: 65px; font-weight: bolder; font-style: italic">
        疾病危险因素跨时空超图构建工具软件
      </div>
      <div class="size-icon" style="grid-template-columns: repeat(3, 400px)">
        <div v-for="(item, index) in quickEntry" :key="index" class="icon">
          <div class="singleBox" @click="quickLink(item.router)">
            <img :src="item.img" class="imgStyle" style="border-radius: 15px" />
            <h3 style="font-size: 40px">{{ item.title }}</h3>
          </div>
        </div>
      </div>
      <div class="size-icon" style="grid-template-columns: repeat(2, 400px)">
        <div class="icon">
          <div class="singleBox" @click="quickLink('HGconstruct')">
            <img
              src="@/assets/graphconstruct.png"
              class="imgStyle"
              style="border-radius: 15px"
            />
            <h3 style="font-size: 40px">超图构建</h3>
          </div>
        </div>
        <div class="icon">
          <div class="singleBox" @click="quickLink('taskManage')">
            <img
              src="@/assets/taskmanage.png"
              class="imgStyle"
              style="border-radius: 15px"
            />
            <h3 style="font-size: 40px">任务记录</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "intro",

  data() {
    return {
      quickEntry: [
        {
          title: "主页",
          img: require("@/assets/homepage.png"),
          router: "index",
        },
        {
          title: "数据管理",
          img: require("@/assets/dataManage.png"),
          router: "dataManage",
        },
        {
          title: "系统设置",
          img: require("@/assets/fieldmanage.png"),
          // router: "",
        },
      ],
    };
  },

  methods: {
    quickLink(router) {
      this.$router.push(router);
    },
  },

  created() {},

  mounted() {},
};
</script>
  
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  flex-flow: column;
}
.size-icon {
  font-size: 80px;
  display: grid;

  /* grid-template-rows: repeat(2, 300px); */
  gap: 5px;
  justify-items: center;
  align-items: center;
  margin-top: 80px;
}
.icon {
  display: grid;
  place-items: center;
  text-align: center;
  cursor: pointer;
}
.icon svg-icon {
  max-width: 100%;
  vertical-align: middle;
}
.icon h3 {
  margin-top: 10px;
}
.imgStyle {
  height: 200px;
  width: 200px;
}
</style>
  