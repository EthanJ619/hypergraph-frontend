<template>
  <div class="content" v-loading="loading2" element-loading-text="拼命运算中">
    <div class="left_tree">
      <div class="tipInfo">
        <h3>可选数据</h3>
        <span class="statistic"> 一级病种: {{ diseaseNum }} 个 </span>
        <span class="statistic"> 数据表: {{ datasetNum }} 个 </span>
      </div>
      <hr class="hr-dashed" />
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <div class="treeArea">
        <!-- =========================================私有数据集树 -->
        <el-tree
          ref="tree1"
          :data="treeData1"
          :show-checkbox="false"
          node-key="id"
          :default-expanded-keys="['1']"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="changeData"
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1 && data.uid != loginUserID"
              ></i>
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1 && data.uid == loginUserID"
                style="color: rgb(40, 207, 18)"
              ></i>
              <span
                v-if="data.catLevel == 1"
                style="font-weight: bold; font-size: 15px; color: #252525"
                >{{ node.label }}</span
              >
              <span
                v-else
                :class="{
                  nodeLabel: node.label.length <= 12,
                  'scrolling-nodeLabel': node.label.length > 12,
                }"
                >{{ node.label }}
                <span v-if="data.isLeafs == 1 && data.uid == loginUserID">
                  （我）</span
                >
              </span>
            </span>
          </span>
        </el-tree>

        <!-- =========================================共享数据集树 -->
        <el-tree
          ref="tree2"
          :data="treeData2"
          :show-checkbox="false"
          node-key="id"
          :default-expanded-keys="['1']"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="changeData"
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1 && data.uid != loginUserID"
              ></i>
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1 && data.uid == loginUserID"
                style="color: rgb(40, 207, 18)"
              ></i>
              <span
                v-if="data.catLevel == 1"
                style="font-weight: bold; font-size: 15px; color: #252525"
                >{{ node.label }}</span
              >
              <span
                v-else
                :class="{
                  nodeLabel: node.label.length <= 12,
                  'scrolling-nodeLabel': node.label.length > 12,
                }"
                >{{ node.label }}
                <span v-if="data.isLeafs == 1 && data.uid == loginUserID">
                  （我）</span
                >
              </span>
            </span>
          </span>
        </el-tree>

        <!-- =========================================公共数据集树 -->
        <el-tree
          ref="tree3"
          :data="treeData3"
          :show-checkbox="false"
          node-key="id"
          :default-expanded-keys="['1']"
          :expand-on-click-node="false"
          :highlight-current="true"
          @node-click="changeData"
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="left_span">
              <i
                class="el-icon-document tree_icon"
                v-if="data.isLeafs == 1"
              ></i>
              <span
                v-if="data.catLevel == 1"
                style="font-weight: bold; font-size: 15px; color: #252525"
                >{{ node.label }}</span
              >
              <span
                v-else
                :class="{
                  nodeLabel: node.label.length <= 12,
                  'scrolling-nodeLabel': node.label.length > 12,
                }"
                >{{ node.label }}</span
              >
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <div class="right_table">
      <el-card class="right_table_topCard" :body-style="{ height: '850px' }">
        <div style="height: 30px; padding-left: 5px">
          <h3 style="margin: -20px">数据预览</h3>
        </div>
        <div class="describe_content">
          <p style="margin-top: 0.5%; width: 100%">
            <i class="el-icon-folder"></i> 数据集名称:<span
              style="font-weight: bold; font-size: 18px; color: #252525"
              >{{ showDataForm.tableName }}</span
            >
            <i class="el-icon-user"></i> 创建人:<span>{{
              showDataForm.createUser
            }}</span>
            <i class="el-icon-time"></i> 创建时间:<span>{{
              showDataForm.createTime
            }}</span>
            <i class="el-icon-finished"></i> 样本个数:<span>{{
              showDataForm.sampleNum
            }}</span>
            <i class="el-icon-finished"></i> 特征个数:<span>{{
              showDataForm.featureNum
            }}</span>
            <el-button
              type="primary"
              @click="back()"
              size="medium"
              style="position: absolute; right: 120px; bottom: -0.5em"
              >上一步</el-button
            >
            <el-button
              type="success"
              @click="next()"
              size="medium"
              style="position: absolute; right: 0; bottom: -0.5em"
              >确认数据集</el-button
            >
          </p>
        </div>
        <!-- 显示表数据 -->

        <div
          class="tableDataCSS"
          v-loading="table_loading"
          element-loading-text="数据量较大，拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.05)"
          ref="listWrap"
          @scroll="scrollListener"
        >
          <div
            class="tablePlaceholder"
            v-if="tableData.length < 1 && !table_loading"
          >
            请在左侧选择数据
          </div>
          <div ref="list">
            <el-table
              v-if="tableData.length > 0"
              :data="tableData"
              stripe
              style="width: 100%"
              class="custom-table"
              max-height="720"
              ref="scrollTable"
              :header-cell-style="{ background: '#eee', color: '#606266' }"
            >
              <el-table-column
                v-for="(value, key) in tableData[0]"
                :key="key"
                :prop="key"
                :label="key"
                :width="colWidth"
                sortable
              >
                <template slot-scope="{ row }">
                  <div class="truncate-text">{{ row[key] }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/utils/requestApi";
import { getCategory } from "@/utils/category";
import { getTableDes, getTableData } from "@/utils/tableDescribe.js";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { resetForm, debounce } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";

export default {
  name: "DataSelect",
  mixins: [resetForm, debounce, vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "factorHg",
    },
  },
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList"]),
    ...mapState(["dataList"]),
    loginUserID() {
      return sessionStorage.getItem("userid");
    },
    colWidth() {
      let arr = Object.keys(this.tableData[0]);
      if (arr.length <= 15) {
        return 90;
      } else {
        return 65;
      }
    },
    // 获取展示的列表
    showList() {
      return this.tableData.slice(this.start, this.end);
    },
    // 获取列表长度
    length() {
      return this.tableData.length || 0;
    },
    maxConditions() {
      return this.filterConditionsData.reduce((max, item) => {
        return Math.max(max, item.filterCondition.length);
      }, 0);
    },
  },
  mounted() {
    this.$refs.listWrap.style.height = "720px"; // 设置可视区域的高度
  },
  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();
    },
    "addDataForm.dataName"() {
      this.checkAddTaleName();
    },
    // diseaseName() {
    //   this.checkDiseasename();
    // },
    selectedFields(newValue) {
      // 如果一键全选框被取消选中，且 selectedFeatures 的长度大于 0，则将其置为 false
      this.selectAll = newValue.length === this.fields.length;
    },
    length(val) {
      this.$refs.listWrap.style.height = "720px";
      // // 超过10行数据，就按照最大40*10 400px高度的列表就行
      // if (val >= 10) {
      //   this.$refs.listWrap.style.height = '800px';
      // } else {
      // // 不足10行数据，这边 加57是因为表头的高度，具体情况
      //   this.$refs.listWrap.style.height = this.itemHeight * val + 80 + 'px'
      // }
    },
    filterText(val) {
      this.$refs.tree1?.filter(val);
      this.$refs.tree2?.filter(val);
      this.$refs.tree3?.filter(val);
    },
  },

  data() {
    return {
      treeData1: [],
      treeData2: [],
      treeData3: [],
      tableData: [], //总共的列表数据
      itemHeight: 48, // item高度
      num: 10, // 展示的数据
      start: 0, // 开始索引
      end: 9, // 结束索引
      diseaseNum: 0,
      datasetNum: 0,
      showDataForm: {
        tableName: "",
        createUser: "",
        createTime: "",
        classPath: "",
        sampleNum: "",
        featureNum: "",
      },

      nodeData: {},

      loading: false,
      loading2: false,
      disease: "",
      DatadialogVisible: false,
      patientTable: [],
      selectedFields: [],
      selectAll: false,
      fields: [],
      table_loading: false,
      filterText: "",
    };
  },

  created() {
    this.checkAddTaleName = this.debounce(() => {
      getRequest("/api/DataTable/inspection", {
        newname: this.addDataForm.dataName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    this.checkTableName = this.debounce(() => {
      getRequest("/api/DataTable/inspection", {
        newname: this.dialogForm.tableName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    this.getCatgory();
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    scrollListener() {
      // 获取滚动高度
      const scrollTop = this.$refs.listWrap.scrollTop;
      // 开始的数组索引
      this.start = Math.floor(scrollTop / this.itemHeight);
      // 结束索引
      this.end = this.start + this.num;
      this.$refs.list.style.transform = `translateY(${
        this.start * this.itemHeight
      }px)`; // 对列表项y轴偏移
    },

    getCatgory() {
      getCategory(`/api/category?uid=${this.loginUserID}`).then((response) => {
        this.treeData1 = response.data.slice(0, 1);
        this.treeData2 = response.data.slice(1, 2);
        this.treeData3 = response.data.slice(2, 3);
        // 获取病种和数据集总数
        this.filterText = "";
        this.diseaseNum = response.data[0].children.length;
        getRequest("/api/getTableNumber").then((res) => {
          if (res.code == 200) this.datasetNum = res.data;
        });
      });
    },
    getTableDescribe(id, label) {
      this.showDataForm.tableName = label;
      getTableDes("/api/tableDescribe", id)
        .then((response) => {
          let res = JSON.parse(response.data);
          this.showDataForm.createUser = res.createUser;
          this.showDataForm.createTime = res.createTime;
          this.showDataForm.classPath = res.classPath;
        })
        .catch((error) => {
          console.log("错误", error);
        });
    },
    getTableData(tableId, tableName) {
      getTableData("/api/getTableData", tableId, tableName)
        .then((response) => {
          // 获取表数据
          this.tableData = response.data;
          const fields = Object.keys(this.tableData[0]);
          this.fields = fields;
          this.showDataForm.sampleNum = this.tableData.length;
          this.showDataForm.featureNum = this.fields.length;
          this.table_loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeData(data) {
      this.nodeid = data.id;
      if (data.isLeafs == 1) {
        this.showDataForm.featureNum = "";
        this.showDataForm.sampleNum = "";
        //获取描述信息
        this.getTableDescribe(data.id, data.label);
        //获取数据信息
        this.table_loading = true;
        this.tableData = [];
        this.getTableData(data.id, data.label);
        this.nodeData = data;
      }
    },

    ...mapMutations(["SetDataList"]),
    ...mapActions(["getDataList"]),

    next() {
      if (this.nodeData.length === 0) {
        this.$message("请选择数据集");
        return;
      }
      this.m_changeTaskInfo({
        tableId: this.nodeData.id,
        tableName: this.nodeData.label,
      });
      if (this.moduleName === "spatialHg") this.startTask("/graph/spatialHg");
      else if (this.moduleName === "factorHg")
        this.m_changeStep(this.m_stepActive + 1);
    },

    back() {
      this.m_changeStep(this.m_stepActive - 1);
    },

    startTask(url) {
      this.loading2 = true;
      let payload = {
        tablename: this.m_tableName,
        tableid: this.m_tableId,
        taskname: this.m_taskName,
      };
      postRequest(url, payload)
        .then((res) => {
          this.m_changeTaskInfo({ algorithm: "pearson", result: res });
          this.loading2 = false;
          console.log(this.m_taskName);
          this.m_changeStep(this.m_stepActive + 1);
        })
        .catch((err) => {
          this.loading2 = false;
          this.$message({
            showClose: true,
            type: "error",
            message: `发生错误：${err}`,
          });
        });
    },
  },
};
</script>

<style scoped>
.content {
  position: relative;
  width: 100%;
  height: 820px;
}

#top_buttons > * {
  display: inline-block;
}

.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* #DiseaseFilter {
  margin-right: 40px;
}

#creatorFilter {
  margin-right: 20px;
}

#top_right_buttons {
  float: right;
  margin-right: 100px;
} */

.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 50px;
  text-align: center;
}

.tipInfo .statistic {
  font-size: 13px;
  color: #585858;
}

.hr-dashed {
  border: 0;
  border-top: 1px dashed #899bbb;
}

h3 {
  color: #3d3d3d;
  text-align: center;
}

#table {
  margin-top: 10px;
}

.tablePlaceholder {
  height: 100%;
  text-align: center;
  line-height: 600px;
  background-color: rgba(179, 178, 178, 0.144);
  font-weight: bold;
  color: rgba(58, 57, 57, 0.651);
  user-select: none;
}

/* .featureLabel {
  height: 55vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: auto;
}

.featureLabel .el-form-item__label {
  color: #252525;
} */

.left_tree {
  display: inline-block;
  height: 820px;
  width: 18%;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  overflow: auto;
}

.treeArea {
  height: calc(820px - 93px);
  /* 93px是头部信息和按钮的高度 */
  overflow: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  overflow: hidden;
}

.custom-tree-node .left_span {
  width: 12em;
  overflow: hidden;
}

.nodeLabel,
.scrolling-nodeLabel {
  display: inline-block;
  white-space: nowrap;
  /* 禁止文本换行 */
  box-sizing: border-box;
  /* 边框和内填充的宽度也包含在width内 */
}

.scrolling-nodeLabel:hover {
  position: relative;
  overflow: hidden;
  vertical-align: text-bottom;
  animation: scrollText 3s linear infinite;
  /* 动画持续时间和循环方式 */
}

@keyframes scrollText {
  0% {
    transform: translateX(0px);
  }

  12% {
    transform: translateX(0px);
  }

  75% {
    transform: translateX(calc(-100% + 12em));
  }

  100% {
    transform: translateX(calc(-100% + 12em));
  }
}

.right_table {
  display: inline-block;
  height: 820px;
  width: 82%;
  position: absolute;
  /* border: none; */
  /* overflow-y: auto; */
}

.right_table_topCard {
  padding: 0;
  height: 820px;
  width: 95%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  /* top: 2%; */
  left: 1%;
  /* overflow-y: auto; */
}

.describe_content {
  display: inline-block;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.describe_content span {
  margin: 10px;
}

/* .add_button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.nameInput {
  width: 70%;
} */

.addDataClass {
  width: calc(1150px * 0.94);
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-size: 16px;
}

/* .addDataClass:first-child {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: start;
  row-gap: 10px;
}

.addDataClass .addDataBaseInfo .titleText {
  font-weight: 600;
  margin-left: 5px;
}

.addDataClass .addDataBaseInfo:last-child {
  grid-column-start: 1;
  grid-column-end: 4;
}

.addDataBaseInfo.createTimeArea {
  line-height: 40px;
  vertical-align: text-bottom;
}

.addDataClass .el-input {
  width: 160px;
} */

/* .addDataClass .addDataBaseInfo {
  margin-left: 50px;
} */

/* .addDataClass .addDataTitle {
  margin-top: 10px;
  margin-right: 15px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
} */

.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.cool-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(to right, #26acdf, #3ee09a);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 200px;
  letter-spacing: 1px;
  cursor: pointer;
}

/* .cool-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}

.cool-button:hover {
  background: linear-gradient(to right, #51bae2, #80e7bb);
}

.cool-button:hover::before {
  transform: scaleX(1);
} */

.custom-table tr {
  background-color: #dcf3fc !important;
}

.tableDataCSS {
  width: 100%;
  /* 因为listWrap设置高度，这里的height会失效 */
  /* height: 900px; */
}

/*.change_btn {
  position: absolute;
  right: 10%;
  top: 5%;
}

.change_status_btn {
  position: absolute;
  right: 18%;
  top: 5%;
}

.charactersGroup {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: flex-start;
  height: 500px;
  overflow: auto;
}

.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
} */
</style>
