<template>
  <div>
    <div class="feaDiv">
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
        <el-button type="primary" @click="back">上一步</el-button>
        <el-divider />
        <el-radio-group
          class="tags"
          v-model="queryFea"
          @input="selectFeature()"
        >
          <el-radio
            v-for="tag in feaTags"
            :label="tag"
            :key="tag"
            border
          ></el-radio>
        </el-radio-group>
      </el-card>
      <el-dialog title="节点关联展示" :visible.sync="subgraphVisible">
        <div
          id="hg-plot-part"
          style="width: 80vh; height: 60vh; max-width: 90vh; max-height: 80vh"
        ></div>
      </el-dialog>
    </div>
    <div class="hgDiv">
      <el-card id="container" class="hg-card" style="flex: 4; margin: 2em">
        <div slot="header" class="clearfix" style="position: relative">
          <span class="line-style">▍</span><span>危险因素超图可视化</span>
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
        <div id="hg-plot" style="width: inherit; max-height: 100vh"></div>
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
          :max="2"
          disabled
        >
        </el-slider>
        <el-table
          :data="edgeTable"
          class="edge-table"
          style="margin-bottom: 50px; font-size: 2vh;overflow: auto"
          height="40vh"
          border
        >
          <el-table-column prop="id" label="索引" sortable></el-table-column>
          <el-table-column
            prop="degree"
            label="度数"
            sortable
          ></el-table-column>
          <el-table-column
            ><template slot="header" slot-scope="scope">
              <svg
                :class="{
                  'semi-transparent': allEdgesNotVisible,
                  'MuiSvgIcon-root': true,
                }"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style="padding-left: 3px"
                @click="toggleAllEdgesVisibility"
              >
                <path
                  d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"
                ></path>
              </svg>
            </template>
            <template slot-scope="scope">
              <svg
                :class="{
                  'full-transparent': !scope.row.visible,
                  'MuiSvgIcon-root': true,
                }"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                style="padding-left: 3px"
                @click="toggleEdgeVisibility(scope.row)"
              >
                <path
                  d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"
                ></path>
              </svg>
            </template>
          </el-table-column>
          <!-- <el-table-column
            ><template slot="header">
              <svg
                :class="{
                  'semi-transparent': allEdgesNotDelete,
                  'MuiSvgIcon-root': true,
                }"
                class="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
                @click="toggleAllEdgesDelete"
              >
                <path
                  d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                ></path>
              </svg>
            </template>
            <template slot-scope="scope"> </template>
          </el-table-column> -->
          <el-table-column
            ><template slot="header">
              <svg
                class="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                b
                <path
                  d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67 0 1.38-1.12 2.5-2.5 2.5zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5 0-.16-.08-.28-.14-.35-.41-.46-.63-1.05-.63-1.65 0-1.38 1.12-2.5 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"
                ></path>
                <circle cx="6.5" cy="11.5" r="1.5"></circle>
                <circle cx="9.5" cy="7.5" r="1.5"></circle>
                <circle cx="14.5" cy="7.5" r="1.5"></circle>
                <circle cx="17.5" cy="11.5" r="1.5"></circle>
              </svg>
            </template>
            <template slot-scope="scope">
              <el-color-picker
                v-model="scope.row.color"
                show-alpha
                :predefine="predefineColors"
                size="small"
                @change="handleEdgeColorChange(scope.row)"
              >
              </el-color-picker>
            </template>
          </el-table-column>
        </el-table>
        <el-card style="position: relative; height: 35vh">
          <div slot="header" class="clearfix">
            <span class="line-style">▍</span><span>新增特征</span>
          </div>
          <!-- <ul class="newTags" v-if="timeLineValue >= 1 && timeLineValue < 2">
            <li>smoking(1yrs)</li>
            <li>Carcinogenic exposure(1yrs)</li>
          </ul>
          <ul class="newTags" v-if="timeLineValue === 2">
            <li>smoking(2yrs)</li>
            <li>Chronic lung disease(2yrs)</li>
          </ul> -->
        </el-card>
      </div>
    </div>
  </div>
</template>
  
<script>
import { Hypergraph } from "@/lib/src/classes";
import { hgColorEdgePlot } from "@/lib/src/drawing/index";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import * as d3 from "d3";
import * as api from "@/utils/api";
import moment from "moment";

export default {
  name: "FactorHgVis",
  mixins: [vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "factorHg",
    },
  },
  data() {
    return {
      hgSvg: null,
      subSvg: null,

      canceled_edge: [],
      allEdgesNotVisible: false,

      defaultHgPreference: {
        sizeNodes: "default",
        colorEdges: "default",
        colorNodes: "default",
        windowWidth: window.innerWidth * 0.5,
        windowHeight: window.innerHeight,
      },
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577",
      ],
      graph: null,
      subgraph: null,
      subgraphVisible: false,
      activeTimeStamp: 1,
      timeLineValue: 0,
      timeLineMarks: { 0: "时间点1", 1: "时间点2", 2: "时间点3" },

      searchFea: "",
      queryFea: "",
    };
  },

  computed: {
    edgeTable() {
      return this.graph.getLinks().map((edge) => {
        return {
          id: edge.id,
          degree: edge.nodes.length,
          visible: edge.visible,
          color: null,
        };
      });
    },
    feaTags() {
      var feaTags = new Set();
      this.graph.getLinks().forEach((edge) => {
        edge.nodes.forEach((node) => {
          feaTags.add(node);
        });
      });
      return Array.from(feaTags);
    },
  },
  watch: {},
  methods: {
    searchFeature() {
      if (this.searchFea == null || this.searchFea == "") {
        this.queryFea = "";
        this.$message.error("特征不能为空！");
        return;
      }
      if (this.feaTags.indexOf(this.searchFea) === -1) {
        // if (this.feaTags.indexOf(this.searchFea) === -1) {
        this.queryFea = "";
        this.$message("数据集中不存在该特征！");
        return;
      }
      this.queryFea = this.searchFea;
      setTimeout(() => {
        this.drawNodeGraph();
      }, 50);
      this.$message({
        message: "特征查询成功！",
        type: "success",
      });
      this.subgraphVisible = true;
    },
    selectFeature() {
      this.subgraphVisible = true;
      setTimeout(() => {
        this.drawNodeGraph();
      }, 50);
    },
    drawNodeGraph() {
      this.generateSubgraph(this.queryFea); //生成查询节点相关联的超图
      d3.select("#hg-plot-part").selectAll("*").remove();
      this.subSvg = this.drawHg(
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
      this.subSvg
        .selectAll(`g.node[node-id='${this.queryFea}'] *`)
        .style("fill", "red");
      this.hgEventBind(this.subSvg);
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
      this.subgraph = new Hypergraph(
        subgraph.links,
        subgraph.nodes,
        subgraph.nodelinks
      );
    },
    handleTimeLineChange() {
      if (this.timeLineValue === 0) {
        d3.select("#hg-plot").selectAll("*").remove();
        this.hgSvg = this.drawHg(this.graph, this.defaultHgPreference, "");

        this.hgEventBind(this.hgSvg);
        this.hgSvg.selectAll("g.node").on("click", (e) => {
          this.queryFea = e.id;
          setTimeout(() => {
            this.drawNodeGraph();
          }, 50);
          this.subgraphVisible = true;
        });
      } else if (this.timeLineValue === 1) {
        d3.select("#hg-plot").selectAll("*").remove();
        this.hgSvg = this.drawHg(this.timeGraph1, this.defaultHgPreference, "");
      } else if (this.timeLineValue === 2) {
        d3.select("#hg-plot").selectAll("*").remove();
        this.hgSvg = this.drawHg(this.timeGraph2, this.defaultHgPreference, "");
      }
    },
    hgEventBind(hg) {
      hg.selectAll("circle.node").on("mouseover", (e) => {
        hg.select(`g.node[node-id='${e.id}'] circle`)
          .style("stroke", "red")
          .style("stroke-width", "6px")
          .attr("r", 25)
          .attr("fill", "white");
      });
      hg.selectAll("circle.node").on("mouseout", (e) => {
        hg.select(`g.node[node-id='${e.id}'] circle`)
          .style("stroke", "#909399")
          .style("stroke-width", "3px")
          .attr("r", 20)
          .attr("fill", "#DfDfDf");
      });
      hg.selectAll(".link").on("mouseover", (e) => {
        hg.selectAll(`.link[link-id='${e[2].linkid}']`)
          .style("stroke", "red")
          .style("stroke-width", "12px");
      });
      hg.selectAll(".link").on("mouseout", (e) => {
        hg.selectAll(`.link[link-id='${e[2].linkid}']`)
          .style("stroke", this.getRandomColor())
          .style("stroke-width", "6px");
      });
    },
    drawHg(graph, preferences, id) {
      return hgColorEdgePlot(
        { graph: graph },
        { preferences: preferences },
        { idColorEdge: id }
      );
    },
    toggleAllEdgesVisibility() {
      this.allEdgesNotVisible = !this.allEdgesNotVisible;
      if (this.allEdgesNotVisible)
        this.hgSvg.selectAll(".link").style("opacity", 0.05);
      else this.hgSvg.selectAll(".link").style("opacity", 1);
      this.graph.links.forEach(
        (edge) => (edge.visible = !this.allEdgesNotVisible)
      );
    },
    toggleEdgeVisibility(edge) {
      const link = this.graph.links.find((link) => link.id === edge.id);
      if (link) link.visible = !edge.visible;

      if (link.visible) {
        this.allEdgesNotVisible = false;
        this.hgSvg.selectAll(`.link[link-id='${edge.id}']`).style("opacity", 1);
      } else {
        if (this.graph.links.every((item) => !item.visible))
          this.allEdgesNotVisible = true;
        this.hgSvg
          .selectAll(`.link[link-id='${edge.id}']`)
          .style("opacity", 0.05);
      }
    },
    handleEdgeColorChange(edge) {
      this.hgSvg
        .selectAll(`.link[link-id='${edge.id}']`)
        .style("stroke", edge.color);
    },
    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    back() {
      this.m_changeStep(this.m_stepActive - 1);
    },
    hgGuide() {
      this.$alert("这里放超图介绍，附图", "超图介绍", {
        confirmButtonText: "确定",
        callback: () => {},
      });
    },
  },
  created() {
    const temp = JSON.parse(this.m_factorHg);
    temp.edges.forEach((edge) => (edge.visible = true));
    this.graph = new Hypergraph(temp["edges"], temp["nodes"], []);
    console.log(this.graph);
  },
  mounted() {},
};
</script>
  
<style scoped>
.title {
  font-size: 26px;
  margin: 5px auto 40px auto;
  text-align: center;
  font-weight: bold;
}

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

.tags {
  display: flex !important;
  flex-wrap: wrap;
}

.tags > * {
  margin: 5px !important;
  max-width: 300px;
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

/*.highlightFea {
  background-color: #e6a23c !important;
}*/

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

.time-fea-card ::v-deep .el-card__body {
  min-height: 25vh;
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

.semi-transparent {
  opacity: 0.5;
}

.full-transparent {
  opacity: 0;
}

::v-deep #hg-plot .link,
::v-deep #hg-plot .node,
.edge-table svg {
  cursor: pointer;
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

.el-form-item > label {
  font-size: 16px;
  font-weight: bold;
}

.el-progress__text {
  white-space: pre-wrap !important;
  padding-top: 10px;
}

.amazingViz {
  width: 100%;
  height: inherit;
}
</style>