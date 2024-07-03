<template>
  <div>
    <!-- <el-progress
      type="circle"
      v-if="isTaskSubmiting"
      :percentage="hgProgress"
      :color="progressColors"
      :format="progressText"
      style="
        position: absolute;
        top: 47%;
        left: 47%;
        z-index: 10000;
        background: rgba(255, 255, 255, 0.85);
        padding: 20px;
        border-radius: 4px;
      "
    ></el-progress> -->
    <div class="peeek-loading" v-if="isTaskSubmiting">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>

    <el-steps
      :active="stepActive"
      align-center
      finish-status="success"
      style="margin: 50px"
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
        description="编辑任务基础信息和超图构建类型"
      ></el-step>
      <el-step
        title="数据选择"
        description="选择构建超图的对象疾病和数据集"
      ></el-step>
      <!-- <el-step
        title="特征筛选"
        description="选择想要加入构建任务的特征"
      ></el-step> -->
      <el-step title="结果展示" description="可视化结果展示"></el-step>
    </el-steps>

    <el-main v-if="stepActive == 0" class="mainBox">
      <TaskInfoVue :moduleName="moduleName"></TaskInfoVue>
    </el-main>

    <el-main v-if="stepActive == 1" class="mainBox">
      <DataSelectVue :moduleName="moduleName"></DataSelectVue>
    </el-main>

    <div
      class="feaDiv"
      v-show="stepActive == 2 && taskInfo.taskType === '时间超图'"
    >
      <el-card style="flex: 2; margin: 2em" class="time-fea-card">
        <div slot="header" class="clearfix">
          <span class="line-style">▍</span><span>数据集原始特征</span>
        </div>
        <el-input
          v-model="searchFea"
          placeholder="请输入要搜索的特征"
          prefix-icon="el-icon-search"
          style="max-width: 500px; margin-right: 20px"
        />
        <el-button type="warning" icon="el-icon-search" @click="searchFeature"
          >搜索</el-button
        >
        <el-button type="primary" @click="stepActive--">上一步</el-button>
        <el-divider />
        <ul class="tags tags-temp">
          <li
            v-for="tag in feaTagsTemp"
            :key="tag"
            :class="{ highlightFea: tag === searchFeaVari }"
            @click="selectFeature(tag)"
            style="cursor: pointer"
          >
            {{ tag }}
          </li>
        </ul>
      </el-card>
      <el-dialog title="节点关联展示" :visible.sync="subgraphVisible">
        <div
          id="hg-plot-part"
          style="width: 80vh; height: 65vh; max-width: 90vh; max-height: 80vh"
        ></div>
      </el-dialog>
    </div>
    <div
      class="hgDiv"
      v-show="stepActive == 2 && taskInfo.taskType === '时间超图'"
    >
      <el-card id="container" class="hg-card" style="flex: 4; margin: 2em">
        <div slot="header" class="clearfix" style="position: relative">
          <span class="line-style">▍</span><span>时间超图可视化</span>
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
        <div
          id="hg-plot"
          v-show="showTimeHG === 0"
          style="width: inherit; max-height: 90vh"
        ></div>
        <div
          id="hg-plot-time1"
          v-show="showTimeHG === 1"
          style="width: inherit; max-height: 90vh"
        ></div>
        <div
          id="hg-plot-time2"
          v-show="showTimeHG === 2"
          style="width: inherit; max-height: 90vh"
        ></div>
      </el-card>
      <div style="flex: 2.5">
        <div style="margin-top: 30px">
          <span class="line-style">▍</span><span>选择时间片</span>
        </div>
        <el-slider
          v-model="timeLineValue"
          :marks="timeLineMarks"
          class="time-line-slider"
          @input="handleTimeLineChange"
        >
        </el-slider>
        <el-table
          :data="edgeTable"
          class="edge-table"
          style="margin-bottom: 50px; height: 35vh"
          border
        >
          <el-table-column prop="degree" label="degree"></el-table-column>
          <el-table-column prop="index" label="label"></el-table-column>
          <el-table-column
            ><template slot="header">
              <svg
                class="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style="padding-left: 3px"
              >
                <path
                  d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"
                ></path>
              </svg>
            </template>
            <svg
              class="MuiSvgIcon-root"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style="padding-left: 3px"
            >
              <path
                d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"
              ></path>
            </svg>
          </el-table-column>
          <el-table-column
            ><template slot="header">
              <svg
                class="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                ></path>
              </svg>
            </template>
          </el-table-column>
          <el-table-column
            ><template slot="header">
              <svg
                class="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"
                ></path>
                <circle cx="6.5" cy="11.5" r="1.5"></circle>
                <circle cx="9.5" cy="7.5" r="1.5"></circle>
                <circle cx="14.5" cy="7.5" r="1.5"></circle>
                <circle cx="17.5" cy="11.5" r="1.5"></circle>
              </svg>
            </template>
            <svg
              class="MuiSvgIcon-root"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"
              ></path>
              <circle cx="6.5" cy="11.5" r="1.5"></circle>
              <circle cx="9.5" cy="7.5" r="1.5"></circle>
              <circle cx="14.5" cy="7.5" r="1.5"></circle>
              <circle cx="17.5" cy="11.5" r="1.5"></circle>
            </svg>
          </el-table-column>
        </el-table>
        <el-card style="position: relative; height: 35vh">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>新增特征</span>
          </div>
          <ul class="newTags" v-if="timeLineValue >= 50 && timeLineValue < 100">
            <li>smoking(1yrs)</li>
            <li>Carcinogenic exposure(1yrs)</li>
          </ul>
          <ul class="newTags" v-if="timeLineValue === 100">
            <li>smoking(2yrs)</li>
            <li>Chronic lung disease(2yrs)</li>
          </ul>
        </el-card>
      </div>
    </div>
    <div
      class="hgDiv"
      v-show="stepActive == 2 && taskInfo.taskType === '空间超图'"
    >
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
              @click="stepActive--"
              style="font-weight: bold; font-size: 18px; flex: auto"
              :disabled="isLog === false ? false : true"
              >上一步</el-button
            >
          </div>
        </div>
        <el-card id="container">
          <div slot="header" class="clearfix" style="position: relative">
            <span class="line-style">▍</span
            ><span
              >{{ taskInfo.tableDisease + taskInfo.taskType }} 构建结果</span
            >
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
              v-if="showHG && graphType == 'original'"
              :src="
                'http://' +
                this.backendAddr +
                '/static/' +
                taskInfo.taskName +
                '/spatial_ori.png'
              "
            />
            <img
              v-if="showHG && graphType === '生理学'"
              :src="
                'http://' +
                this.backendAddr +
                '/static/' +
                taskInfo.taskName +
                '/spatial_cli.png'
              "
            />
            <img
              v-if="showHG && graphType === '人口学'"
              :src="
                'http://' +
                this.backendAddr +
                '/static/' +
                taskInfo.taskName +
                '/spatial_rela.png'
              "
            />
            <img
              v-if="showHG && graphType === '行为学'"
              :src="
                'http://' +
                this.backendAddr +
                '/static/' +
                taskInfo.taskName +
                '/spatial_habi.png'
              "
            />
            <img
              v-if="showHG && graphType === '1and2'"
              :src="
                'http://' +
                this.backendAddr +
                '/static/' +
                taskInfo.taskName +
                '/spatial_1and2.png'
              "
            />
            <img
              v-if="showHG && graphType === '2and3'"
              :src="
                'http://' +
                this.backendAddr +
                '/static/' +
                taskInfo.taskName +
                '/spatial_2and3.png'
              "
            />
            <img
              v-if="showHG && graphType === '1and3'"
              :src="
                'http://' +
                this.backendAddr +
                '/static/' +
                taskInfo.taskName +
                '/spatial_1and3.png'
              "
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
import axios from "axios";
import { mapState } from "vuex";

import { hgColorEdgePlot } from "../../lib/src/drawing/index";
import moment from "moment";
import * as d3 from "d3";

import * as api from "@/utils/api";

import DataSelectVue from "./subcomponents/DataSelect.vue";
import TaskInfoVue from "./subcomponents/TaskInfo.vue";

// import ip from "@/components/ip";
// import G6 from "@antv/g6";
export default {
  name: "HGConstruct",
  components: {
    TaskInfoVue,
    DataSelectVue,
  },
  data() {
    return {
      moduleName:"hgConstruct",

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
      }),

      provinces: adcodes,
      provCode: 510000,
      mapDepth: 2,
      disProvince: null,
      provMap: null,
      provColors: {},

      hgProgress: 0, //模拟超图构建进度百分比
      progressColors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ],
      isTaskSubmiting: false,

      backendAddr: "localhost:8186", //记录后端主机名
      isLog: false, //是否是从任务日志页面跳转

      // graph: {
      //   nodes: [
      //     { id: "cough", links: ["1", "3"] },
      //     { id: "Pulmonary nodule", links: ["1", "2"] },
      //     { id: "smoking", links: ["2", "4", "5"] },
      //     { id: "age", links: ["3", "4", "5"] },
      //     { id: "Pulmonary edema", links: ["3"] },
      //     { id: "family history", links: ["4", "5"] },
      //     { id: "radiotherapy", links: ["4", "5", "6"] },
      //     { id: "thoracodynia", links: ["5", "6"] },
      //     { id: "Chronic lung disease", links: ["5"] },
      //     { id: "hemoptysis", links: ["5", "6"] },
      //     { id: "Carcinogenic exposure", links: ["6"] },
      //   ],
      //   links: [
      //     { id: "1", nodes: ["cough", "Pulmonary nodule"] },
      //     { id: "2", nodes: ["Pulmonary nodule", "smoking"] },
      //     { id: "3", nodes: ["age", "cough", "Pulmonary edema"] },
      //     { id: "4", nodes: ["smoking", "family history", "radiotherapy", "age"] },
      //     {
      //       id: "5",
      //       nodes: [
      //         "family history",
      //         "radiotherapy",
      //         "thoracodynia",
      //         "Chronic lung disease",
      //         "hemoptysis",
      //         "smoking",
      //         "age",
      //       ],
      //     },
      //     { id: "6", nodes: ["Carcinogenic exposure", "radiotherapy", "hemoptysis", "thoracodynia"] },
      //   ],
      edgeTable: [
        {
          index: 0,
          degree: 5,
        },
        {
          index: 1,
          degree: 4,
        },
        {
          index: 2,
          degree: 2,
        },
      ],
      graph: {
        nodes: [
          { id: "cough", links: ["1"] },
          { id: "Pulmonary nodule", links: ["1"] },
          { id: "smoking", links: ["2"] },
          { id: "age", links: ["2"] },
          { id: "Pulmonary edema", links: ["2"] },
          { id: "family history", links: ["2"] },
          { id: "radiotherapy", links: ["3"] },
          { id: "thoracodynia", links: ["3"] },
          { id: "Chronic lung disease", links: ["3"] },
          { id: "hemoptysis", links: ["3"] },
          { id: "Carcinogenic exposure", links: ["3"] },
        ],
        links: [
          { id: "1", nodes: ["cough", "Pulmonary nodule"] },
          {
            id: "2",
            nodes: ["Pulmonary edema", "smoking", "age", "family history"],
          },
          {
            id: "3",
            nodes: [
              "radiotherapy",
              "thoracodynia",
              "Chronic lung disease",
              "hemoptysis",
              "Carcinogenic exposure",
            ],
          },
        ],
        nodelinks: [],
      },
      subgraph: {},
      // timeGraph1: {
      //   nodes: [
      //     { id: "cough", links: ["1", "3"] },
      //     { id: "Pulmonary nodule", links: ["1", "2"] },
      //     { id: "smoking", links: ["2", "4", "5"] },
      //     { id: "age", links: ["3", "4", "5"] },
      //     { id: "Pulmonary edema", links: ["3"] },
      //     { id: "family history", links: ["4", "5"] },
      //     { id: "radiotherapy", links: ["4", "5", "6"] },
      //     { id: "thoracodynia", links: ["5", "6"] },
      //     { id: "Chronic lung disease", links: ["5"] },
      //     { id: "hemoptysis", links: ["5", "6"] },
      //     { id: "Carcinogenic exposure", links: ["6"] },
      //     { id: "smoking(1yrs)", links: ["1", "2"] },
      //     { id: "Carcinogenic exposure(1yrs)", links: ["6"] },
      //   ],
      //   links: [
      //     {
      //       id: "1",
      //       nodes: ["cough", "Pulmonary nodule", "smoking(1yrs)"],
      //     },
      //     {
      //       id: "2",
      //       nodes: ["Pulmonary nodule", "smoking", "smoking(1yrs)"],
      //     },
      //     { id: "3", nodes: ["age", "cough", "Pulmonary edema"] },
      //     {
      //       id: "4",
      //       nodes: ["smoking", "family history", "radiotherapy", "age"],
      //     },
      //     {
      //       id: "5",
      //       nodes: [
      //         "family history",
      //         "radiotherapy",
      //         "thoracodynia",
      //         "Chronic lung disease",
      //         "hemoptysis",
      //         "smoking",
      //         "age",
      //       ],
      //     },
      //     {
      //       id: "6",
      //       nodes: [
      //         "Carcinogenic exposure",
      //         "radiotherapy",
      //         "hemoptysis",
      //         "thoracodynia",
      //         "Carcinogenic exposure(1yrs)",
      //       ],
      //     },
      //   ],
      //   nodelinks: [],
      // },
      // timeGraph2: {
      //   nodes: [
      //     { id: "cough", links: ["1", "3"] },
      //     { id: "Pulmonary nodule", links: ["1", "2"] },
      //     { id: "smoking", links: ["2", "4", "5"] },
      //     { id: "age", links: ["3", "4", "5"] },
      //     { id: "Pulmonary edema", links: ["3"] },
      //     { id: "family history", links: ["4", "5"] },
      //     { id: "radiotherapy", links: ["4", "5", "6"] },
      //     { id: "thoracodynia", links: ["5", "6"] },
      //     { id: "Chronic lung disease", links: ["5"] },
      //     { id: "hemoptysis", links: ["5", "6"] },
      //     { id: "Carcinogenic exposure", links: ["6"] },
      //     { id: "smoking(1yrs)", links: ["1", "2"] },
      //     { id: "Carcinogenic exposure(1yrs)", links: ["6"] },
      //     { id: "smoking(2yrs)", links: ["1"] },
      //     { id: "Chronic lung disease(2yrs)", links: ["1", "3"] },
      //   ],
      //   links: [
      //     {
      //       id: "1",
      //       nodes: [
      //         "cough",
      //         "Pulmonary nodule",
      //         "smoking(1yrs)",
      //         "smoking(2yrs)",
      //         "Chronic lung disease(2yrs)",
      //       ],
      //     },
      //     {
      //       id: "2",
      //       nodes: ["Pulmonary nodule", "smoking", "smoking(1yrs)"],
      //     },
      //     {
      //       id: "3",
      //       nodes: [
      //         "age",
      //         "cough",
      //         "Pulmonary edema",
      //         "Chronic lung disease(2yrs)",
      //       ],
      //     },
      //     {
      //       id: "4",
      //       nodes: ["smoking", "family history", "radiotherapy", "age"],
      //     },
      //     {
      //       id: "5",
      //       nodes: [
      //         "family history",
      //         "radiotherapy",
      //         "thoracodynia",
      //         "Chronic lung disease",
      //         "hemoptysis",
      //         "smoking",
      //         "age",
      //       ],
      //     },
      //     {
      //       id: "6",
      //       nodes: [
      //         "Carcinogenic exposure",
      //         "radiotherapy",
      //         "hemoptysis",
      //         "thoracodynia",
      //         "Carcinogenic exposure(1yrs)",
      //       ],
      //     },
      //   ],
      //   nodelinks: [],
      // },
      timeGraph1: {
        nodes: [
          { id: "cough", links: ["1"] },
          { id: "Pulmonary nodule", links: ["1"] },
          { id: "smoking", links: ["2"] },
          { id: "age", links: ["2"] },
          { id: "Pulmonary edema", links: ["2"] },
          { id: "family history", links: ["2"] },
          { id: "radiotherapy", links: ["3"] },
          { id: "thoracodynia", links: ["3"] },
          { id: "Chronic lung disease", links: ["3"] },
          { id: "hemoptysis", links: ["3"] },
          { id: "Carcinogenic exposure", links: ["3"] },
          { id: "Carcinogenic exposure(1yrs)", links: ["3"] },
          { id: "smoking(1yrs)", timeLineMarks: ["1"] },
        ],
        links: [
          { id: "1", nodes: ["cough", "Pulmonary nodule", "smoking(1yrs)"] },
          {
            id: "2",
            nodes: ["Pulmonary edema", "smoking", "age", "family history"],
          },
          {
            id: "3",
            nodes: [
              "radiotherapy",
              "thoracodynia",
              "Chronic lung disease",
              "hemoptysis",
              "Carcinogenic exposure",
              "Carcinogenic exposure(1yrs)",
            ],
          },
        ],
        nodelinks: [],
      },
      timeGraph2: {
        nodes: [
          { id: "cough", links: ["1"] },
          { id: "Pulmonary nodule", links: ["1"] },
          { id: "smoking", links: ["2"] },
          { id: "age", links: ["2"] },
          { id: "Pulmonary edema", links: ["2"] },
          { id: "family history", links: ["2"] },
          { id: "radiotherapy", links: ["3"] },
          { id: "thoracodynia", links: ["3"] },
          { id: "Chronic lung disease", links: ["3"] },
          { id: "hemoptysis", links: ["3"] },
          { id: "Carcinogenic exposure", links: ["3"] },
          { id: "Carcinogenic exposure(1yrs)", links: ["3"] },
          { id: "smoking(1yrs)", links: ["1", "4"] },
          { id: "Chronic lung disease(2yrs)", links: ["4"] },
          { id: "smoking(2yrs)", links: ["2"] },
        ],
        links: [
          { id: "1", nodes: ["cough", "Pulmonary nodule", "smoking(1yrs)"] },
          {
            id: "2",
            nodes: [
              "Pulmonary edema",
              "smoking",
              "age",
              "family history",
              "smoking(2yrs)",
            ],
          },
          {
            id: "3",
            nodes: [
              "radiotherapy",
              "thoracodynia",
              "Chronic lung disease",
              "hemoptysis",
              "Carcinogenic exposure",
              "Carcinogenic exposure(1yrs)",
            ],
          },
          {
            id: "4",
            nodes: [
              "Chronic lung disease(2yrs)",
              "smoking(1yrs)",
              "cough",
              "family history",
            ],
          },
        ],
        nodelinks: [],
      },
      subgraphVisible: false,
      showTimeHG: 0,

      stepActive: 2,
      activeTimeStamp: 1,
      graphType: "original",
      feaShow: false,
      timeLineValue: 0,
      timeLineMarks: { 0: "时间点1", 50: "时间点2", 100: "时间点3" },
      options_disease: [
        //所属疾病选项
        {
          value: "血脂异常",
          label: "血脂异常",
        },
        {
          value: "肺癌",
          label: "肺癌",
        },
        {
          value: "胃癌",
          label: "胃癌",
        },
        {
          value: "糖尿病",
          label: "糖尿病",
        },
        {
          value: "高血压",
          label: "高血压",
        },
        {
          value: "结直肠癌",
          label: "结直肠癌",
        },
        {
          value: "白血病",
          label: "白血病",
        },
        {
          value: "阿尔兹海默症",
          label: "阿尔兹海默症",
        },
        {
          value: "精神分裂症",
          label: "精神分裂症",
        },
        {
          value: "乳腺癌",
          label: "乳腺癌",
        },
        {
          value: "前列腺癌",
          label: "前列腺癌",
        },
      ],
      dataOptions: [],
      options_up: [
        //上传选项
        // {
        //   value: "跨时空超图",
        //   label: "跨时空超图",
        // },
        {
          value: "时间超图",
          label: "时间超图",
        },
        {
          value: "空间超图",
          label: "空间超图",
        },
        // {
        //   value: "危险因素关联超图",
        //   label: "危险因素关联超图",
        // },
      ],
      timeFlows: [
        {
          content: "时间点1",
          timestamp: "2020-04-11",
        },
        {
          content: "时间点2",
          timestamp: "2019-04-11",
        },
        {
          content: "时间点3",
          timestamp: "2018-04-11",
        },
      ],
      showHG: false,
      searchFea: "",
      searchFeaVari: "",
      hyperEdgeCount: 6,
      feaCount: 11,
      feaTags: [],
      feaTagsTemp: [
        "cough",
        "Pulmonary nodule",
        "smoking",
        "smoking(1yrs)",
        "smoking(2yrs)",
        "age",
        "Pulmonary edema",
        "family history",
        "radiotherapy",
        "thoracodynia",
        "Chronic lung disease",
        "Chronic lung disease(2yrs)",
        "hemoptysis",
        "Carcinogenic exposure",
        "Carcinogenic exposure(1yrs)",
      ],
      taskInfo: {
        tableDisease: "",
        tableName: "",
        taskType: "",
        taskName: "",
        createTime: "",
        creater: "EthanJ",
        rules: {
          tableName: {
            required: true,
            message: "请选择数据表",
            trigger: "change",
          },
          tableDisease: {
            required: true,
            message: "请选择目标疾病",
            trigger: "change",
          },
          taskType: {
            required: true,
            message: "请选择任务类型",
            trigger: "change",
          },
          taskName: [
            { required: true, message: "请输入任务名称", trigger: "blur" },
            {
              min: 4,
              max: 50,
              message: "长度在 4 到 50 个字符",
              trigger: "blur",
            },
          ],
        },
        // clusterNumber: '',
        // clusterFENumber: "",
      },

      // option: {
      //   animationDurationUpdate: 1500,
      //   animationEasingUpdate: "quinticInOut",
      //   color: "#d44242",
      //   series: [
      //     {
      //       type: "graph",
      //       layout: "none",
      //       symbolSize: 50,
      //       roam: true,
      //       label: {
      //         show: true,
      //       },
      //       edgeSymbol: ["circle", ""],
      //       edgeSymbolSize: [4, 10],
      //       edgeLabel: {
      //         fontSize: 20,
      //       },
      //       data: [
      //         {
      //           name: "edge 1",
      //           x: 50,
      //           y: 150,
      //         },
      //         {
      //           name: "edge 2",
      //           x: 150,
      //           y: 125,
      //         },
      //         {
      //           name: "edge 3",
      //           x: 250,
      //           y: 100,
      //         },
      //         {
      //           name: "edge 4",
      //           x: 350,
      //           y: 100,
      //         },
      //         {
      //           name: "edge 5",
      //           x: 450,
      //           y: 125,
      //         },
      //         {
      //           name: "edge 6",
      //           x: 550,
      //           y: 150,
      //         },
      //         {
      //           name: "cough",
      //           x: 50,
      //           y: 400,
      //         },
      //         {
      //           name: "Pulmonary nodule",
      //           x: 100,
      //           y: 400,
      //         },
      //         {
      //           name: "smoking",
      //           x: 150,
      //           y: 400,
      //         },
      //         {
      //           name: "age",
      //           x: 200,
      //           y: 400,
      //         },
      //         {
      //           name: "Pulmonary edema",
      //           x: 250,
      //           y: 400,
      //         },
      //         {
      //           name: "Pulmonary edema",
      //           x: 300,
      //           y: 400,
      //         },
      //         {
      //           name: "radiotherapy",
      //           x: 350,
      //           y: 400,
      //         },
      //         {
      //           name: "thoracodynia",
      //           x: 400,
      //           y: 400,
      //         },
      //         {
      //           name: "慢性阻塞性肺疾病",
      //           x: 450,
      //           y: 400,
      //         },
      //         {
      //           name: "hemoptysis",
      //           x: 500,
      //           y: 400,
      //         },
      //         {
      //           name: "Carcinogenic exposure",
      //           x: 550,
      //           y: 400,
      //         },
      //       ],
      //       // links: [],
      //       links: [
      //         {
      //           source: "edge 1",
      //           target: "cough",
      //         },
      //         {
      //           source: "edge 1",
      //           target: "Pulmonary nodule",
      //         },
      //         {
      //           source: "edge 2",
      //           target: "Pulmonary nodule",
      //         },
      //         {
      //           source: "edge 2",
      //           target: "smoking",
      //         },
      //         {
      //           source: "edge 3",
      //           target: "age",
      //         },
      //         {
      //           source: "edge 3",
      //           target: "cough",
      //         },
      //         {
      //           source: "edge 3",
      //           target: "Pulmonary edema",
      //         },
      //         {
      //           source: "edge 4",
      //           target: "smoking",
      //         },
      //         {
      //           source: "edge 4",
      //           target: "Pulmonary edema",
      //         },
      //         {
      //           source: "edge 4",
      //           target: "radiotherapy",
      //         },
      //         {
      //           source: "edge 4",
      //           target: "age",
      //         },
      //         {
      //           source: "edge 5",
      //           target: "Pulmonary edema",
      //         },
      //         {
      //           source: "edge 5",
      //           target: "radiotherapy",
      //         },
      //         {
      //           source: "edge 5",
      //           target: "thoracodynia",
      //         },
      //         {
      //           source: "edge 5",
      //           target: "慢性阻塞性肺疾病",
      //         },
      //         {
      //           source: "edge 5",
      //           target: "hemoptysis",
      //         },
      //         {
      //           source: "edge 5",
      //           target: "smoking",
      //         },
      //         {
      //           source: "edge 5",
      //           target: "age",
      //         },
      //         {
      //           source: "edge 6",
      //           target: "Carcinogenic exposure",
      //         },
      //         {
      //           source: "edge 6",
      //           target: "radiotherapy",
      //         },
      //         {
      //           source: "edge 6",
      //           target: "hemoptysis",
      //         },
      //         {
      //           source: "edge 6",
      //           target: "thoracodynia",
      //         },
      //       ],
      //       line-style: {
      //         opacity: 0.9,
      //         width: 2,
      //         curveness: 0,
      //       },
      //     },
      //   ],
      // },
    };
  },
  computed: {
    // timeStampStatus() {
    //   return function (index) {
    //     return this.activeTimeStamp === index + 1 ? "finish" : "process";
    //   };
    // },
    ...mapState("hgConstruct", ["stepActive"]),
    classifiedTable() {
      return new Map([
        ["血脂异常", []],
        ["肺癌", []],
        ["胃癌", []],
        ["糖尿病", []],
        ["高血压", []],
        ["结直肠癌", []],
        ["白血病", []],
        ["阿尔兹海默症", []],
        ["精神分裂症", []],
        ["乳腺癌", []],
        ["前列腺癌", []],
      ]);
    },
  },
  watch: {
    provCode() {
      if (this.provCode != 100000) {
        this.initPro(this.provCode, this.mapDepth);
        this.setProvInfoWindow();
        console.dir(this.disProvince);
        var properties = Object.getOwnPropertyNames(this.disProvince);

        console.log(properties);
        // 过滤出方法
        var methods = properties.filter((property) => {
          return typeof this.disProvince[property] === "function";
        });

        console.log("Object methods:", methods);
      }
    },
    mapDepth() {
      this.initPro(this.provCode, this.mapDepth);
      this.setProvInfoWindow();
    },
    timeLineValue() {
      this.graphType = "original";
    },
    graphType() {
      this.timeLineValue = 0;
    },
    "taskInfo.tableDisease": function (newValue, oldValue) {
      this.dataOptions = this.classifiedTable.get(newValue);
    },
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
    /* changeAdcode(e) {
      var code = e.target.value;
      if (code != 100000) {
        this.initPro(code, this.mapDepth);
        this.setProvInfoWindow();
      }
    },
    changeDepth(e) {
      var dep = e.target.value;
      this.initPro(this.provCode, dep);
      this.setProvInfoWindow();
    }, */
    /* changeAdcode(v) {
      if (v != 100000) {
        this.initPro(v, this.mapDepth);
        this.setProvInfoWindow();
      }
    },
    changeDepth(v) {
      this.initPro(this.provCode, v);
      this.setProvInfoWindow();
    }, */
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
          this.customInfoWindow(e.props.NAME_CHN, "病例数：×××<br/>占比：××%")
        );
        this.infoWindow.open(this.provMap, [
          e.origin.lnglat.getLng(),
          e.origin.lnglat.getLat(),
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
        e.origin.lnglat.getLng() + 0.2,
        e.origin.lnglat.getLat() + 0.2,
      ]);
    },

    setProvInfoWindow() {
      this.disProvince.on("mouseover", this.mapMouseOverEvent);
      this.disProvince.on("mouseout", this.mapMouseOutEvent);
    },

    putNationMap() {
      this.disCountry = new AMap.DistrictLayer.Country({
        zIndex: 10,
        SOC: "CHN",
        depth: 1,
        styles: {
          // "nation-stroke": "#ff0000",
          // "coastline-stroke": "#0088ff",
          // "province-stroke": "grey",
          "nation-stroke": "#fff",
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

      this.disCountry.on("mouseover", (e) => {
        this.disCountry.setStyles({
          fill: (props) => {
            if (e.props.adcode == props.adcode) return "rgba(240, 162, 20, 1)";
            //中国特有字段
            return this.getColorByGDP(props.adcode_pro, e.props.adcode_pro);
          },
          "nation-stroke": "#fff",
          "coastline-stroke": [0.85, 0.63, 0.94, 1],
          "province-stroke": "white",
          "city-stroke": "rgba(255,255,255,0.15)", //中国特有字段
        });
        this.infoWindow.setContent(
          this.customInfoWindow(e.props.NAME_CHN, "病例数：×××<br/>占比：××%")
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
          "nation-stroke": "#fff",
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
      // this.provMap.removeLayer(defaultLayer); //移除默认图层
      // console.log(this.provMap.getLayers());

      this.initPro(this.provCode, this.mapDepth);

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

    handleTimeLineChange() {
      if (this.timeLineValue === 0) {
        this.showTimeHG = 0;
        d3.select("#hg-plot").selectAll("*").remove();
        d3.select("#hg-plot-time1").selectAll("*").remove();
        d3.select("#hg-plot-time2").selectAll("*").remove();
        this.drawHG(
          this.graph,
          {
            sizeNodes: "default",
            colorEdges: "default",
            colorNodes: "default",
            windowWidth: window.innerWidth * 0.5,
            windowHeight: window.innerHeight,
          },
          ""
        );
      } else if (this.timeLineValue === 50) {
        this.showTimeHG = 1;
        d3.select("#hg-plot").selectAll("*").remove();
        d3.select("#hg-plot-time1").selectAll("*").remove();
        d3.select("#hg-plot-time2").selectAll("*").remove();
        this.drawHG(
          this.timeGraph1,
          {
            sizeNodes: "default",
            colorEdges: "default",
            colorNodes: "default",
            windowWidth: window.innerWidth * 0.5,
            windowHeight: window.innerHeight,
          },
          "-time1"
        );
      } else if (this.timeLineValue === 100) {
        this.showTimeHG = 2;
        d3.select("#hg-plot").selectAll("*").remove();
        d3.select("#hg-plot-time1").selectAll("*").remove();
        d3.select("#hg-plot-time2").selectAll("*").remove();
        this.drawHG(
          this.timeGraph2,
          {
            sizeNodes: "default",
            colorEdges: "default",
            colorNodes: "default",
            windowWidth: window.innerWidth * 0.5,
            windowHeight: window.innerHeight,
          },
          "-time2"
        );
      }
    },
    // progressText(percentage) {
    //   return "正在构建中\n\n" + percentage + "%";
    // },
    restoreHG() {
      this.graphType = "original";
      this.timeLineValue = 0;
    },
    // changeTimeStamp(index) {
    //   this.activeTimeStamp = index + 1;
    //   this.graphType = "original";
    // },
    selectFeature(tag) {
      this.searchFeaVari = tag;
      this.drawNodeGraph();
      this.subgraphVisible = true;
    },
    searchFeature() {
      if (this.searchFea == null || this.searchFea == "") {
        this.searchFeaVari = "";
        this.$message.error("特征不能为空！");
        return;
      }
      this.searchFeaVari = this.searchFea;
      if (this.feaTagsTemp.indexOf(this.searchFea) === -1) {
        // if (this.feaTags.indexOf(this.searchFea) === -1) {
        this.$message("数据集中不存在该特征！");
        return;
      }
      this.drawNodeGraph();
      this.$message({
        message: "特征查询成功！",
        type: "success",
      });
      this.subgraphVisible = true;
    },

    drawNodeGraph() {
      this.generateSubgraph(this.searchFeaVari); //生成查询节点相关联的超图
      d3.select("#hg-plot-part").selectAll("*").remove();
      this.drawHG(
        this.subgraph,
        {
          sizeNodes: "default",
          colorEdges: "default",
          colorNodes: "default",
          windowWidth: window.innerWidth * 0.4,
          windowHeight: window.innerHeight * 0.4,
        },
        "-part"
      );
    },
    /* DFS生成子图 */
    generateSubgraph(fea) {
      let graph = JSON.parse(JSON.stringify(this.graph));
      let subgraph = {
        // id: fea,
        nodes: [],
        links: [],
        nodelinks: [],
      };

      let addedNodes = new Set();
      addedNodes.add(fea);

      let currentNode = graph.nodes.find((node) => node.id === fea);
      subgraph.nodes.push(currentNode);
      let sourceLinks = currentNode.links;

      for (let linkId of currentNode.links) {
        let link = graph.links.find((link) => link.id === linkId);
        if (link) {
          subgraph.links.push({ id: link.id, nodes: link.nodes });
          for (const linkedNodeId of link.nodes) {
            if (!addedNodes.has(linkedNodeId)) {
              currentNode = graph.nodes.find(
                (node) => node.id === linkedNodeId
              );
              for (let i = 0; i < currentNode.links.length; i++)
                if (sourceLinks.indexOf(currentNode.links[i]) === -1)
                  currentNode.links.splice(i, 1);
              subgraph.nodes.push(currentNode);
              addedNodes.add(linkedNodeId);
            }
          }
        }
      }
      this.subgraph = subgraph;
    },
    drawHG(graph, preferences, id) {
      hgColorEdgePlot(
        { graph: graph },
        { preferences: preferences },
        { idColorEdge: id }
      );
    },

    nextStep() {
      this.$refs["tableInfo"].validate((isValid) => {
        if (isValid) this.stepActive++;
      });
    },

    /* ①递归实现异步循环 */
    // recurLoop(i, max, interval) {
    //   if (this.hgProgress >= 98) {
    //     this.hgProgress = 99;
    //     return;
    //   } else this.hgProgress += 2;
    //   /* 后80%逐渐减慢直至99%停止 */
    //   if (i / max > 0.6) {
    //     setTimeout(() => {
    //       this.recurLoop(i + 1, max, interval + 20);
    //     }, interval);
    //   } else {
    //     /* 前80%匀速增加 */
    //     setTimeout(() => {
    //       this.recurLoop(i + 1, max, interval);
    //     }, interval);
    //   }
    // },
    // /* ②async/await实现异步循环 */
    // async asyncLoop(max, interval) {
    //   for (let i = 0; i < max; i++) {
    //     // 延时执行的异步任务
    //     await new Promise((resolve) => setTimeout(resolve, interval));
    //   }
    // },

    startTask() {
      this.$refs["taskInfo"].validate((isValid) => {
        if (isValid) {
          this.taskInfo.createTime = moment().format("YYYY-MM-DD[T]hh:mm:ss");
          this.$emit("show-overlay"); // 触发自定义事件，通知父组件显示蒙版
          this.isTaskSubmiting = true;
          console.log(this.isTaskSubmiting);

          /* 模拟后台执行耗时任务，这里使用 setTimeout 模拟 */
          const steps = 50; //总步数
          let interval = 100; // 初始间隔，单位毫秒
          let step = 1;

          // this.hgProgress = 0;
          // this.recurLoop(step, steps, interval);

          /* 开始任务 */
          api
            .postRequest("/task", this.taskInfo)
            .then((res) => {
              if (res.code === "200") {
                this.showHG = true;
                this.$emit("hide-overlay");
                this.isTaskSubmiting = false;
                api
                  .postRequest("/table/features/" + this.taskInfo.tableName)
                  .then((res) => {
                    if (res.code === "200") this.feaTags = res.data;
                  });
                this.stepActive++;
              } else if (res.code === "500") {
                this.$emit("hide-overlay");
                this.isTaskSubmiting = false;
                console.log("python脚本输出：\n" + res.data);
              }
            })
            .catch(() => this.$emit("hide-overlay"))
            .finally(() => this.$emit("hide-overlay"));
        }
      });
    },
    showFea() {
      if (this.taskInfo.tableName !== null && this.taskInfo.tableName !== "") {
        api
          .postRequest("/table/features/" + this.taskInfo.tableName)
          .then((res) => {
            if (res.code === "200") this.feaTags = res.data;
          });
        this.feaShow = true;
      } else {
        this.$message.error("请选择数据集");
      }
    },
    hgGuide() {
      this.$alert("这里放超图介绍，附图", "超图介绍", {
        confirmButtonText: "确定",
        callback: () => {},
      });
    },
    /* hasseGuide() {
      this.$alert("这里放哈斯图介绍，附图", "哈斯图介绍", {
        confirmButtonText: "确定",
        callback: () => {},
      });
    }, */
    tsHGGuide() {
      this.$alert("这里放跨时空超图介绍，附图", "跨时空超图介绍", {
        confirmButtonText: "确定",
        callback: () => {},
      });
    },

    /* drawHasse() {
      let chartDom = document.getElementById("chart-container");
      let myChart = echarts.init(chartDom);
      myChart.setOption(this.option);
    }, */

    getData() {
      api.getRequest("/tables").then((res) => {
        if (res) {
          for (let i = 0; i < res.length; i++) {
            if (this.classifiedTable.has(res[i].disease))
              this.classifiedTable.get(res[i].disease).push(res[i].tableName);
          }
        }
      });
    },
  },
  tttt() {},
  created() {
    // if (this.$route.params.source === "taskManage") {
    //   let taskTemp = this.$route.params.taskInfo;
    //   this.taskInfo.taskName = taskTemp.taskName;
    //   this.taskInfo.taskType = taskTemp.taskType;
    //   this.taskInfo.tableName = taskTemp.tableName;

    //   this.isLog = true;
    //   this.showHG = true;
    //   api.postRequest("/table/features/" + taskTemp.tableName).then((res) => {
    //     if (res.code === "200") this.feaTags = res.data;
    //     this.stepActive = 2;
    //   });
    // }
  },
  mounted() {
    this.graphType = "original";
    this.timeLineValue = 0;

    // this.py1();
    // this.getDataOptions();
    // this.getAlgorithmOptions();
    // this.clusterGraph()
    // this.drawHG(
    //   this.graph,
    //   {
    //     sizeNodes: "default",
    //     colorEdges: "default",
    //     colorNodes: "default",
    //     windowWidth: window.innerWidth * 0.5,
    //     windowHeight: window.innerHeight,
    //   },
    //   ""
    // );

    // this.getData();

    window._AMapSecurityConfig = {
      securityJsCode: "80e09c6d325e98f2910c75c71d7ad8ef",
    };
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

.tags,
.newTags {
  width: inherit;
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  font-weight: bold;
  overflow: auto;
  height: 90%;
}

.tags-temp {
  height: auto;
}

.tags > li {
  background-color: #2f84e6;
  color: #fff;
  border-radius: 0.4em;
  padding: 0.5em;
  margin: 0.5em;
  font-size: 1.1em;
  text-align: center;
  min-width: 100px;
  max-width: 200px;
  max-height: 100%;
  flex: auto;
}

.newTags > li {
  background-color: #67c23a;
  color: #fff;
  border-radius: 0.4em;
  padding: 0.5em;
  margin: 0.5em;
  font-size: 1.1em;
  text-align: center;
  min-width: fit-content;
  flex: auto;
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

.hgDiv,
.feaDiv,
.statDiv {
  display: flex;
}

.highlightFea {
  background-color: #e6a23c !important;
}

.select-layer > * {
  margin-top: 1em;
}

.select-layer > .el-radio-button > ::v-deep * {
  font-size: 1.3vh;
  padding-inline: 10px;
}

.time-line-slider {
  margin-inline: 20px;
  margin-top: 50px;
  margin-bottom: 100px;
}

.time-line-slider ::v-deep div {
  font-weight: bold;
  font-size: 18px;
}

/* 防止最后一个标签溢出换行 */
::v-deep .el-slider__marks-text {
  white-space: pre;
}

.table-select-fea-card ::v-deep .el-card__body {
  height: 441.67px;
}

.time-fea-card ::v-deep .el-card__body {
  height: 21vh;
}

.ts-fea-card ::v-deep .el-card__body {
  height: 20vh;
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

/* 加载动画 */

/* 超图表格 */
.MuiSvgIcon-root {
  fill: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 1.5rem;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  flex-shrink: 0;
  user-select: none;
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
.link {
  stroke-width: 2px;
  fill: none;
  stroke: #bbb;
}
.node circle {
  pointer-events: all;
  stroke: #000;
  stroke-width: 1px;
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

.task-info-dialog > * {
  margin-top: 20px;
  margin-bottom: 40px !important;
}

.el-progress__text {
  white-space: pre-wrap !important;
  padding-top: 10px;
}

.amazingViz {
  width: 100%;
  height: inherit;
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

<style lang="scss">
$size: 1.4em;
$dotCount: 10;
$animationTime: 2.5s;

.peeek-loading {
  // background-color: #38d368;
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  z-index: 999;
}
.peeek-loading ul {
  position: absolute;
  list-style: none;
  left: calc(50% - 0.7em);
  top: calc(50% - 4.2em);
  display: inline-block;
  text-indent: $size * 2;
}
.peeek-loading ul li:after,
.peeek-loading ul:after {
  width: $size;
  height: $size;
  background-color: rgb(120, 255, 226);
  border: solid rgba(212, 212, 212, 0.5);
  border-radius: 100%;
  content: "";
  display: block;
}

.peeek-loading ul:after {
  position: absolute;
  top: $size * 2;
}
.peeek-loading li {
  position: absolute;
  padding-bottom: $size * 4;
  top: 0;
  left: 0;
}

// Creating Circle and Animation Delay
@for $i from 1 through 10 {
  .peeek-loading li:nth-child(#{$i}) {
    $deg: ($i - 1) * (360deg / $dotCount);
    transform: rotate($deg);
    animation-delay: $animationTime * $i/$dotCount/2;
  }
  .peeek-loading li:nth-child(#{$i}):after {
    animation-delay: $animationTime * $i/$dotCount/2;
  }
}

// Animations
.peeek-loading li {
  animation: dotAnimation $animationTime infinite;
}
@keyframes dotAnimation {
  0%,
  55%,
  100% {
    padding: 0 0 $size * 4 0;
  }
  5%,
  50% {
    padding: $size * 2 0;
  }
}

.peeek-loading li:after {
  animation: dotAnimationTwo $animationTime infinite;
}
@-webkit-keyframes dotAnimationTwo {
  0%,
  55%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  5%,
  50% {
    opacity: 0.5;
    transform: scale(0.5);
  }
}
</style>
    