<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {setLocal} from "@/util/store";

export default {
  name: "app",
  data() {
    return {};
  },
  created() {
    let height = document.documentElement.clientHeight - 200
    setLocal('height', height)
  },
  methods: {},
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
