<template>
  <div id="document-viewer">
    <canvas ref="pdfCanvas"></canvas>
  </div>
</template>
  
<script>
export default {
  name: "intro",

  props: {
    docUrl: {
      type: String,
      required: true,
      default: "../src/assets/introdoc.pdf",
    },
  },
};
</script>
  
<style scoped>
iframe {
  border: none;
}
</style>
  