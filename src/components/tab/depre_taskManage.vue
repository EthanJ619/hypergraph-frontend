<template>
  <div>
    <!--==========================     头部按钮     ==============================================================-->
    <div id="top_buttons">
      <div id="load_state">
        <span>任务类型：</span>
        <el-select v-model="taskType" placeholder="请选择">
          <el-option
            v-for="item in options_build"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <el-button @click="taskType = ''">清除</el-button>
    </div>

    <!--===============================    表格     ==============================================================-->
    <div id="table">
      <el-table
        :data="
          taskData.filter(
            (data) => !taskType || data.taskType.includes(taskType)
          )
        "
        style="wdith: 100%"
        stripe
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column
          label="ID"
          prop="taskId"
          width="50px"
        ></el-table-column>
        <el-table-column label="任务名" prop="taskName" align="center">
        </el-table-column>
        <el-table-column label="任务类型" prop="taskType" align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.taskType }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数据表" prop="tableName" align="center">
        </el-table-column>
        <el-table-column label="创建者" prop="creater" align="center">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header">
            <span>操作</span>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="quickLink('HGconstruct', scope.row)"
              >展示</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.taskName, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      class="pagination"
      layout="prev,pager,next"
      :current-page="currentPage"
      @current-change="changePage"
      :total="pageCount"
    >
    </el-pagination>
  </div>
</template>
  
  
  <script>
import * as api from "@/utils/api";
import moment from "moment";
import storage from "@/utils/storage";
import { Pie } from "@antv/g2plot";
export default {
  data() {
    return {
      activeName: "first",
      options_build: [
        //上传选项
        {
          value: "跨时空超图",
          label: "跨时空超图",
        },
        {
          value: "时间超图",
          label: "时间超图",
        },
        {
          value: "空间超图",
          label: "空间超图",
        },
      ],
      taskType: "",
      taskData: [],
      search: "",

      pageCount: 0,
      currentPage: 1,
    };
  },

  methods: {
    quickLink(route, taskInfo) {
      this.$router.push({
        name: route,
        params: { source: "taskManage", taskInfo: taskInfo },
      });
    },
    handleDelete(task_name, index) {
      this.$confirm(
        "此操作将从删除该任务信息以及历史运行结果，是否确认要删除？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        api
          .deleteRequest("/task/delete/" + task_name)
          .then((res) => {
            if (res.code === "200") this.taskData.splice(index, 1);
          })
          .catch((e) => {
            alert(e);
          });
      });
    },

    getTask() {
      api.getRequest("/tasks/" + 1).then((res) => {
        this.pageCount = res.pageCount * 10;
        this.taskData = res.data.map((item) => ({
          ...item,
          iseditor: false,
        }));
        /* 修改时间格式 */
        for (let i = 0; i < this.taskData.length; i++)
          this.taskData[i].createTime = moment(
            this.taskData[i].createTime
          ).format("YYYY-MM-DD hh:mm:ss");
      });
    },
    changePage(currPage) {
      this.currentPage = currPage;
      api.getRequest("/tasks/" + currPage).then((res) => {
        this.taskData = res.data.map((item) => ({
          ...item,
          iseditor: false,
        }));
        /* 修改时间格式 */
        for (let i = 0; i < this.taskData.length; i++)
          this.taskData[i].createTime = moment(
            this.taskData[i].createTime
          ).format("YYYY-MM-DD hh:mm:ss");
      });
    },
  },
  created() {
    //存入sessionstorage
    this.getTask();
  },
};
</script>
  
  
<style scoped>
#top_buttons > * {
  display: inline-block;
}
#load_state {
  margin-right: 40px;
}
#data_source {
  margin-right: 20px;
}
#top_right_buttons {
  float: right;
  margin-right: 100px;
}
#table {
  margin-top: 10px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>