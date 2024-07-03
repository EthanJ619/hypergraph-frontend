<template>
  <div>
    <div class="top-div">
      <div class="left">
        <el-card class="card quick-entrys">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>快捷入口</span>
          </div>
          <div class="entrys">
            <el-button
              v-for="(item, index) in quickEntry"
              :key="index"
              :type="item.type"
              @click="quickLink(index)"
              class="entry"
            >
              <img :src="item.img" class="entry-icon" />
              {{ item.title }}
            </el-button>
          </div>
        </el-card>
      </div>
      <div class="right">
        <el-card class="card info-table-card data-info">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>系统数据信息</span>
          </div>
          <!-- <el-scrollbar ref="customScrollbar" style="height: 100%"> -->
          <!-- 滚动条要包裹的内容 -->
          <!-- <div class="scrollbarCon" ref="scrollbarCon"> -->
          <el-table :data="tableData" stripe class="info-table">
            <el-table-column
              prop="tableName"
              label="数据表"
              width="190"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-link @click="showTableDesc(scope.row.tableName)">{{
                  scope.row.tableName
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="disease"
              label="所属疾病"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.disease }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="uploadTime" label="创建时间" align="center">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{
                  scope.row.uploadTime
                }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- </div></el-scrollbar -->
          <!-- > -->
          <el-dialog title="数据集描述" :visible.sync="tableDescVisible">
            <p>
              {{
                selectedTableDesc === "" || selectedTableDesc === null
                  ? "暂无数据集描述"
                  : selectedTableDesc
              }}
            </p>
          </el-dialog>
        </el-card>
      </div>
    </div>
    <div class="bottom-div">
      <div class="left">
        <el-card class="card chart-card">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>数据集统计</span>
          </div>
          <!-- <div
            v-for="(item, index) in diseaseData"
            :key="index"
            style="margin-block: 2%"
          >
            <div style="text-align: center">
              <span>{{ item.name }}</span>
              <el-progress
                :text-inside="true"
                :stroke-width="28"
                :percentage="(item.num * 100) / patientNum"
                style="margin-block: 2%"
              ></el-progress>
            </div>
          </div> -->
          <div class="histo"></div>
        </el-card>
      </div>

      <div class="mid">
        <el-card class="card chart-card">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>超图分布</span>
          </div>
          <div class="hg-pie"></div>
        </el-card>
      </div>
      <div class="right">
        <el-card class="card info-table-card logInfo">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>任务日志列表</span>
          </div>
          <el-table :data="tasks" stripe class="info-table">
            <el-table-column
              prop="taskName"
              label="任务名"
              width="190"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="taskType"
              label="任务类型"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.taskType }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{
                  scope.row.createTime
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequest } from "@/utils/api";
import moment from "moment";
export default {
  name: "index",
  data() {
    return {
      entryLineHeight: "",
      tableDescVisible: false,
      selectedTableDesc: null,
      tableData: [],
      tableChart: {},
      tasks: [],
      line: null,
      patientNum: 200,
      quickEntry: [
        {
          title: "数据管理",
          img: require("../../assets/db.png"),
          type: "primary",
          router: "/dataManage",
        },
        {
          title: "超图构建",
          img: require("../../assets/graph_white.png"),
          type: "success",
          router: "/HGconstruct",
        },
        {
          title: "任务记录",
          img: require("../../assets/log.png"),
          type: "warning",
          router: "/taskManage",
        },

        // {
        //   title: "其他功能",
        //   img: require("../../assets/others.png"),
        //   type: "info",
        // },
      ],
      diseaseData: [
        {
          name: "胃癌",
          num: 80,
        },
        {
          name: "糖尿病",
          num: 23,
        },
        {
          name: "肺癌",
          num: 56,
        },
        {
          name: "乳腺癌",
          num: 12,
        },
        {
          name: "高血压",
          num: 140,
        },
      ],

      pieChart: null,
      histoChart: null,
      pieChartOption: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          left: "center",
        },
        textStyle: {
          fontFamily: "Microsoft YaHei",
        },
        color: ["#409EFF", "#F56C6C", "#67C23A"],
        series: [
          {
            name: "超图构建分布",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,

            label: {
              show: true,
              position: "right",
              fontSize: 15,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: [
              { value: 4, name: "时间超图" },
              { value: 2, name: "空间超图" },
              { value: 1, name: "跨时空超图" },
            ],
          },
        ],
      },
      histoChartOption: {
        dataset: {
          source: [
            ["数量", "疾病"],
            [2, "血脂异常"],
            [12, "肺癌"],
            [9, "胃癌"],
            [15, "糖尿病"],
            [9, "高血压"],
            [2, "结直肠癌"],
            [5, "白血病"],
            [3, "阿尔兹海默症"],
            [1, "精神分裂症"],
            [6, "乳腺癌"],
            [4, "前列腺癌"],
          ],
        },
        textStyle: {
          fontFamily: "Microsoft YaHei",
          fontSize: 15,
        },
        grid: {
          containLabel: true,
          left: 0,
          top: "10%",
          right: "10%",
          bottom: "10%",
        },
        xAxis: {
          name: "数量",
          splitLine: { show: false },
          axisLine: { show: true },
        },
        yAxis: { type: "category", name: "疾病" },
        visualMap: {
          orient: "horizontal",
          left: "center",
          min: 1,
          max: 10,
          text: ["多", "少"],
          // Map the score column to color
          dimension: 0,
          inRange: {
            color: ["#65B581", "#FFCE34", "#FD665F"],
          },
        },
        series: [
          {
            type: "bar",
            encode: {
              // Map the column to X axis.
              x: "数量",
              // Map the column to Y axis
              y: "疾病",
            },
          },
        ],
      },
    };
  },
  methods: {
    showTableDesc(tableName) {
      getRequest("/table/" + tableName).then((res) => {
        this.selectedTableDesc = res.tableDesc;
        this.tableDescVisible = true;
      });
    },
    quickLink(index) {
      this.$emit("change-sidebar-active", index + 2);
      this.$router.push(this.quickEntry[index].router);
    },
    // chart1() {
    //   var chartDom = document.getElementById("login");
    //   this.mychart = this.$echarts.init(chartDom);

    //   var option;
    //   option = {
    //     xAxis: {
    //       type: "category",
    //       data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //     },
    //     yAxis: {
    //       type: "value",
    //     },
    //     series: [
    //       {
    //         data: [120, 200, 150, 80, 70, 110, 130],
    //         type: "bar",
    //         showBackground: true,
    //         color: "#E3B100",
    //         backgroundStyle: {
    //           color: "rgba(180, 180, 180, 0.2)",
    //         },
    //       },
    //     ],
    //   };

    //   option && this.mychart.setOption(option);
    // },
    getAllData() {
      getRequest("/tables").then((res) => {
        if (res) {
          this.tableData = res;
          /* 修改时间格式 */
          for (let i = 0; i < this.tableData.length; i++)
            this.tableData[i].uploadTime = moment(
              this.tableData[i].uploadTime
            ).format("YYYY-MM-DD hh:mm:ss");
          /* 清零 */
          /* for (let i = 0; i < this.histoChartOption.dataset.source.length; i++)
          this.histoChartOption.dataset.source[i][0] = 0; */
          for (let i = 0; i < res.length; i++) {
            /* 统计数据集 */
            for (
              let j = 1;
              j < this.histoChartOption.dataset.source.length;
              j++
            )
              if (this.histoChartOption.dataset.source[j][1] === res[i].disease)
                this.histoChartOption.dataset.source[j][0]++;

            /* 统计排序 */
            let temp = this.histoChartOption.dataset.source.slice(1);
            temp.sort((a, b) => a[0] - b[0]);
            this.histoChartOption.dataset.source = [
              this.histoChartOption.dataset.source[0],
            ].concat(temp);
          }
          this.drawHistoChart();
        }
      });
    },
    getAllTask() {
      getRequest("/tasks").then((res) => {
        if (res) {
          this.tasks = res;
          /* 修改时间格式 */
          for (let i = 0; i < this.tasks.length; i++)
            this.tasks[i].createTime = moment(this.tasks[i].createTime).format(
              "YYYY-MM-DD hh:mm:ss"
            );
          /* 清零 */
          /*  for (let i = 0; i < this.pieChartOption.series[0].data.length; i++)
          this.pieChartOption.series[0].data[i].value = 0; */
          for (let i = 0; i < res.length; i++) {
            /* 统计超图分布 */
            for (let j = 0; j < this.pieChartOption.series[0].data.length; j++)
              if (
                this.pieChartOption.series[0].data[j].name === res[i].taskType
              )
                this.pieChartOption.series[0].data[j].value++;
          }
          this.drawPieChart();
        }
      });
    },
    drawPieChart() {
      this.pieChart = this.$echarts.init(document.querySelector(".hg-pie"));
      this.pieChart.setOption(this.pieChartOption);
      window.addEventListener("resize", () => {
        this.pieChart.resize();
      });
    },
    drawHistoChart() {
      this.histoChart = this.$echarts.init(document.querySelector(".histo"));
      this.histoChart.setOption(this.histoChartOption);
      window.addEventListener("resize", () => {
        this.histoChart.resize();
      });
    },
  },
  mounted() {
    /* this.chart1();
    const that = this;
    this.mychart.resize();
    window.addEventListener("resize", () => {
      that.mychart.resize();
    }); */
    this.getAllData();
    this.getAllTask();

    /* const container = document.querySelector(".entryText");
    // 获取容器的高度
    const containerHeight = container.clientHeight;

    // 获取文本元素
    const entryText = document.querySelector(".entryText");
    // 将容器高度应用到文本元素的 line-height 和 height 属性中
    entryText.style.lineHeight = `${containerHeight}px`;
    entryText.style.height = `${containerHeight}px`; */
    /* // 获取自定义滚动条
    let customScrollbar = this.$refs.customScrollbar.wrap;

    // 监听滚动事件
    customScrollbar.onscroll = (e) => {
      // 获取当前滚动位置
      const scrollTop = customScrollbar.scrollTop;
      console.log(this.$refs.scrollbarCon.style.transform);
      // 设置表格内容的滚动位置，使其与表头保持一致
      // this.$refs.info-table.style.transform = `translateY(-${scrollTop}px)`;
    }; */
  },
};
</script>

<style scoped>
.top-div,
.bottom-div {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.top-div {
  height: 35vh;
}

.top-div .left {
  box-sizing: border-box;
  width: 66.5%;
  height: 100%;
}
.top-div .right {
  box-sizing: border-box;
  width: 33%;
  height: 100%;
}

.bottom-div {
  height: 50vh;
  margin-block: 10px;
}

.bottom-div :is(.left, .mid, .right) {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}

/* .info-table-card /deep/ .el-card__body { */
.info-table-card ::v-deep .el-card__body {
  padding-block: 0;
}
.data-info ::v-deep .el-card__body {
  height: 75%;
}
.logInfo ::v-deep .el-card__body {
  height: 80%;
}

.info-table-card {
  height: inherit;
}
.info-table {
  height: 100%;
}

/* .info-table ::v-deep .el-table__header-wrapper {
  position: sticky;
} */

.info-table ::v-deep .el-table__body-wrapper {
  overflow: auto;
  height: 90%;
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

/* .clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
} */

.line-style {
  color: rgb(100, 172, 231);
  font-weight: 40;
}
.card {
  height: inherit;
}

/* .top-div .left .quickEntryBox {
  /* border: 1px red solid;
  box-sizing: border-box;//
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.top-div .left .quickEntryBox .singleBox {
  /* border: 1px red solid;
  box-sizing: border-box;//
  width: 80px;
  height: 80px;
  border-radius: 20%;
}
.top-div .left .quickEntryBox .imgStyle {
  width: 90%;
  height: 90%;
} */

.quick-entrys ::v-deep .el-card__body {
  height: 65%;
  width: inherit;
}

.entrys {
  align-items: center;
  height: 100%;
  width: inherit;

  display: grid;
  grid-template-columns: repeat(3, 33%);
  grid-gap: 10px;
}

.entry {
  height: 100%;
  border-radius: 30px;
  font-size: 4vh;
  font-family: "微软雅黑", "钉钉进步体", "Microsoft YaHei", sans-serif;
  font-weight: bold;
}

.entry ::v-deep span {
  display: flex;
  align-items: center;
}

.entry-icon {
  max-width: 100%;
  max-height: 100%;
  height: 15vh;
}

.chart-card ::v-deep .el-card__body {
  height: 80%;
}

.hg-pie {
  height: 100%;
  width: 100%;
}

.histo {
  height: 100%;
  width: 100%;
}
</style>
