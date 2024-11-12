<template>
  <div style="display: flex; gap: 31px; justify-content: center;">

    <div class="wrap">
      <draggable v-model="listData1" group="departments" :animation="300" itemKey="id">
        <template #item="{ element: department }">
          <TheNode :node="department" :key="department.id" />
        </template>
      </draggable>
    </div>


    <div class="container">
      <div class="back-white"></div>
      <div class="back-white-v2"></div>
      <InputModel :show="modalVisible" :title="modalTitle" @confirm="handleModalConfirm" @close="handleModalClose" />
      <draggable v-model="treeData" group="departments" :animation="300" itemKey="id">
        <template #item="{ element: department }">
          <TreeNode :node="department" :key="department.id" @update="handleUpdateNode" />
        </template>
      </draggable>
    </div>

  </div>
</template>

<script setup>
import TheNode from './components/TheNode.vue';
import TreeNode from './components/TreeNode.vue';
import InputModel from './components/InputModel.vue';
import { onEvent } from './eventBus';
import { ListTreeData1 } from '@/data';
import { dataList } from '@/data';
import draggable from 'vuedraggable';
import { ref } from 'vue';

const treeData = ref([{ children: dataList }]);
const listData1 = ref(ListTreeData1);
const modalVisible = ref(false);
const modalTitle = ref('');
const modalType = ref('');
const targetNode = ref(null)

const openModal = (title, { parentNode = null, currentNode = null }) => {
  modalTitle.value = title;
  modalVisible.value = true;
  modalType.value = parentNode ? 'add' : 'edit';
  targetNode.value = parentNode || currentNode;
};

const handleModalConfirm = ({ name, code }) => {
  if (modalType.value === 'add') {
    const parentNode = targetNode.value;

    const newNode = {
      id: `${parentNode.id}-${parentNode.children.length}`,
      name,
      level: parentNode.level + 1,
      code,
      children: [],
    };

    parentNode.children.push(newNode);
    console.log('Đã thêm node mới:', newNode);
  }
  modalVisible.value = false; 
};


const handleModalClose = () => {
  modalVisible.value = false;
};

const handleUpdateNode = (updatedNode) => {
  // Hàm đệ quy để tìm node theo id và cập nhật node
  const updateNode = (node, updatedNode) => {
    if (node.id === updatedNode.id) {
      Object.assign(node, updatedNode);
      return true;
    }
    if (node.children) {
      for (let child of node.children) {
        if (updateNode(child, updatedNode)) {
          return true;
        }
      }
    }
    return false;
  }
  // Bắt đầu tìm kiếm từ gốc
  const rootNode = treeData.value[0];
  if (updateNode(rootNode, updatedNode)) {
    console.log("Node được cập nhật:", updatedNode);
  } else {
    console.log("Không tìm thấy node để cập nhật.");
  }
}


// Event handling
onEvent('addNode', (id) => {
  // Hàm đệ quy để tìm node theo id và thêm node con mới
  const addNode = (node, id) => {

    if (node.id === id) {
      openModal('Thêm mới phòng ban', { parentNode: node });

      return true;
    }
    if (node.children) {
      for (let child of node.children) {
        if (addNode(child, id)) {
          return true;
        }
      }
    }
    return false;
  }
  // Bắt đầu tìm kiếm từ gốc
  const rootNode = treeData.value[0];
  if (addNode(rootNode, id)) {
    console.log('Đã thêm node mới dưới:', id);
  } else {
    console.log('Không tìm thấy node để thêm.');
  }
});

onEvent('editNode', (id) => {
  // Hàm đệ quy để tìm node theo id và sửa node
  const editNode = (node, id) => {
    if (node.id === id) {
      // Giả định rằng chúng ta có một giao diện đầu vào để sửa tên node
      const newName = prompt("Nhập tên mới cho node:", node.name);
      if (newName) {
        node.name = newName;
      }
      return true;
    }
    if (node.children) {
      for (let child of node.children) {
        if (editNode(child, id)) {
          return true;
        }
      }
    }
    return false;
  }

  // Bắt đầu tìm kiếm từ gốc
  const rootNode = treeData.value[0];
  if (editNode(rootNode, id)) {
    console.log('Đã sửa node:', id);
  } else {
    console.log('Không tìm thấy node để sửa.');
  }
});

onEvent('deleteNode', (id) => {
  // Hàm đệ quy để tìm và xóa node theo id
  const deleteNode = (node, id) => {
    if (!node.children) return false;
    const index = node.children.findIndex(child => child.id === id);
    if (index !== -1) {
      node.children.splice(index, 1);
      return true;
    }
    // Tiếp tục tìm kiếm trong danh sách con
    for (let child of node.children) {
      if (deleteNode(child, id)) {
        return true;
      }
    }
    return false;
  }

  // Bắt đầu tìm kiếm từ gốc
  const rootNode = treeData.value[0];
  if (deleteNode(rootNode, id)) {
    console.log('Đã xóa node:', id);
  } else {
    console.log('Không tìm thấy node để xóa.');
  }
});

onEvent('increaseLevel', (id) => {
  const increaseLevel = (node, parent) => {
    if (node.children) {
      // Find the node and its parent
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.id === id) {
          // Remove the child from the current parent
          const [movedNode] = node.children.splice(i, 1);

          // Assign the same level as the parent
          movedNode.level = node.level;

          // Add the child node as a sibling to the parent
          parent.children.push(movedNode);
          return true;
        } else if (increaseLevel(child, node)) {
          return true;
        }
      }
    }
    return false;
  }

  const rootNode = treeData.value[0];
  if (increaseLevel(rootNode, rootNode)) {
    console.log("Node đã được nâng cấp lên cùng cấp với node cha:", id);
  } else {
    console.log("Không tìm thấy node để tăng cấp.");
  }
});
</script>

<style scoped>
h1 {
  text-align: center;
}
.wrap {
  border: 1px solid rgba(220, 220, 220, 1);
  border-radius: 10px;
  padding: 18px 28px 18px 0;
  max-width: 500px;
  min-width: 430px;
  height: fit-content;
}

.container {
  border: 1px solid rgba(220, 220, 220, 1);
  border-radius: 10px;
  padding: 0 28px 18px 0;
  max-width: 500px;
  min-width: 430px;
}

.back-white {
  width: 100%;
  height: 18px;
  z-index: 9999;
  background-color: white;
  border-radius: 10px;
}
</style>
