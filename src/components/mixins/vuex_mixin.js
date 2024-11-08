import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState({ m_dataList: "dataList" }),
    ...mapGetters({ m_dataDisList: "dataDisList" }),
    m_stepActive() {
      return this.$store.state[this.moduleName].stepActive;
    },
    m_taskName() {
      return this.$store.state[this.moduleName].taskName;
    },
    m_remark(){
      return this.$store.state[this.moduleName].remark;
    },
    m_principal() {
      return this.$store.state[this.moduleName].principal;
    },
    m_participants() {
      return this.$store.state[this.moduleName].participants;
    },
    m_disease() {
      return this.$store.state[this.moduleName].disease;
    },
    m_tableId() {
      return this.$store.state[this.moduleName].tableId;
    },
    m_tableName() {
      return this.$store.state[this.moduleName].tableName;
    },
    m_use_features() {
      return this.$store.state[this.moduleName].use_features;
    },
    m_known_features() {
      return this.$store.state[this.moduleName].known_features;
    },
    m_target_feature() {
      return this.$store.state[this.moduleName].target_feature;
    },
    m_algorithm() {
      return this.$store.state[this.moduleName].algorithm;
    },
    m_kmeans() {
      return this.$store.state[this.moduleName].kmeans;
    },
    m_knn() {
      return this.$store.state[this.moduleName].knn;
    },
    m_l1_reg(){
      return this.$store.state[this.moduleName].l1_reg;
    },
    m_factorHg(){
      return this.$store.state[this.moduleName].factorHg;
    },
    m_result() {
      return this.$store.state[this.moduleName].result;
    },
  },
  methods: {
    m_changeStep(newStep) {
      this.$store.commit(`${this.moduleName}/ChangeStep`, newStep);
    },
    m_changeTaskInfo(newValue) {
      this.$store.commit(`${this.moduleName}/ChangeTaskInfo`, newValue);
    },
    m_kmeans_update(newParams) {
      this.$store.commit(`${this.moduleName}/kmeans_update`, newParams);
    },
    m_knn_update(newParams) {
      this.$store.commit(`${this.moduleName}/knn_update`, newParams);
    },
    m_l1_reg_update(newParams) {
      this.$store.commit(`${this.moduleName}/l1_reg_update`, newParams);
    },
  },
};
