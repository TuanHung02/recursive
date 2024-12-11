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
      <draggable v-model="treeData" group="departments" :animation="300" itemKey="id">
        <template #item="{ element: department }">
          <TreeNode :node="department" :key="department.id" :isLine="true" :maxLevel="10" />
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
    listData1.value = ListTreeData1;
  } else {
    listData1.value = ListTreeData1.filter(department =>
      department.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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

// const handleDrop = (node) => {
//   const countParents = (nodes, targetNode, level = 0) => {
//     for (const parentNode of nodes) {
//       if (parentNode.children && parentNode.children.includes(targetNode)) {
//         return level + 1;
//       }
//       if (parentNode.children) {
//         const parentLevel = countParents(parentNode.children, targetNode, level + 1);
//         if (parentLevel) return parentLevel;
//       }
//     }
//     return level;
//   };

//   const level = countParents(treeData.value, node);
//   node.level = level;
//   console.log('Node level updated to:', node.level);
// };

// Event handling
onEvent('addNode', (id) => {
  const findAndAddNode = (node) => {
    if (node.id === id) {
      openModal('Thêm mới phòng ban', { parentNode: node });
      return true;
    }
    return node.children?.some(findAndAddNode) || false;
  };

  treeData.value.some(findAndAddNode);
});

onEvent('deleteNode', (id) => {
  const deleteNode = (node) => {
    if (!node.children) return false;

    const index = node.children.findIndex(child => child.id === id);
    if (index !== -1) {
      node.children.splice(index, 1);
      return true;
    }

    return node.children.some(deleteNode);
  };

  treeData.value.some(deleteNode);
});


onEvent('increaseLevel', (id) => {
  const increaseLevel = (node, parent) => {
    if (!node.children) return false;

    const index = node.children.findIndex(child => child.id === id);
    if (index !== -1) {
      const [movedNode] = node.children.splice(index, 1);

      // Cập nhật cấp độ của node được di chuyển
      movedNode.level = node.level;

      // Hàm đệ quy cập nhật cấp độ cho toàn bộ con cháu của node được di chuyển
      const updateChildLevels = (childNode) => {
        if (childNode.children) {
          childNode.children.forEach(grandChild => {
            grandChild.level = childNode.level + 1;
            updateChildLevels(grandChild);
          });
        }
      };
      updateChildLevels(movedNode);

      // Thêm node vào danh sách con của parent
      parent.children.push(movedNode);
      return true;
    }

    // Tiếp tục tìm kiếm trong danh sách con
    return node.children.some(child => increaseLevel(child, node));
  };
  treeData.value.some(rootNode => increaseLevel(rootNode, rootNode));
});


onEvent('decreaseLevel', (id) => {
  const decreaseLevel = (node) => {
    if (!node.children) return false;

    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child.id === id) {
        const sibling = node.children[i - 1];
        if (sibling) {
          // Di chuyển node làm con của sibling
          const [movedNode] = node.children.splice(i, 1);
          sibling.children = sibling.children || [];
          sibling.children.push();

          // Cập nhật cấp độ cho node được di chuyển và con cháu của nó
          movedNode.level = sibling.level + 1;

          const updateChildLevels = (childNode) => {
            if (childNode.children) {
              childNode.children.forEach(grandChild => {
                grandChild.level = childNode.level + 1;
                updateChildLevels(grandChild);
              });
            }
          };
          updateChildLevels(movedNode);
          return true;
        }
        return false; // Không có sibling trước đó để giảm cấp
      }
      if (decreaseLevel(child)) return true;
    }
    return false;
  };
  treeData.value.some(rootNode => decreaseLevel(rootNode));
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
  min-width: 430px;
  height: fit-content;
}

.container {
  border: 1px solid rgba(220, 220, 220, 1);
  border-radius: 10px;
  padding: 0 28px 18px 0;
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
