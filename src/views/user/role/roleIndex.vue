<template>
<div>
  <div>
    <label>
      角色名称：<el-tag>{{ data.name || '未选中' }}</el-tag>
    </label>
  </div>
  <div class="role">
    <label>
      角色图标：<img :src="data.icon" />
    </label>
  </div>
  <div class="role" v-if="data.id != 1 && data.id != 7">
    <label>是否默认：</label>
    <el-switch v-model="data.default" active-color="#13ce66" inactive-color="#ff4949" />
  </div>
  <div class="role" >
    <label>显示组名：</label>
    <el-switch v-model="data.isDisplay" active-color="#13ce66" inactive-color="#ff4949" />
  </div>
</div>
</template>

<script>
export default {
  name: "roleIndex",
  props: {
    data: {
      type: Object,
    }
  }
}
</script>

<style scoped>
.role{
  margin-top: 20px;
}
</style>
