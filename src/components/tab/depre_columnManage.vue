<template>
  <div class="mainContainer">
    <!--==========================     头部按钮     ==============================================================-->
    <div></div>
    <!--===============================    表格     ==============================================================-->
    <div id="table">
      <el-table
        :data="columnData"
        style="width: 100%"
        :row-style="{ height: '33px', lineHeight: '10px', padding: '0px' }"
        :header-cell-style="{
          background: '#58AAFF',
          color: '#fff',
          height: '30px',
          textAlign: 'center',
        }"
        border
        resizable="false"
      >
        <el-table-column label="属性名" prop="fieldName" fixed>
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.fieldName"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{ scope.row.fieldName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性中文名" prop="fieldNameCh" width="110%">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.fieldNameCh"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.fieldNameCh
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属表名" prop="tableName">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.tableName"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{ scope.row.tableName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'所属表\n中文名'" prop="tableNameCh">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.tableNameCh"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.tableNameCh
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性描述" prop="fieldDesc">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.fieldDesc"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{ scope.row.fieldDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性类型" prop="fieldType">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.fieldType"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{ scope.row.fieldType }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="'是否\n人口学'" prop="isDemography">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.isDemography"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.isDemography
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'是否\n行为学'" prop="isSociology">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.isSociology"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.isSociology
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'是否\n生理学'" prop="isPhysiological">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.isPhysiological"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.isPhysiological
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'是否\n多疾病'" prop="isMutipleDiseases">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.isMutipleDiseases"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.isMutipleDiseases
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否包含空间信息" prop="isZooInformation">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.isZooInformation"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.isZooInformation
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="'是否为\n调查问卷'" prop="isQuestionnaire">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.isQuestionnaire"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.isQuestionnaire
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否包含时间信息" prop="isTimeInformation">
        </el-table-column>
        <el-table-column label="属性范围" prop="fieldRange">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.isTimeInformation"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.isTimeInformation
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属疾病" prop="diseaseType">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.diseaseType"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{
              scope.row.diseaseType
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime">
          <template slot-scope="scope">
            <input
              type="text"
              v-model="scope.row.createTime"
              v-show="scope.row.iseditor"
            />
            <span v-show="!scope.row.iseditor">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" width="180">
          <template slot="header">
            <span>操作</span>
          </template>
          <template slot-scope="scope">
            <el-button
              @click="handleDelete(scope.row, scope)"
              type="danger"
              size="small"
              plain
              >删除</el-button
            >
            <el-button
              type="primary"
              @click="handleEdit(scope.row, scope)"
              size="small"
              plain
              v-show="!scope.row.iseditor"
              >编辑</el-button
            >
            <el-button
              type="primary"
              @click="handleSave(scope.row, scope)"
              size="small"
              plain
              v-show="scope.row.iseditor"
              >保存</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        background
        class="pagination"
        layout="prev, pager, next"
        :current-page="currentPage"
        @current-change="changePage"
        :total="pageCount"
      >
      </el-pagination>
    </div>
  </div>
</template>


<script>
import { postRequest, getRequest } from "@/utils/api";

export default {
  data() {
    return {
      value1: "",

      value2: "",
      currentPage: 1,
      pageCount: 0,
      columnData: [],

      search: "",
    };
  },

  methods: {
    handleEdit(row, index) {
      row.iseditor = true;
    },
    handleSave(row, index) {
      postRequest("fieldManager/updateField", row).then((resp) => {
        if (resp.code == "200") {
          row.iseditor = false;
          this.$message({
            message: "修改成功",
            type: "success",
          });
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    handleDelete(row, index) {
      var that = this;
      postRequest("fieldManager/delField", row).then((resp) => {
        if (resp.code == "200") {
          // const tempList=[...that.columnData]
          that.columnData.splice(index.$index, 1);
          //   that.columnData=tempList
          this.$message({
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    changePage(val) {
      this.currentPage = val;
      getRequest("/fieldManager/fields?pageNum=" + val).then((resp) => {
        const newArray = resp.data.map((item) => ({
          ...item,
          iseditor: false,
        }));
        this.columnData = newArray;
      });
    },
    clearFilter() {
      this.value1 = "";
      this.value2 = "";
    },
    getColumn() {
      getRequest("/fieldManager/fields?pageNum=" + 1).then((resp) => {
        this.pageCount = resp.pageCount * 10;
        const newArray = resp.data.map((item) => ({
          ...item,
          iseditor: false,
        }));
        this.columnData = newArray;
      });
    },
  },
  created() {
    this.getColumn();
  },
};
</script>


<style scoped >
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
  color: rgb(114, 175, 245);
}
#table {
  margin-top: 10px;
}
::v-deep .cell {
  white-space: pre-line !important;
}
::v-deep .el-dialog__header {
  background-color: rgb(114, 175, 245);
}
::v-deep .el-dialog__title {
  font-size: 17px;
  color: white;
  font-weight: 400;
}
.feature {
  display: inline-block;
  width: 200px;
}
.el-button {
  size: small;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>