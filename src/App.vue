<!-- App.vue -->
<template>
  <!-- <div>
    <h1>Quản lý Cây Phòng Ban</h1>
    <TreeItem v-for="item in treeData" :key="item.id" :item="item" />
  </div> -->
  <div style="margin-top: 50px;">
    <h1>Tree node</h1>
    <ParentTree />
  </div>
</template>

<script setup>
import { reactive, provide } from 'vue'
// import TreeItem from './components/TreeItem.vue';
import ParentTree from './components/ParentTree.vue';

const treeData = reactive([
  { id: '0', name: 'Phòng ban 1', level: 1, code: 'DPM0-0', children: [] },
  { id: '1', name: 'Phòng ban 2', level: 1, code: 'DPM0-1', children: [] },
])
console.log(treeData);

// Hàm đệ quy để tìm một mục theo ID
function findNodeById(id, nodes) {
  for (let node of nodes) {
    if (node.id === id) return node
    if (node.children.length) {
      const found = findNodeById(id, node.children)
      if (found) return found
    }
  }
  return null
}

// Thêm một mục con mới
function addNode(parentId, newNode) {
  const parent = findNodeById(parentId, treeData)
  if (parent) parent.children.push(newNode)
}

// Xóa một mục
function deleteNode(id, nodes = treeData) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return
    }
    if (nodes[i].children.length) {
      deleteNode(id, nodes[i].children)
    }
  }
}

// Cập nhật một mục
function updateNode(id, newName, newCode) {
  const node = findNodeById(id, treeData)
  if (node) {
    node.name = newName
    node.code = newCode
  }
}

// Tăng cấp (level) của một mục
function increaseLevel(id) {
  const node = findNodeById(id, treeData)
  if (node) node.level += 1
}

function moveToTopLevel(index) {
  const findAndPromote = (node) => {
    // Kiểm tra nếu node hiện tại có con
    if (node.children.length > 0) {
      // Tìm kiếm trong các con
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i] === index) {
          // Nếu tìm thấy, lấy node `kien`
          const childNode = node.children[i];
          // Xóa `kien` khỏi danh sách con của `hung`
          node.children.splice(i, 1);
          // Đưa `kien` vào danh sách chính (mang cấp độ bằng `hung`)
          childNode.level -= 1; // Thay đổi cấp độ
          treeData.push(childNode); // Thêm vào danh sách chính
          return true; // Kết thúc tìm kiếm
        }
        // Gọi đệ quy cho các con
        if (findAndPromote(node.children[i])) {
          return true; // Nếu tìm thấy trong con, kết thúc tìm kiếm
        }
      }
    }
    return false; // Nếu không tìm thấy
  };

  // Gọi hàm tìm kiếm từ gốc của cây
  treeData.forEach(findAndPromote);

}

// Giảm cấp (level) của một mục
// function decreaseLevel(id) {
//   const node = findNodeById(id, treeData)
//   if (node && node.level > 1) node.level -= 1
// }

// Cung cấp các hàm để các component con sử dụng
provide('addNode', addNode)
provide('deleteNode', deleteNode)
provide('updateNode', updateNode)
provide('increaseLevel', increaseLevel)
// provide('decreaseLevel', decreaseLevel)
provide('decreaseLevel', moveToTopLevel)

</script>

<style scoped>
h1 {
  text-align: center;
}
</style>
