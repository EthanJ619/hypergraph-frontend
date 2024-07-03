<template>
  <div>
    <div class="hgDiv">
      <div style="flex: 4; margin-inline: 1em">
        <div
          style="
            margin-bottom: 1em;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-end;
          "
        >
          <el-radio-group
            v-model="graphType"
            style="font-size: 15px; flex: auto"
          >
            <span class="line-style">▍</span>选择单层次：
            <div class="select-layer">
              <el-radio-button label="生理学"></el-radio-button>
              <el-radio-button label="行为学"></el-radio-button>
              <el-radio-button label="人口学"></el-radio-button>
            </div>
          </el-radio-group>
          <el-radio-group
            v-model="graphType"
            style="font-size: 15px; margin-inline: 1vh; flex: auto"
          >
            <span class="line-style">▍</span>选择层间关系：
            <div class="select-layer">
              <el-radio-button label="1and2">生理学 ↔ 行为学</el-radio-button>
              <el-radio-button label="1and3">生理学 ↔ 人口学</el-radio-button>
              <el-radio-button label="2and3">行为学 ↔ 人口学</el-radio-button>
            </div>
          </el-radio-group>
          <div style="display: flex; flex: auto">
            <el-button type="primary" @click="restoreHG" style="flex: auto">
              <span style="font-weight: bold; font-size: 18px"
                >原 始 构 建 结 果</span
              > </el-button
            ><el-button
              type="info"
              style="font-weight: bold; font-size: 18px; flex: auto"
              @click="back"
              >上一步</el-button
            >
          </div>
        </div>
        <el-card id="container">
          <div slot="header" class="clearfix" style="position: relative">
            <span class="line-style">▍</span><span>空间超图可视化</span>
            <i
              class="el-icon-question"
              style="
                position: absolute;
                right: 0px;
                font-size: 2em;
                color: #67c23a;
                cursor: pointer;
              "
              @click="hgGuide"
            ></i>
          </div>
          <div class="show-layer-hg">
            <img
              v-if="graphType == 'original'"
              :src="resultImgUrl + '/spatial_ori.png'"
            />
            <img
              v-if="graphType === '生理学'"
              :src="resultImgUrl + '/spatial_exam.png'"
            />
            <img
              v-if="graphType === '人口学'"
              :src="resultImgUrl + '/spatial_pop.png'"
            />
            <img
              v-if="graphType === '行为学'"
              :src="resultImgUrl + '/spatial_physio.png'"
            />
            <img
              v-if="graphType === '1and2'"
              :src="resultImgUrl + '/spatial_1and2.png'"
            />
            <img
              v-if="graphType === '2and3'"
              :src="resultImgUrl + '/spatial_2and3.png'"
            />
            <img
              v-if="graphType === '1and3'"
              :src="resultImgUrl + '/spatial_1and3.png'"
            />
          </div>
        </el-card>
      </div>

      <div style="flex: 2.5">
        <el-card style="flex: 1" class="spa-fea-card">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>数据集样本地理空间分布</span>
          </div>
          <div id="map-container" class="map" style="height: 45vh"></div>
          <br />
          <div class="prov-select">
            <div>
              <span>选择省份</span>
              <el-select
                v-model="provCode"
                name="code-list"
                id="adcode-list"
                placeholder="请选择省份"
              >
                <el-option
                  v-for="item in provinces"
                  :key="item.adcode"
                  :label="item.name"
                  :value="item.adcode"
                ></el-option>
              </el-select>
            </div>
            <div>
              <span>选择层级</span>
              <el-select
                v-model="mapDepth"
                name="code-list"
                id="depth-list"
                placeholder="请选择展示层级"
              >
                <!-- <el-option value="0">0 - 显示省级</el-option> -->
                <el-option label="显示市级" :value="1"></el-option>
                <el-option label="显示区/县级" :value="2"></el-option>
              </el-select>
            </div>
          </div>
          <br />
          <div id="prov-container" class="map" style="height: 45vh"></div>
          <!-- <ul class="tags">
            <li v-for="tag in feaTags" :key="tag" style="max-width: none">
              {{ tag }}
            </li>
          </ul> -->
        </el-card>
      </div>
    </div>
  </div>
</template>
  
<script>
import vuex_mixin from "@/components/mixins/vuex_mixin";
export default {
  name: "SpatialHgVis",
  mixins: [vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "spatialHg",
    },
  },
  data() {
    return {
      graphType: "original",

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

      infoWindow: new AMap.InfoWindow({
        isCustom: true,
        anchor: "bottom-left",
        content: "",
        autoMove: false,
      }),

      provinces: adcodes,
      provCode: 510000,
      mapDepth: 2,
      disProvince: null,
      provMap: null,
      provColors: {},
    };
  },
  computed: {
    resultImgUrl() {
      console.log("这是在computed中：" + this.m_taskName);
      return "api/static/" + this.m_taskName;
    },
  },
  watch: {
    provCode() {
      if (this.provCode != 100000) {
        this.initPro(this.provCode, this.mapDepth);
        this.setProvInfoWindow();
      }
      var currZoom = this.provMap.getZoom();
      this.provMap.setCity(this.provCode, () => this.provMap.setZoom(currZoom));
    },
    mapDepth() {
      this.initPro(this.provCode, this.mapDepth);
      this.setProvInfoWindow();
    },
  },
  methods: {
    restoreHG() {
      this.graphType = "original";
    },
    initPro(code, dep) {
      dep = typeof dep == "undefined" ? 2 : dep;
      this.provCode = code;
      this.mapDepth = dep;

      this.disProvince && this.disProvince.setMap(null);

      this.disProvince = new AMap.DistrictLayer.Province({
        zIndex: 12,
        adcode: [code],
        depth: dep,
        styles: {
          fill: (properties) => {
            // properties为可用于做样式映射的字段，包含
            // NAME_CHN:中文名称
            // adcode_pro
            // adcode_cit
            // adcode
            return this.getColorByAdcode(properties.adcode);
          },
          "province-stroke": "cornflowerblue",
          "city-stroke": "white", // 中国地级市边界
          "county-stroke": "rgba(255,255,255,0.5)", // 中国区县边界
        },
      });
      this.disProvince.setMap(this.provMap);
    },

    putNationMap() {
      this.disCountry = new AMap.DistrictLayer.Country({
        zIndex: 10,
        SOC: "CHN",
        depth: 1,
        styles: {
          // "coastline-stroke": "#0088ff",
          // "province-stroke": "grey",
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
        center: [104.188488, 35.802032],
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
          showControlButton: false, // 是否显示倾斜、旋转按钮。默认为 true
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

      // this.nationMap.setLimitBounds(this.nationMap.getBounds());

      this.disCountry.on("mouseover", (e) => {
        this.disCountry.setStyles({
          fill: (props) => {
            if (e.props.adcode == props.adcode) return "rgba(240, 162, 20, 1)";
            //中国特有字段
            return this.getColorByGDP(props.adcode_pro, e.props.adcode_pro);
          },
          "nation-stroke": "#ff0000",
          "coastline-stroke": [0.85, 0.63, 0.94, 1],
          "province-stroke": "white",
          "city-stroke": "rgba(255,255,255,0.15)", //中国特有字段
        });
        this.infoWindow.setContent(
          this.customInfoWindow(e.props.NAME_CHN, "病例数：---<br/>占比：--%")
        );
        this.infoWindow.open(this.nationMap, [
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
        this.infoWindow.close();
      });
      this.disCountry.on("mousemove", (e) => {
        this.infoWindow.setPosition([
          e.origin.lnglat.getLng() + 0.5,
          e.origin.lnglat.getLat() + 0.5,
        ]);
      });
      this.disCountry.on("click", (e) => (this.provCode = e.props.adcode_pro));

      document.querySelector(".amap-logo").remove();
      document.querySelector(".amap-copyright").remove();
    },

    putProvMap() {
      var defaultLayer = AMap.createDefaultLayer();
      this.provMap = new AMap.Map("prov-container", {
        zooms: [3, 10],
        zoom: 6,
        center: [102.412427, 30.303573],
        isHotspot: false,
        defaultCursor: "pointer",
        pitch: 0,
        viewMode: "3D",
        layers: [defaultLayer],
      });
      this.provMap.addControl(new AMap.Scale());
      this.provMap.addControl(new AMap.ToolBar({ liteStyle: true }));
      this.provMap.addControl(
        new AMap.ControlBar({
          position: {
            right: "1vh",
            top: "1vh",
          },
          showControlButton: false, // 是否显示倾斜、旋转按钮。默认为 true
        })
      );

      // console.log(this.provMap.getLayers());
      // console.log(defaultLayer);
      this.provMap.removeLayer(defaultLayer); //移除默认图层
      // console.log(this.provMap.getLayers());

      this.initPro(this.provCode, this.mapDepth);

      //this.provMap.setLimitBounds(this.provMap.getBounds());

      /* 开启标注 */
      /* this.provMap.on("complete", () => {
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
        this.provMap.add(layer);
      }); */

      // 构造下拉框
      /* var optArr = adcodes.map((item) => {
        if (item.adcode == 100000) {
          item.name = "选择省份";
        }

        return (
          "<option " +
          (item.adcode == this.provCode ? "selected" : "") +
          ' value="' +
          item.adcode +
          '">' +
          item.name +
          "</option>"
        );
      }); */

      this.setProvInfoWindow();
      this.disProvince.on("mousemove", this.mapMouseMoveEvent);

      document.querySelector(".amap-logo").remove();
      document.querySelector(".amap-copyright").remove();

      // document.getElementById("adcode-list").innerHTML = optArr.join("");

      /* document
        .getElementById("adcode-list")
        .addEventListener("change", this.changeAdcode);
      document
        .getElementById("depth-list")
        .addEventListener("change", this.changeDepth); */
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

    getColorByAdcode(adcode) {
      if (!this.provColors[adcode]) {
        var gb = Math.random() * 155 + 50;
        this.provColors[adcode] = "rgb(" + gb + "," + gb + ",255)";
      }
      return this.provColors[adcode];
    },
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
    setProvInfoWindow() {
      this.disProvince.on("mouseover", this.mapMouseOverEvent);
      this.disProvince.on("mouseout", this.mapMouseOutEvent);
    },
    mapMouseOverEvent(e) {
      if (e.props.adcode_pro == this.provCode) {
        this.disProvince.setStyles({
          fill: (props) => {
            if (e.props.adcode == props.adcode) return "rgba(240, 162, 20, 1)";
            //中国特有字段
            return this.getColorByAdcode(props.adcode);
          },
          "province-stroke": "cornflowerblue",
          "city-stroke": "white", // 中国地级市边界
          "county-stroke": "rgba(255,255,255,0.5)", // 中国区县边界
        });
        this.infoWindow.setContent(
          this.customInfoWindow(e.props.NAME_CHN, "病例数：---<br/>占比：--%")
        );
        this.infoWindow.open(this.provMap, [
          e.origin.lnglat.getLng() + 0.1,
          e.origin.lnglat.getLat() + 0.1,
        ]);
      }
    },
    mapMouseOutEvent() {
      this.disProvince.setStyles({
        fill: (props) => {
          //中国特有字段
          return this.getColorByAdcode(props.adcode);
        },
        "province-stroke": "cornflowerblue",
        "city-stroke": "white", // 中国地级市边界
        "county-stroke": "rgba(255,255,255,0.5)", // 中国区县边界
      });
      this.infoWindow.close();
    },
    mapMouseMoveEvent(e) {
      this.infoWindow.setPosition([
        e.origin.lnglat.getLng() + 0.1,
        e.origin.lnglat.getLat() + 0.1,
      ]);
    },
    hgGuide() {
      this.$alert("超图介绍，附图", "超图介绍", {
        confirmButtonText: "确定",
        callback: () => {},
      });
    },
    back() {
      this.m_changeStep(this.m_stepActive - 1);
    },
  },
  created() {},
  mounted() {
    window._AMapSecurityConfig = {
      securityJsCode: "80e09c6d325e98f2910c75c71d7ad8ef",
    };
    console.log("这是在mounted中：" + this.m_taskName);
    this.putNationMap(); //国家地图
    this.putProvMap(); //省份地图
  },
};
</script>
  
<style scoped>
.title {
  font-size: 26px;
  margin: 5px auto 40px auto;
  text-align: center;
  font-weight: bold;
}

.tags {
  display: flex !important;
  flex-wrap: wrap;
}

.tags > * {
  margin: 5px !important;
  max-width: 300px;
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
  /* color: rgb(100, 172, 231); */
  color: #e6a23c;
  font-weight: 40;
}

.hgDiv {
  display: flex;
}

/*.highlightFea {
  background-color: #e6a23c !important;
}*/

.select-layer > * {
  margin-top: 1em;
}

.select-layer > .el-radio-button > ::v-deep * {
  font-size: 1.3vh;
  padding-inline: 10px;
}

/* 防止最后一个标签溢出换行 */
::v-deep .el-slider__marks-text {
  white-space: pre;
}

.spa-fea-card ::v-deep .el-card__body {
  height: 70vh;
}

.spa-fea-card {
  height: 110vh;
}

.input-card {
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: 0.25rem;
  width: 12rem;
  border-width: 0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  bottom: 1rem;
  right: 1rem;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 0.75rem 1.25rem;
}

.prov-select {
  display: flex;
  flex-direction: row;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: 0.25rem;
  width: 95%;
  box-shadow: 0 2px 6px 0 rgba(118, 118, 118, 0.5);
  padding: 0.75rem 1.25rem;
}

.prov-select > * {
  flex: auto;
}

.prov-select span {
  margin-inline: 2vh;
  font-weight: bold;
}

.prov-select ::v-deep .el-input {
  width: 15vh;
}

::v-deep .custom-info {
  border: solid 1px silver;
  border-radius: 5px;
}

::v-deep .info-top {
  position: relative;
  background: none repeat scroll 0 0 #f9f9f9af;
  backdrop-filter: blur(3px); /* 毛玻璃效果 */
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

<style>
.hg-card .el-card__body {
  background: #00000008;
  padding: 0px;
}

.input-group-lg {
  position: absolute;
  top: 0;
  right: 50px;
  max-width: 15%;
}
#confirm {
  margin-top: 5%;
}
#reset {
  margin-top: 5%;
}
.close_information {
  float: right;
  color: brown;
}

.show-layer-hg {
  width: 100%;
}

.show-layer-hg > img {
  max-width: 100%;
  max-height: 120vh;
}

.el-form-item > label {
  font-size: 16px;
  font-weight: bold;
}

#map-container,
#prov-container {
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
  margin: 0px;
}
</style>