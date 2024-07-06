<template>
  <div v-loading="loading" element-loading-text="拼命运算中">
    <el-container>
      <el-tabs id="modelList" v-model="model" tab-position="left">
        <!-- tab-pane的name值必须与vuex里的算法名字一一对应 -->
        <el-tab-pane label="K-Means" name="kmeans">
          <div class="titleBox">K-Means</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              K-Means 是一种无监督聚类算法，其目标是将数据集分成 k
              个簇，使得同一簇内的点尽可能接近，而不同簇的点尽可能远离。
              <br />
              通过对特征矩阵进行 K-Means 聚类，分成 k
              个簇，每个簇对应一个超边，簇内的节点都连接到这个超边，并构建超图的邻接矩阵，表示节点和超边之间的连接关系。
            </p>
          </div>
          <div class="paramBox">
            <el-form
              :model="kmeans_params"
              label-position="top"
              ref="kmeans_ref"
            >
              <el-form-item prop="k_clusters">
                <template slot="label">
                  <span class="paramTitle">k_clusters（聚簇数）</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K-Means聚类算法中簇的数量，必须为正整数值，且小于等于参与运算的特征数量
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="kmeans_params.k_clusters"></el-input>
                <span class="valueRange">(取值范围为 ≥ 1 的正整数)</span>
              </el-form-item>

              <el-form-item prop="random_state">
                <template slot="label">
                  <span class="paramTitle">random_state（随机种子）</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      随机种子，用于确保聚类结果的可重复性。<br />如果为空，则每次运行可能会产生不同的聚类结果。
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="kmeans_params.random_state"></el-input>
                <span class="valueRange">(取值范围为整数，默认为空)</span>
              </el-form-item>
            </el-form>
            <div class="buttonBox">
              <el-button round @click="back()">上一步</el-button>
              <el-button round @click="resetForm('kmeans_ref')"
                >恢复默认</el-button
              >
              <el-button
                type="primary"
                round
                @click="startTask('/graph/factorHg?algorithm=', 'kmeans')"
                >开始任务</el-button
              >
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="KNN" name="knn">
          <div class="titleBox">KNN</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              K 最近邻（K-Nearest
              Neighbors，KNN）是一种分类和回归算法，用于根据输入样本的最近 k
              个邻居来预测其所属类别或值。
              <br />
              通过计算特征矩阵中所有节点的距离矩阵。对每个节点，找到其最近的 k
              个邻居。每个节点及其最近邻居形成一个超边。
            </p>
          </div>
          <div class="paramBox">
            <el-form :model="knn_params" label-position="top" ref="knn_ref">
              <el-form-item prop="k_neighbors">
                <template slot="label">
                  <span class="paramTitle">k_neighbors（近邻数）</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      每个节点的邻居数量，必须为正整数值，且小于参与运算的特征数量
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="knn_params.k_neighbors"></el-input>
                <span class="valueRange">(取值范围为 ≥ 1 的正整数)</span>
              </el-form-item>

              <el-form-item prop="is_prob">
                <template slot="label">
                  <span class="paramTitle">is_prob（基于距离）</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      是否使用基于距离的权重。<br />如果为
                      true，则使用基于距离的高斯核函数计算结果作为权重；<br />如果为
                      false，则所有边的权重为1。
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-select v-model.trim="knn_params.is_prob">
                  <el-option label="true" value="true"></el-option>
                  <el-option label="false" value="false"></el-option>
                </el-select>
                <span class="valueRange">(取值范围为布尔型，默认为true)</span>
              </el-form-item>
            </el-form>
            <div class="buttonBox">
              <el-button round @click="back()">上一步</el-button>
              <el-button round @click="resetForm('knn_ref')"
                >恢复默认</el-button
              >
              <el-button
                type="primary"
                round
                @click="startTask('/graph/factorHg?algorithm=', 'knn')"
                >开始任务</el-button
              >
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="L1-Regularization" name="l1_reg">
          <div class="titleBox">L1-Regularization</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              L1范数正则化利用稀疏表示的方法，将每一个节点表示为其最近邻居的线性组合，并使用
              L1 范数正则化来保证表示的稀疏性。<br />算法利用特征重构来确定顶点之间的关系。通过计算输入节点之间的距离矩阵，将每个节点表示为其邻居节点的稀疏加权组合，并通过优化问题最小化重构误差和L1范数来确定权重，从而生成一个稀疏的超图邻接矩阵。
            </p>
          </div>
          <div class="paramBox">
            <el-form :model="l1_params" label-position="top" ref="l1_ref">
              <el-form-item prop="gamma">
                <template slot="label">
                  <span class="paramTitle">gamma（稀疏度）</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      正则化参数，用于控制稀疏性。<br />较大的 γ
                      值会导致更稀疏的解，因为它增加了 L1 范数的惩罚力度。<br />取值范围一般在0~5，过小可能导致过拟合，过大可能导致欠拟合，负值没有实际意义。
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="l1_params.gamma"></el-input>
                <span class="valueRange">(取值范围为 ≥ 0 的实数)</span>
              </el-form-item>

              <el-form-item prop="k_neighbors">
                <template slot="label">
                  <span class="paramTitle">k_neighbors（近邻数）</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      每个节点的最近邻居数量，决定了每个节点的线性组合的邻居个数。<br />必须为正整数值，且小于参与运算的特征数量
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="l1_params.k_neighbors"></el-input>
                <span class="valueRange">(取值范围为 ≥ 1 的正整数)</span>
              </el-form-item>
            </el-form>
            <div class="buttonBox">
              <el-button round @click="back()">上一步</el-button>
              <el-button round @click="resetForm('l1_ref')">恢复默认</el-button>
              <el-button
                type="primary"
                round
                @click="startTask('/graph/factorHg?algorithm=', 'l1_reg')"
                >开始任务</el-button
              >
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import { postRequest } from "@/utils/requestApi";
import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
export default {
  name: "AlgorithmSelect",
  mixins: [resetForm, vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "factorHg",
    },
  },
  computed: {},
  data() {
    return {
      model: "kmeans",
      loading: false,
      kmeans_params: {
        k_clusters: 1,
        random_state: null,
      },
      knn_params: {
        k_neighbors: 3,
        is_prob: true,
      },
      l1_params: {
        gamma: 1,
        k_neighbors: 3,
      },
      res: "",
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.kmeans_params = this.m_kmeans;
      this.knn_params = this.m_knn;
      /* if (this.moduleName === "disFactor") {
        this.model = "SF_DRMB";
      } else {
        this.model = "IAMB";
      } */
    },

    back() {
      this.m_changeStep(this.m_stepActive - 1);
    },

    startTask(url, algor) {
      this.loading = true;
      var payload;
      if (algor == "kmeans") {
        this.m_kmeans_update(this.kmeans_params);
        payload = {
          tablename: this.m_tableName,
          tableid: this.m_tableId,
          taskname: this.m_taskName,
          algorparams: this.m_kmeans,
        };
      } else if (algor == "knn") {
        this.m_knn_update(this.knn_params);
        payload = {
          tablename: this.m_tableName,
          tableid: this.m_tableId,
          taskname: this.m_taskName,
          algorparams: this.m_knn,
        };
      } else if (algor == "l1_reg") {
        this.m_l1_reg_update(this.l1_params);
        payload = {
          tablename: this.m_tableName,
          tableid: this.m_tableId,
          taskname: this.m_taskName,
          algorparams: this.m_l1_reg,
        };
      }

      postRequest(url + algor, payload)
        .then((res) => {
          console.log(res.data);
          this.m_changeTaskInfo({ algorithm: this.model, factorHg: res.data });
          this.loading = false;
          this.m_changeStep(this.m_stepActive + 1);
        })
        .catch((err) => {
          this.loading = false;
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
#modelList {
  height: 60vh;
  width: 100%;
  margin-bottom: 5vh;
}

.titleBox {
  margin: 10px auto 10px auto;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.introBox {
  background-color: #e8f3ff;
  height: 10vh;
  width: 100%;
  overflow: auto;
}

.introBox p {
  margin-left: 15px;
}
.introBox p:first-child {
  font-size: 18px;
  font-weight: 600;
}
.introBox p:nth-child(2) {
  margin-left: 2em;
}

.paramBox .el-form {
  margin-top: 2vh;
  margin-left: 60vh;
}
.paramBox .el-form .el-input {
  width: 25vh;
  margin-top: -50px;
}

.paramTitle {
  font-size: 20px;
  font-weight: 600;
}

.valueRange {
  color: gray;
  margin-left: 10px;
}

.el-icon-warning-outline {
  margin-left: 10px;
  font-size: 20px;
}
.el-icon-warning-outline:hover {
  color: #368ce7;
}

.buttonBox {
  width: 35vh;
  margin-top: 70px;
  margin-right: auto;
  margin-left: auto;
}
</style>
