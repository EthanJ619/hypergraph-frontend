<template>
  <div>
    <pdf
      v-for="i in numPages"
      :key="i"
      :page="i"
      :src="src"
      style="width: 100%"
    >
    </pdf>
  </div>
</template>
  
<script>
import pdf from "vue-pdf-signature";

export default {
  name: "intro",

  components: { pdf },
  data() {
    return {
      pageCount: 0, //当前页
      src: "/static/introdoc.pdf", // pdf文件地址
      // src: "/software6/static/introdoc.pdf", // 山东部署
      numPages: 0, //总页数
    };
  },
  methods: {
    loadPdfHandler() {
      pdf
        .createLoadingTask(this.src)
        .promise.then((pdf) => {
          this.numPages = pdf.numPages;
        })
        .catch((err) => {
          console.error("pdf loading failed", err);
        });
    },
  },
  mounted() {
    this.loadPdfHandler();
  },
};
</script>
  