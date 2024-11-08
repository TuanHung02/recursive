<!-- App.vue -->
<template>
  <!-- <div>
    <h1>Quản lý Cây Phòng Ban</h1>
    <TreeItem v-for="item in treeData" :key="item.id" :item="item" />
  </div> -->
  <div style="display: flex; gap: 31px; justify-content: center;">
    <ParentTree />
    <ParentTree />
  </div>
</template>

<script setup>
// import TreeItem from './components/TreeItem.vue';
import ParentTree from './components/ParentTree.vue';


</script>

<style scoped>
h1 {
  text-align: center;
}
</style>
