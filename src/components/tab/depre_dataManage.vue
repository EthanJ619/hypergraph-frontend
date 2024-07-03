<template>
  <div>
    <div class="peeek-loading" v-if="isTableUploading">
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

    <!--==========================     头部按钮     ==============================================================-->
    <div id="top_buttons">
      <div id="data_source">
        <span>所属疾病：</span>
        <el-select v-model="filterValue" placeholder="请选择">
          <el-option
            v-for="item in options_disease"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button @click="filterValue = ''">清除</el-button>

      <div id="top_right_buttons">
        <el-button type="primary" @click="tableUploadVisible = true"
          >导入数据表</el-button
        >
      </div>
    </div>

    <!--===============================    表格     ==============================================================-->
    <div id="table">
      <el-table
        :data="
          tableData.filter(
            (data) => !filterValue || data.disease.includes(filterValue)
          )
        "
        style="width: 100%"
        stripe
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column label="数据表" prop="tableName">
          <template slot-scope="scope">
            <el-link @click="showTableDesc(scope.row.tableName)">{{
              scope.row.tableName
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="所属疾病" prop="disease" align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.disease }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件大小" prop="tableSize" align="center">
        </el-table-column>
        <el-table-column label="创建人" prop="uploader" align="center">
        </el-table-column>
        <el-table-column label="上传时间" prop="uploadTime" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.uploadTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header">
            <span>操作</span>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.tableName, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="数据集描述" :visible.sync="tableDescVisible">
        <p>
          {{
            selectedTableDesc === "" || selectedTableDesc === null
              ? "暂无数据集描述"
              : selectedTableDesc
          }}
        </p>
      </el-dialog>
    </div>

    <!--===============================     导入数据表单   ===================================================================-->
    <el-dialog
      title="导入数据表"
      :visible.sync="tableUploadVisible"
      width="40%"
    >
      <!--          选择数据表单       -->
      <el-form
        :label-position="labelPosition"
        :model="dialogForm"
        class="tableForm"
        :rules="dialogForm.rules"
        ref="dialogForm"
      >
        <el-form-item label="数据所属疾病" prop="disease">
          <el-radio-group v-model="dialogForm.disease" id="diseaseSelect">
            <el-radio
              v-for="(disease, index) in options_disease"
              :key="index"
              :label="disease.label"
              border
              size="medium"
              >{{ disease.label }}</el-radio
            ></el-radio-group
          >
        </el-form-item>

        <el-divider />

        <el-form-item label="选择本地数据表" prop="tableFile">
          <el-upload
            class="upload"
            ref="upload"
            action="/111"
            :file-list="dialogForm.tableFile"
            :auto-upload="false"
            accept=".csv"
            :limit="1"
            :on-exceed="fileExceed"
            :before-upload="beforeUpload"
          >
            <el-button slot="trigger" size="small" type="success"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip" style="color: red">
              暂时仅支持.csv文件
            </div>
          </el-upload>
        </el-form-item>

        <el-divider />

        <el-form-item label="数据表描述" style="height: 100px" prop="des">
          <el-input
            v-model="dialogForm.des"
            placeholder="请输入数据表描述"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tableUploadVisible = false" type="info"
          >取消</el-button
        >
        <el-button type="primary" @click="resetForm">重置</el-button>
        <el-button type="warning" @click="submitTable">提交</el-button>
      </div>
    </el-dialog>
    <!--======================   添加字段   =======================================================-->
    <el-dialog
      title="导入数据表字段信息"
      :visible.sync="fieldUploadVisible"
      width="40%"
    >
      <el-form class="fieldForm" label-width="auto">
        <el-form-item
          v-for="(name, index) in Object.keys(fieldMap)"
          :key="index"
          :label="name"
        >
          <el-select
            v-model="fieldMap[name]"
            placeholder="请选择特征类型"
            @input="
              (e) => {
                test(e, name);
              }
            "
          >
            <el-option
              label="人口学特征"
              value="people"
              key="people"
            ></el-option>
            <el-option
              label="社会学特征"
              value="social"
              key="social"
            ></el-option>
            <el-option
              label="生理学特征"
              value="medical"
              key="medical"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fieldUploadVisible = false" type="info"
          >取消</el-button
        >
        <el-button type="warning" @click="fieldUpload">完成上传</el-button>
      </div>
    </el-dialog>
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
export default {
  data() {
    return {
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
      dialogForm: {
        disease: "",
        des: "",
        tableFile: [],
        rules: {
          disease: { required: true, message: "请选择疾病", trigger: "change" },
          des: {
            max: 200,
            message: "长度不能超过200字符",
            trigger: "blur",
          },
        },
      },

      fieldMap: {},
      pageCount: 0,
      currentPage: 1,
      tableName: "",
      tableData: [],
      selectedTableDesc: null,
      tableDescVisible: false,
      tableUploadVisible: false,
      fieldUploadVisible: false,
      isTableUploading: false,
      filterValue: "",
      labelPosition: "top",
    };
  },

  methods: {
    showTableDesc(tableName) {
      api.getRequest("/table/" + tableName).then((res) => {
        this.selectedTableDesc = res.tableDesc;
        this.tableDescVisible = true;
      });
    },
    handleDelete(table_name, index) {
      this.$confirm(
        "此操作将从数据库中移除该数据表文件，是否确认要删除？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          api
            .deleteRequest("/table/delete/" + table_name)
            .then((res) => {
              if (res.code === "200") this.tableData.splice(index, 1);
            })
            .catch((e) => {
              alert(e);
            });
        })
        .catch(() => {});
    },
    getData() {
      // this.updateData();
      // api.getRequest("/tables").then((res) => {
      //   if (res) {
      //     storage.set("allTableData", JSON.stringify(res.data));
      //     this.$store.commit("setAllTableData", storage.get("allTableData"));
      //     let tempList = JSON.parse(this.$store.getters.getAllTableData);
      //     for (let i = 0; i < tempList.length; i++) {
      //       const obj = {
      //         tableId: tempList[i].tableId,
      //         tableName: tempList[i].tableName,
      //         tableSize: tempList[i].tableSize,
      //         uploader: tempList[i].uploader,
      //         disease: tempList[i].disease,
      //         uploadTime: moment(tempList[i].uploadTime).format(
      //           "YYYY-MM-DD hh:mm:ss"
      //         ),
      //         tableDesc: tempList[i].tableDesc,
      //       };
      //       this.tableData.push(obj);
      //     }
      //   }
      // });
      api.getRequest("/tables/" + 1).then((res) => {
        this.pageCount = res.pageCount * 10;
        this.tableData = res.data.map((item) => ({
          ...item,
          iseditor: false,
        }));
        /* 修改时间格式 */
        for (let i = 0; i < this.tableData.length; i++)
          this.tableData[i].uploadTime = moment(
            this.tableData[i].uploadTime
          ).format("YYYY-MM-DD hh:mm:ss");
      });
    },
    changePage(currPage) {
      this.currentPage = currPage;
      api.getRequest("/tables/" + currPage).then((res) => {
        this.tableData = res.data.map((item) => ({
          ...item,
          iseditor: false,
        }));
        for (let i = 0; i < this.tableData.length; i++)
          this.tableData[i].uploadTime = moment(
            this.tableData[i].uploadTime
          ).format("YYYY-MM-DD hh:mm:ss");
      });
    },

    resetForm() {
      this.$refs["dialogForm"].resetFields();
    },
    fileExceed(file, fileList) {
      this.$message({
        message: "单次只能上传一个文件",
        type: "error",
      });
    },

    beforeUpload(file) {
      /* 表单验证 */
      this.$refs["dialogForm"].validate((isValid) => {
        if (!isValid) {
          return false;
        } else {
          /* 文件校验 */
          const isCSV =
            file.type === "text/csv" ||
            file.type === "application/vnd.ms-excel";
          const isWithinSize = file.size <= 50 * 1024 * 1024;

          if (!isCSV) {
            this.$message.error("上传文件仅支持 CSV 格式");
            return false;
          }
          if (!isWithinSize) {
            this.$message.error("上传文件大小不能超过 50MB");
            return false;
          }

          this.tableName = file.name.replaceAll(" ", "_"); //获取文件名
          const tableInfo = {
            tableName: this.tableName,
            disease: this.dialogForm.disease,
            tableSize: "",
            uploader: "EthanJ" /* TODO */,
            uploadTime: moment().format("YYYY-MM-DD[T]hh:mm:ss"),
            des: this.dialogForm.des,
          };
          const formData = new FormData();
          formData.append("data_table", file);
          debugger
          this.isTableUploading = true;
          /* 提交文件上传请求 */
          api
            .postRequest("/table/upload", formData)
            .then((res) => {
              if (res.code === "200") {
                /* 如果文件上传成功 */
                const fileSizeByte = file.size; //获取文件大小
                /* 换算文件大小单位 */
                if (fileSizeByte < 1024.0)
                  tableInfo.tableSize = fileSizeByte + "B";
                else if (
                  fileSizeByte >= 1024.0 &&
                  fileSizeByte < 1024.0 * 1024.0
                )
                  tableInfo.tableSize =
                    (fileSizeByte / 1024.0).toFixed(2) + "KB";
                else
                  tableInfo.tableSize =
                    (fileSizeByte / 1024.0 / 1024.0).toFixed(2) + "MB";

                /* 存储特征列 */
                for (const field of res.data) {
                  this.fieldMap[field] = "people"; //默认为人口学特征
                }

                /* 上传文件信息 */
                api.postRequest("/table/add_info", tableInfo).then(() => {
                  this.$refs["dialogForm"].resetFields();
                  this.tableUploadVisible = false;
                  tableInfo.uploadTime = moment(tableInfo.uploadTime).format(
                    "YYYY-MM-DD hh:mm:ss"
                  );
                  this.tableData.push(tableInfo);
                  console.log(this.fieldUploadVisible);
                  this.isTableUploading = false;
                  this.fieldUploadVisible = true;
                });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    },

    /* 这里upload组件的action路径无效(8080)，只是为了唤起beforeUpload函数 */
    submitTable() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          message: "请选择一个文件上传",
          type: "error",
        });
      } else if (this.$refs.upload.uploadFiles.length === 1) {
        this.$refs.upload.submit();
      }
    },

    fieldUpload() {
      let tableHeaders = [];
      console.log("compelete里的fieldMap.id", this.fieldMap.id);

      for (const key in this.fieldMap) {
        console.log("old", key, this.fieldMap[key]);
        if (Object.hasOwnProperty.call(this.fieldMap, key)) {
          console.log("new", key, this.fieldMap[key]);
          switch (this.fieldMap[key]) {
            case "people":
              tableHeaders.push({
                fieldName: key,
                isDemography: "1",
                isPhysiological: "0",
                isSociology: "0",
              });
              break;
            case "medical":
              tableHeaders.push({
                fieldName: key,
                isDemography: "0",
                isPhysiological: "1",
                isSociology: "0",
              });
              break;
            case "social":
              tableHeaders.push({
                fieldName: key,
                isDemography: "0",
                isPhysiological: "0",
                isSociology: "1",
              });
              break;
            default:
              break;
          }
        }
      }

      api
        .postRequest("/fieldManager/addField", {
          tableName: this.tableName,
          tableHeaders,
        })
        .then((res) => {
          this.fieldUploadVisible = false;
        });
    },
    test(e, index) {
      const obj = {
        ...this.fieldMap,
      };
      obj[index] = e;
      this.fieldMap = obj;
    },
  },
  created() {
    //存入sessionstorage
    this.getData();
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

#diseaseSelect {
  display: flex;
  flex-wrap: wrap;
}

#diseaseSelect > * {
  margin: 0.7em;
  margin-block: 0.5em;
  flex: auto;
  max-width: 150px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.fieldForm {
  height: 55vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: auto;
}

::v-deep .el-input__inner {
  height: 50px;
}
</style>
<style>
/* .tableForm .el-form-item__label {
  border-bottom: 2px solid #e6a23c;
  padding: 0 5px 0 5px !important;
  margin-bottom: 20px;
  font-weight: bold;
}

.fieldForm .el-form-item__label {
  padding: 5px;
  font-weight: bold;
} */
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
  z-index: 9999;
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