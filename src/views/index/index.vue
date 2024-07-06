<template>
  <div>
    <div class="top-statistic">
      <el-card class="top-card">
        <el-card class="quick-entrys">
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
          </div> </el-card
        ><el-card class="statistic-card">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>统计数据</span>
          </div>
          <div class="stat-items">
            <el-card class="stat-item">
              <div class="text_place">
                <i class="el-icon-s-grid"></i> 数据集数量：9
                <!-- <i class="el-icon-s-grid"></i> 专病集个数：{{
                  statistic.specialityCount
                }} -->
              </div>
            </el-card>
            <el-card class="stat-item">
              <div class="text_place">
                <i class="el-icon-s-data"></i> 样本总量：{{ 17632 }}
                <!-- <i class="el-icon-s-data"></i> 样本总量：{{
                  statistic.sampleCount
                }} -->
              </div>
            </el-card>
            <el-card class="stat-item">
              <div class="text_place">
                <i class="el-icon-time"></i> 起始时间：<br />
                {{ statistic.startAndEndTime }}
              </div>
            </el-card>
            <el-card class="stat-item">
              <div class="text_place">
                <i class="el-icon-s-claim"></i> 任务总数：{{
                  statistic.taskCount
                }}
              </div>
            </el-card>
          </div>
        </el-card>
      </el-card>
    </div>

    <div class="mid-statistic">
      <el-card class="mid-card">
        <!-- <el-card>
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>近期新建任务数</span>
            <el-select class="chartSelect" v-model="charttype" placeholder="请选择" size="mini" @change="changeChart">
              <el-option v-for="item in chartOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div id="chartBox" style="height: 400px;width: 500px;">
            <LineChartVue v-if="sevendays.length > 0" :legend="chartLegend" :statistic="chartData" :x="sevendays">
            </LineChartVue>
          </div>
        </el-card> -->
        <el-card class="chart-card">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>疾病占比</span>
          </div>
          <!-- <div id="chartBox" style="height: 550px; width: 500px">
            <Pie
              v-if="pieObject.length !== 0"
              :pieObject="pieObject"
              :height="400"
              :width="500"
            >
            </Pie>
          </div> -->
          <div class="histo"></div>
        </el-card>
        <el-card class="map-card">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>患者样本地理空间分布</span>
            <el-select
              class="BarchartSelect"
              v-model="table_value"
              placeholder="请选择数据集"
              size="mini"
              @change="table_val_change"
            >
              <el-option
                v-for="item in table_value_options"
                :key="item"
                :label="item"
                :value="item"
                size="mini"
              >
              </el-option>
            </el-select>
          </div>
          <div id="map-container" class="map" tabindex="0" style="height: 65vh">
            <!-- <Sprit
              v-if="this.sprit_names.length !== 0"
              :sprit_names="sprit_names"
              :sprit_values="sprit_values"
              :height="400"
              :width="550"
              :title="table_value"
            >
            </Sprit> -->
          </div>
        </el-card>
      </el-card>
    </div>

    <!-- <div class="bottomStatistic">
      <el-card class="bottom_statistic_card">
        <div slot="header" class="clearfix">
          <span class="line-style">▍</span><span>正负样本占比</span>
        </div>
        <div id="chartBox">
          <Bar style="height: 400px; width: 1400px"> </Bar>
        </div>
      </el-card>
    </div> -->
  </div>
</template>

<script>
import { getRequest } from "@/utils/requestApi";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import LineChartVue from "@/components/tab/subcomponents/LineChart.vue";
import Pie from "@/components/tab/subcomponents/Pie.vue";
import Sprit from "@/components/tab/subcomponents/Sprit.vue";
import Bar from "@/components/tab/subcomponents/Bar.vue";
export default {
  name: "index",
  components: { LineChartVue, Pie, Sprit, Bar },
  computed: {
    //  ...mapState(["modelList", "dataList", "taskList"]),
  },
  data() {
    return {
      histoChart: null,
      histoChartOption: {
        dataset: {
          source: [
            ["数量", "疾病"],
            [2, "血脂异常"],
            [2, "肺癌"],
            [1, "胃癌"],
            [2, "糖尿病"],
            [1, "高血压"],
            [3, "阿尔兹海默症"],
            [1, "乳腺癌"],
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

      disCountry: null,
      nationMap: null,
      nationColors: {},
      GDPSpeed: {
        520000: 10, //贵州
        540000: 10, //西藏
        530000: 8.5, //云南
        500000: 8.5, //重庆
        360000: 8.5, //江西
        340000: 8.0, //安徽
        510000: 7.5, //四川
        350000: 8.5, //福建
        430000: 8.0, //湖南
        420000: 7.5, //湖北
        410000: 7.5, //河南
        330000: 7.0, //浙江
        640000: 7.5, //宁夏
        650000: 7.0, //新疆
        440000: 7.0, //广东
        370000: 7.0, //山东
        450000: 7.3, //广西
        630000: 7.0, //青海
        320000: 7.0, //江苏
        140000: 6.5, //山西
        460000: 7, // 海南
        310000: 6.5, //上海
        110000: 6.5, // 北京
        130000: 6.5, // 河北
        230000: 6, // 黑龙江
        220000: 6, // 吉林
        210000: 6.5, //辽宁
        150000: 6.5, //内蒙古
        120000: 5, // 天津
        620000: 6, // 甘肃
        610000: 8.5, // 甘肃
        710000: 6.64, //台湾
        810000: 6.0, //香港
        820000: 6.7, //澳门
      },

      statistic: {
        specialityCount: "",
        sampleCount: "",
        startAndEndTime: "",
        taskCount: "",
      },
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
        {
          title: "系统日志",
          img: require("../../assets/sysconfig.png"),
          type: "info",
          router: "/logManage",
        },
      ],
      chartLegend: [],
      modelName: [],
      chartData: [],
      taskTotal: [],
      taskModel: [],
      sevendays: [],
      charttype: 1,
      chartOptions: [
        {
          value: 1,
          label: "总数",
        },
        {
          value: 2,
          label: "分任务",
        },
      ],
      table_value: "",
      table_value_options: [],
      pieObject: [],
      sprit_names: [],
      sprit_values: [],
    };
  },

  methods: {
    customInfoWindow(title, content) {
      var info = document.createElement("div");
      info.className = "custom-info input-card content-window-card";

      //可以通过下面的方式修改自定义窗体的宽高
      // info.style.width = "150px";
      // 定义顶部标题
      var top = document.createElement("div");
      var titleD = document.createElement("div");
      top.className = "info-top";
      titleD.innerHTML = title;

      top.appendChild(titleD);
      info.appendChild(top);

      // 定义中部内容
      var middle = document.createElement("div");
      middle.className = "info-middle";
      middle.style.backgroundColor = "white";
      middle.innerHTML = content;
      info.appendChild(middle);

      return info;
    },

    getColorByGDP(adcode) {
      if (!this.nationColors[adcode]) {
        var gdp = this.GDPSpeed[adcode];
        if (!gdp) {
          this.nationColors[adcode] = "rgb(227,227,227)";
        } else {
          var rg = 255 - Math.floor(((gdp - 5) / 5) * 255);
          // this.nationColors[adcode] = "rgb(230," + rg + "," + rg + ")";
          this.nationColors[adcode] =
            "rgb(" + rg + "225," + rg + "," + rg + ")";
        }
      }
      return this.nationColors[adcode];
    },

    putNationMap() {
      this.disCountry = new AMap.DistrictLayer.Country({
        zIndex: 10,
        SOC: "CHN",
        depth: 1,
        styles: {
          "nation-stroke": "#ff0000",
          "coastline-stroke": [0.85, 0.63, 0.94, 1],
          "province-stroke": "white",
          "city-stroke": "rgba(255,255,255,0.15)",
          fill: (props) => {
            return this.getColorByGDP(props.adcode_pro);
          },
        },
      });

      this.nationMap = new AMap.Map("map-container", {
        zooms: [3, 8],
        center: [104.188488, 35.302032],
        zoom: 4,
        isHotspot: false,
        defaultCursor: "pointer",
        touchZoomCenter: 1,
        pitch: 0,
        layers: [this.disCountry],
        viewMode: "3D",
      });
      this.nationMap.addControl(new AMap.Scale());
      this.nationMap.addControl(new AMap.ToolBar({ liteStyle: true }));
      this.nationMap.addControl(
        new AMap.ControlBar({
          position: {
            right: "1vh",
            top: "1vh",
          },
          showControlButton: true, // 是否显示倾斜、旋转按钮。默认为 true
        })
      );

      this.nationMap.on("complete", () => {
        var layer = new AMap.LabelsLayer({
          // 开启标注避让，默认为开启，v1.4.15 新增属性
          collision: false,
          // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
          animation: true,
        });
        for (var i = 0; i < LabelsData.length; i++) {
          var labelsMarker = new AMap.LabelMarker(LabelsData[i]);
          layer.add(labelsMarker);
        }
        this.nationMap.add(layer);
      });

      this.nationMap.setLimitBounds(this.nationMap.getBounds());

      var infoWindow = new AMap.InfoWindow({
        isCustom: true,
        anchor: "bottom-left",
        content: "",
        autoMove: false,
      });

      this.disCountry.on("mouseover", (e) => {
        this.disCountry.setStyles({
          fill: (props) => {
            if (e.props.adcode == props.adcode) return "rgba(240, 162, 20, 1)";
            //中国特有字段
            return this.getColorByGDP(props.adcode_pro);
          },
          "nation-stroke": "#ff0000",
          "coastline-stroke": [0.85, 0.63, 0.94, 1],
          "province-stroke": "white",
          "city-stroke": "rgba(255,255,255,0.15)", //中国特有字段
        });
        infoWindow.setContent(
          this.customInfoWindow(e.props.NAME_CHN, "病例数：---<br/>占比：--%")
        );
        infoWindow.open(this.nationMap, [
          e.origin.lnglat.getLng(),
          e.origin.lnglat.getLat(),
        ]);
      });
      this.disCountry.on("mouseout", () => {
        this.disCountry.setStyles({
          fill: (props) => {
            //中国特有字段
            return this.getColorByGDP(props.adcode_pro);
          },
          "nation-stroke": "#ff0000",
          "coastline-stroke": [0.85, 0.63, 0.94, 1],
          "province-stroke": "white",
          "city-stroke": "rgba(255,255,255,0.15)", //中国特有字段
        });
        infoWindow.close();
      });
      this.disCountry.on("mousemove", (e) => {
        infoWindow.setPosition([
          e.origin.lnglat.getLng() + 0.5,
          e.origin.lnglat.getLat() + 0.5,
        ]);
      });

      // document.getElementsByClassName("athis.nationMap-mcode")[0].innerHTML =
      //   "-GS(2022)200号、GS(2021)648号";
      document.querySelector(".amap-copyright").remove();
      document.getElementsByClassName("amap-logo")[0].remove();
    },

    drawHistoChart() {
      this.histoChart = this.$echarts.init(document.querySelector(".histo"));
      this.histoChart.setOption(this.histoChartOption);
      window.addEventListener("resize", () => {
        this.histoChart.resize();
      });
    },

    // ...mapActions(["getTaskList"]),
    init() {
      getRequest("stats/7DaysAlgorithmUsage").then((res) => {
        this.chartLegend = ["当天任务数"];

        this.taskTotal.push({
          name: "当天任务数",
          type: "line",
          smooth: true,
          data: [],
        });
        for (let i = 0; i < 7; i++) {
          this.sevendays.push(res[i].formattedDate);
          this.taskTotal[0].data.push(res[i].total);
        }
        this.chartData = this.taskTotal;
      });
    },

    quickLink(index) {
      this.$router.push(this.quickEntry[index].router);
    },

    changeChart() {
      switch (this.charttype) {
        case 1: {
          this.chartLegend = ["当天任务数"];
          this.chartData = this.taskTotal;
          break;
        }
        case 2: {
          this.chartLegend = this.modelName;
          this.chartData = this.taskModel;
          break;
        }
      }
    },
    getInitInfo() {
      getRequest("stats/get_all_table_names").then((res) => {
        if (res.code == 200) {
          this.table_value_options = res.data;
        } else {
          this.$message.error("获取数据失败");
        }
      });
      getRequest("stats/getStatsOne").then((res) => {
        if (res.code == 200) {
          this.statistic.sampleCount = res.data.itemNumber;
          this.statistic.taskCount = res.data.taskNumber;
          this.statistic.specialityCount = res.data.specialDiseaseNumber;
          this.statistic.startAndEndTime =
            res.data.startTime + "至" + res.data.endTime;
        } else {
          this.$message.error("获取数据失败");
        }
      });
      getRequest("stats/getdiseaserate").then((res) => {
        if (res.code == 200) {
          for (let key in res.data.data) {
            let pie_obj = {};
            pie_obj.value = res.data.data[key];
            pie_obj.name = key;
            this.pieObject.push(pie_obj);
          }
          console.log("s", this.pieObject);
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    table_val_change() {
      this.sprit_names = [];
      this.sprit_values = [];
      getRequest(`scripts/get_fill_rate?tablename=${this.table_value}`).then(
        (res) => {
          this.sprit_names = res.column_name;
          this.sprit_values = res.miss_rate;
        }
      );
    },
  },

  created() {
    this.init();
    // this.getTaskList(sessionStorage.getItem("userid") - 0);
    this.getInitInfo();
  },

  mounted() {
    window._AMapSecurityConfig = {
      securityJsCode: "80e09c6d325e98f2910c75c71d7ad8ef",
    };

    let temp = this.histoChartOption.dataset.source.slice(1);
    temp.sort((a, b) => a[0] - b[0]);
    this.histoChartOption.dataset.source = [
      this.histoChartOption.dataset.source[0],
    ].concat(temp);

    this.drawHistoChart();

    this.putNationMap();
  },
};
</script>

<style scoped>
.topBigDiv {
  box-sizing: border-box;
  height: 30vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topBigDiv .left {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}

.topBigDiv .right {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}

.topBigDiv .left .quickEntryBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  margin-top: 38px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.topBigDiv .left .quickEntryBox .singleBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 80px;
  height: 80px;
  border-radius: 20%;
}

.topBigDiv .left .quickEntryBox .imgStyle {
  width: 90%;
  height: 90%;
}

.bottomBigDiv {
  box-sizing: border-box;
  height: 55vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.bottomBigDiv .left {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
  overflow: hidden;
}

.bottomBigDiv .mid {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}

.bottomBigDiv .right {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.line-style {
  color: #e6a23c;
  font-weight: 40;
}

#chartBox {
  width: 100%;
  height: 100%;
}

#map-container {
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
  margin: 0px;
}

.chartSelect {
  width: 100px;
  margin-left: 25px;
}

.BarchartSelect {
  width: 200px;
  margin-left: 25px;
}

/* 卡片样式 */
.mid-card,
.top-card {
  width: 100%;
}

.top-card > ::v-deep div {
  display: flex;
}

/* 快捷入口＆统计数据 */
.quick-entrys,
.statistic-card {
  flex: 1;
  margin: 0.5%;
}

/* .quick-entrys ::v-deep .el-card__body {
  height: 65%;
  width: inherit;
} */

.entrys {
  justify-content: center;

  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 47%);
  grid-gap: 20px;
}

.entry {
  border-radius: 10px;
  font-size: 3vh;
  font-family: "微软雅黑", "钉钉进步体", "Microsoft YaHei", sans-serif;
  font-weight: bold;
  margin-left: 0px !important;
}

.entry ::v-deep span {
  display: flex;
  align-items: center;
}

.entry-icon {
  max-width: 15vh;
  max-height: 6vh;
  padding-right: 5vh;
}

.mid-statistic {
  margin-block: 15px;
}

.mid-card > ::v-deep div {
  display: flex;
}

.mid-card .el-card {
  height: 75vh;
  margin: 0.5%;
  border-radius: 10px;
}

.chart-card {
  flex: 1.5;
}

.map-card {
  flex: 2;
}

.stat-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.stat-item {
  margin: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stat-item .text_place {
  text-align: center;
  font-size: 2.3vh;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.histo {
  height: 100%;
  width: 100%;
}

.chart-card ::v-deep .el-card__body {
  height: 65vh;
}

::v-deep .custom-info {
  border: solid 1px silver;
  border-radius: 5px;
}

::v-deep .info-top {
  position: relative;
  background: none repeat scroll 0 0 #f9f9f9af;
  border-bottom: 1px solid #ccc;
  border-radius: 5px 5px 0 0;
}

::v-deep .info-top div {
  display: inline-block;
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 10px;
}

::v-deep .info-middle {
  font-size: 14px;
  padding: 10px 6px;
  line-height: 20px;
  border-radius: 0 0 5px 5px;
}
</style>
