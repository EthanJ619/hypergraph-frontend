export default {
  namespaced: true,
  state() {
    return {
      stepActive: 0,
      taskName: "",
      principal: "",
      participants: "",
      disease: "",
      remark: "",
      tableId: "",
      tableName: "",
      use_features: [],
      known_features: [],
      target_feature: [],
      algorithm: '',
      kmeans: {
        k_clusters: 1,
        random_state: null,
      },
      knn: {
        k_neighbors: 5,
        is_prob: true,
      },
      l1_reg: {
        gamma: 1,
        k_neighbors: 3,
      },
      factorHg: [],
      result: [],
    };
  },
  getters: {},
  actions: {},
  mutations: {
    ChangeStep(state, step) {
      state.stepActive = step;
    },
    ChangeTaskInfo(state, newInfo) {
      state = Object.assign(state, newInfo);
    },
    kmeans_update(state, newParams) {
      state.kmeans = Object.assign(state.kmeans, newParams);
    },
    knn_update(state, newParams) {
      state.knn = Object.assign(state.knn, newParams);
    },
    l1_reg_update(state, newParams) {
      state.l1_reg = Object.assign(state.l1_reg, newParams)
    }
  },
};
