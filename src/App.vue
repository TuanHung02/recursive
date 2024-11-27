<template>
  <div style="display: flex; gap: 31px; justify-content: center;">

    <div class="wrap">
      <input v-model="searchQuery" placeholder="Tìm kiếm phòng ban" @input="filterDepartments" />
      <draggable v-model="listData1" group="departments" :animation="300" itemKey="id">
        <template #item="{ element: department }">
          <TreeNode :node="department" :key="department.id" />
        </template>
      </draggable>
    </div>


    <div class="container">
      <div class="back-white"></div>
      <div class="back-white-v2"></div>
      <InputModel :show="modalVisible" :title="modalTitle" @confirm="handleModalConfirm" @close="handleModalClose" />
      <draggable v-model="treeData" group="departments" :animation="300" itemKey="id" @change="handleDrop">
        <template #item="{ element: department }">
          <TreeNode :node="department" :key="department.id" @update="handleUpdateNode" :isLine="true" />
        </template>
      </draggable>
    </div>

  </div>
</template>

<script setup>
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
const searchQuery = ref("");

const openModal = (title, { parentNode = null, currentNode = null }) => {
  modalTitle.value = title;
  modalVisible.value = true;
  modalType.value = parentNode ? 'add' : 'edit';
  targetNode.value = parentNode || currentNode;
};

const filterDepartments = () => {
  if (searchQuery.value.trim() === "") {
    listData1.value = ListTreeData1; // Nếu không có tìm kiếm, hiển thị tất cả
  } else {
    listData1.value = ListTreeData1.filter(department =>
      department.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // Tìm kiếm không phân biệt chữ hoa hay chữ thường
    );
  }
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
const handleDrop = (node) => {
  const countParents = (nodes, targetNode, level = 0) => {
    for (const parentNode of nodes) {
      if (parentNode.children && parentNode.children.includes(targetNode)) {
        return level + 1;
      }
      if (parentNode.children) {
        const parentLevel = countParents(parentNode.children, targetNode, level + 1);
        if (parentLevel) return parentLevel;
      }
    }
    return level;
  };

  const level = countParents(treeData.value, node);
  node.level = level;
  console.log('Node level updated to:', node.level);
};

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
    console.log('Thêm node mới dưới:', id);
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
    console.log('Sửa node:', id);
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

          // Recursively update the level of all descendants (children, grandchildren, etc.)
          const updateChildLevels = (childNode) => {
            if (childNode.children) {
              childNode.children.forEach(grandChild => {
                grandChild.level = childNode.level + 1;
                updateChildLevels(grandChild); // Recursive call for deep nested children
              });
            }
          };
          updateChildLevels(movedNode);

          // Add the child node as a sibling to the       
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

onEvent('decreaseLevel', (id) => {
  // Hàm đệ quy để tìm node theo id và giảm cấp độ
  const decreaseLevel = (node) => {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.id === id) {
          // Tìm nút đồng cấp trước đó
          const sibling = node.children[i - 1];
          if (sibling) {
            // Di chuyển node vào làm con của sibling trước đó
            const [movedNode] = node.children.splice(i, 1); // Xóa node khỏi cha hiện tại
            sibling.children.push(movedNode); // Thêm node vào làm con của sibling
            movedNode.level = sibling.level + 1; // Cập nhật cấp độ của node

            // Cập nhật cấp độ của tất cả các con của node đã di chuyển
            const updateChildLevels = (childNode) => {
              if (childNode.children) {
                childNode.children.forEach(grandChild => {
                  grandChild.level = childNode.level + 1;
                  updateChildLevels(grandChild); // Đệ quy cập nhật cấp độ con
                });
              }
            };
            updateChildLevels(movedNode);

            console.log("Node đã được giảm cấp, trở thành con của node đồng cấp trước:", id);
            return true;
          } else {
            console.log("Không tìm thấy sibling trước để giảm cấp.");
          }
        }
        if (decreaseLevel(child, node)) {
          return true;
        }
      }
    }
    return false;
  };

  const rootNode = treeData.value[0];
  if (decreaseLevel(rootNode, rootNode)) {
    console.log("Node đã được giảm cấp.");
  } else {
    console.log("Không tìm thấy node để giảm cấp.");
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

input {
  display: flex;
  margin-left: 30px;
  margin-bottom: 15px;
  border: 2px solid rgba(220, 220, 220, 1);
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: rgba(72, 100, 127, 1);
  width: calc(100% - 40px);
  height: 36px;
  outline: none;
  border-radius: 4px;
  padding: 0 10px;
}
</style>
