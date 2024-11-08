<template>
  <div>
    <el-container>
      <el-header class="header">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          router
          @select="handleSelect"
          style="background-color: #071135; border: 0px"
        >
          <el-menu-item
            index="/index"
            @click="toIndex()"
            style="font-size: 20px; font-weight: bolder"
          >
            <!-- <img
              style="max-width: 25px; margin-right: 15px"
              src="../../assets/logo.png"
              alt="logo"
            /> -->
            <i
              class="el-icon-box"
              style="font-size: 25px; margin-right: 15px"
            ></i>
            疾病危险因素跨时空超图构建工具软件</el-menu-item
          >
          <!--            <template slot="title">当前服务器：</template>-->
          <!-- <el-menu-item index="2" style="float: right" @click.native="logout"
            ><i class="el-icon-close el-icon"></i>退出登录</el-menu-item
          > -->
          <el-menu-item index="/userCenter" style="float: right"
            ><i class="el-icon-user el-icon"></i>个人中心</el-menu-item
          >
          <!--          <el-menu-item index="3" disabled>消息中心</el-menu-item>-->
          <!--          <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
        </el-menu>
      </el-header>
      <el-container class="mainCon">
        <div
          @mouseenter="
            isCollapse = false;
            sidewidth = '200px';
          "
          @mouseleave="
            isCollapse = true;
            sidewidth = '64px';
          "
          style="height: inherit"
        >
          <!-- <el-aside
            class="side"
            :style="{
              width: sidewidth,
              transition: 'all 0.5s ease-in-out',
              overflow: 'hidden',
            }"
          > -->
          <el-aside
            class="side"
            :style="{
              transition: 'all 0.5s ease-in-out',
              overflow: 'hidden',
            }"
          >
            <el-menu
              router
              class="el-menu-vertical-demo"
              @open="handleOpen"
              style="height: 80%"
            >
              <div class="sidebar" @click="handleNavi(1)">
                <el-menu-item
                  index="/index"
                  :class="
                    this.sideBarActive === 1 ? 'active-bar' : 'inactive-bar'
                  "
                >
                  <i :class="['el-icon-s-home', 'icon']"></i>
                  <span slot="title" class="sidetext">首页</span>
                </el-menu-item>
              </div>
              <div class="sidebar" @click="handleNavi(2)">
                <el-menu-item
                  index="/dataManage"
                  :class="
                    this.sideBarActive === 2 ? 'active-bar' : 'inactive-bar'
                  "
                >
                  <i :class="['icon-db', 'icon-custom']"></i>
                  <span slot="title" class="sidetext">数据管理</span>
                </el-menu-item>
              </div>
              <!-- <div class="sidebar" @click="handleNavi(3)">
                <el-menu-item
                  index="/columnManage"
                  :class="this.sideBarActive === 3 ? 'active-bar' : 'inactive-bar'"
                >
                  <i
                    :class="[
                      'icon-field',
                      'icon-custom',
                    ]"
                    
                  ></i>
                  <span slot="title" class="sidetext">字段管理</span>
                </el-menu-item>
              </div> -->
              <el-submenu index="1">
                <template slot="title">
                  <div class="inactive-bar">
                    <i :class="['icon-graph', 'icon-custom']"></i>
                    <span slot="title" class="sidetext">超图构建</span>
                  </div>
                </template>
                <div class="sidebar submenu-bar" @click="handleNavi(4)">
                  <el-menu-item
                    index="/factorHg"
                    :class="
                      this.sideBarActive === 4 ? 'active-bar' : 'inactive-bar'
                    "
                  >
                    <span slot="title" class="sub-sidetext"
                      >危险因素超图构建</span
                    >
                  </el-menu-item>
                </div>
                <div class="sidebar submenu-bar" @click="handleNavi(5)">
                  <el-menu-item
                    index="/spatialHg"
                    :class="
                      this.sideBarActive === 5 ? 'active-bar' : 'inactive-bar'
                    "
                  >
                    <span slot="title" class="sub-sidetext"
                      >空间多层网络构建</span
                    >
                  </el-menu-item>
                </div>
              </el-submenu>
              <div class="sidebar" @click="handleNavi(6)">
                <el-menu-item
                  index="/taskManage"
                  :class="
                    this.sideBarActive === 6 ? 'active-bar' : 'inactive-bar'
                  "
                >
                  <i :class="['el-icon-time', 'icon']"></i>
                  <span slot="title" class="sidetext">任务记录</span>
                </el-menu-item>
              </div>

              <!-- 旧入口 -->
              <!-- <div class="sidebar" @click="handleNavi(8)">
                <el-menu-item
                  index="/depre_index"
                  :class="this.sideBarActive === 8 ? 'active-bar' : 'inactive-bar'"
                >
                  <i
                    :class="[
                      'el-icon-time',
                      'icon',
                    ]"
                    
                  ></i>
                  <span slot="title" class="sidetext">旧首页</span>
                </el-menu-item>
              </div>
              <div class="sidebar" @click="handleNavi(9)">
                <el-menu-item
                  index="/depre_dataManage"
                  :class="this.sideBarActive === 9 ? 'active-bar' : 'inactive-bar'"
                >
                  <i
                    :class="[
                      'el-icon-time',
                      'icon',
                    ]"
                    
                  ></i>
                  <span slot="title" class="sidetext">旧数据管理</span>
                </el-menu-item>
              </div>
              <div class="sidebar" @click="handleNavi(10)">
                <el-menu-item
                  index="/depre_columnManage"
                  :class="this.sideBarActive === 10 ? 'active-bar' : 'inactive-bar'"
                >
                  <i
                    :class="[
                      'el-icon-time',
                      'icon',
                    ]"
                    
                  ></i>
                  <span slot="title" class="sidetext">旧字段管理</span>
                </el-menu-item>
              </div> -->
              <!-- <div class="sidebar" @click="handleNavi(11)">
                <el-menu-item
                  index="/depre_taskManage"
                  :class="this.sideBarActive === 11 ? 'active-bar' : 'inactive-bar'"
                >
                  <i
                    :class="[
                      'el-icon-time',
                      'icon',
                    ]"
                    
                  ></i>
                  <span slot="title" class="sidetext">旧任务记录</span>
                </el-menu-item>
              </div> -->
              <el-submenu index="2">
                <template slot="title">
                  <div class="inactive-bar">
                    <i :class="['el-icon-menu', 'icon']"></i>
                    <span slot="title" class="sidetext">系统设置</span>
                  </div>
                </template>
                <div class="sidebar submenu-bar" @click="handleNavi(7)">
                  <el-menu-item
                    index="/diseaseManage"
                    :class="
                      this.sideBarActive === 7 ? 'active-bar' : 'inactive-bar'
                    "
                  >
                    <span slot="title" class="sub-sidetext">病种管理</span>
                  </el-menu-item>
                </div>
                <div class="sidebar submenu-bar" @click="handleNavi(8)">
                  <el-menu-item
                    index="/AdminDataManage"
                    :class="
                      this.sideBarActive === 8 ? 'active-bar' : 'inactive-bar'
                    "
                  >
                    <span slot="title" class="sub-sidetext">系统数据管理</span>
                  </el-menu-item>
                </div>
                <div class="sidebar submenu-bar" @click="handleNavi(9)">
                  <el-menu-item
                    index="/userManage"
                    :class="
                      this.sideBarActive === 9 ? 'active-bar' : 'inactive-bar'
                    "
                  >
                    <span slot="title" class="sub-sidetext">用户管理</span>
                  </el-menu-item>
                </div>

                <div class="sidebar submenu-bar" @click="handleNavi(10)">
                  <el-menu-item
                    index="/logManage"
                    :class="
                      this.sideBarActive === 10 ? 'active-bar' : 'inactive-bar'
                    "
                  >
                    <span slot="title" class="sub-sidetext">日志管理</span>
                  </el-menu-item>
                </div>
                <div class="sidebar submenu-bar" @click="handleNavi(11)">
                  <el-menu-item
                    index="/inform"
                    :class="
                      sideBarActive === 11 ? 'active-bar' : 'inactive-bar'
                    "
                  >
                    <span slot="title" class="sub-sidetext">公告管理</span>
                  </el-menu-item>
                </div>
              </el-submenu>
            </el-menu>

            <el-menu
              router
              class="el-menu-vertical-demo"
              style="
                height: 20%;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
              "
            >
              <div class="sidebar" @click="handleNavi(12)">
                <el-menu-item
                  index="/intro"
                  :class="
                    this.sideBarActive === 12 ? 'active-bar' : 'inactive-bar'
                  "
                  ><i :class="['el-icon-question', 'icon']"></i
                  ><span slot="title" class="sidetext"
                    >软件介绍</span
                  ></el-menu-item
                >
              </div>
              <div class="sidebar" @click="handleNavi(13)">
                <el-menu-item
                  index="/manual"
                  :class="
                    this.sideBarActive === 13 ? 'active-bar' : 'inactive-bar'
                  "
                  ><i :class="['el-icon-thumb', 'icon']"></i
                  ><span slot="title" class="sidetext"
                    >操作手册</span
                  ></el-menu-item
                >
              </div>
            </el-menu>
          </el-aside>
        </div>
        <el-main class="main">
          <app-main
            @show-overlay="showOverlay"
            @hide-overlay="hideOverlay"
            @change-sidebar-active="
              (index) => {
                console.log('测试');
                this.sideBarActive = index;
              }
            "
          />
          <div class="overlay" v-if="showingOverlay"></div>
        </el-main>
      </el-container>
      <el-footer
        style="
          height: min-height;
          background-color: rgb(218, 218, 218);
          text-align: center;
          z-index: 1000;
        "
      >
        重庆邮电大学 大数据智能计算创新研发团队 @CopyRight 2020-2023 All Rights
        Reserved
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import AppMain from "@/components/AppMain";
import { Icon } from "element-ui";
import { mapState } from "vuex";
import vuex_mixin from "@/components/mixins/vuex_mixin";
export default {
  name: "SideBar",
  components: { AppMain },
  mixins: [vuex_mixin],
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      dialogVisible: false,

      showingOverlay: false,
      sideBarActive: 0,
      bottomBarActive: 0,
      isCollapse: false,
      sidewidth: "64px",

      moduleName: "sideBar",
    };
  },
  computed: {
    ...mapState("sideBar", ["stepActive"]),
  },
  methods: {
    handleNavi(index) {
      if (this.sideBarActive != index) {
        this.sideBarActive = index;
        this.resetStep();
      }
    },
    toIndex() {
      this.sideBarActive = 1;
    },
    resetStep() {
      this.m_changeStep(0);
    },
    logout() {
      /* 山东部署 */
      /* sessionStorage.removeItem('username');
      sessionStorage.removeItem('userid');
      sessionStorage.removeItem('userrole');
      window.close(); */
    },
    showOverlay() {
      this.showingOverlay = true;
      console.log("蒙版");
    },
    hideOverlay() {
      this.showingOverlay = false;
    },
    handleSelect(key) {
      if (key === 6) {
        this.$alert(
          "单一病种的疾病危险因素可能具有对疾病预测相似影响的关联关系，此外，危险因素在不同时间点、不同空间层次的条件下可能存在累积和关联，体现于临床则为不同程度或表现形式的症状。本软件采用机器学习方法来表征疾病危险因素之间的关联关系，以及其时间累积效应和空间层次效应，并展示可视化结果以供交互和参考。",
          "软件介绍",
          {
            confirmButtonText: "返回",
          }
        );
      }

      if (key === 7) {
        this.$alert("此处为操作指南", "操作手册", {
          confirmButtonText: "返回",
        });
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style scoped>
.mainCon {
  height: calc(100vh - 80.67px);
}
.el-icon-mobile-phone {
  color: white;
}
.el-menu-vertical-demo {
  /*解决侧边栏颜色无法撑起整个高度问题*/
  /*height: 100vh;*/
  /*解决侧边栏凸起问题*/
  border-right: none;
  background-color: #071135;
  font-size: 1.3em;
}
.header {
  /*background-color: #B3C0D1;*/
  color: #333;
  text-align: center;
  line-height: 60px;
  background-color: #071135;
}

.header > .el-menu-demo > .el-menu-item {
  color: #5292d8;
}

.header .el-icon {
  color: #5292d8;
}

.side {
  /*background-color: #071135;*/
  color: #333;
  /*text-align: center;*/
  /*line-height: 200px;*/
  height: inherit;
  background-color: #071135;
  max-width: 200px;
}

.main {
  height: calc(100vh - 60px);
}

.sidetext {
  font-size: 1em;
  font-weight: bold;
}

.icon,
.icon-custom,
.sidetext {
  color: inherit;
}

.icon + .sidetext {
  margin-left: 25px;
}

.icon-custom + .sidetext {
  margin-left: 35px;
}

.icon::before {
  color: inherit;
}

.icon-custom::before {
  font-size: 15px;
  color: inherit;
  padding-left: 4px;
}

.icon-db::before {
  content: "\e900";
}

.icon-graph::before {
  content: "\e901";
}

.sidebar:hover > *,
::v-deep .el-submenu__title:hover > * {
  color: #e6a23c !important;
}

.sidebar:hover .icon-custom::before {
  color: #e6a23c;
  transition: color 0.5s;
}

.icon-hover::before {
  color: #e6a23c;
  transition: color 0.5s;
}

.active-bar {
  color: #e6a23c !important;
}
.inactive-bar {
  color: #fff !important;
}
.submenu-bar {
  background-color: #071135;
  height: 30%;
}
.submenu-bar > li {
  height: 3em;
  line-height: 3em;
}
.sub-sidetext {
  font-size: 0.9em;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* 半透明的灰色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 确保蒙版在最前面 */
}
</style>