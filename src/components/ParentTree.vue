<template>
    <div class="container">
        <div class="back-white"></div>
        <div class="back-white-v2"></div>
        <InputModel :show="modalVisible" :title="modalTitle" @confirm="handleModalConfirm" @close="handleModalClose" />

        <TreeNode :node="treeData[0]" v-for="node in treeData" :key="node.id" @update="handleUpdateNode" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TreeNode from './TreeNode.vue';
import { onEvent } from '@/eventBus';
import { dataList } from '@/data';
import InputModel from './InputModel.vue';

const treeData = ref([{ children: dataList }]);

const modalVisible = ref(false);
const modalTitle = ref('');
const modalType = ref(''); // 'add' or 'edit' based on the operation type
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

        // Tạo `newNode` với name và code từ modal
        const newNode = {
            id: `${parentNode.id}-${parentNode.children.length}`, // ID dựa trên parentNode
            name, // `name` từ modal
            level: parentNode.level + 1, // level tự động tăng lên 1
            code, // `code` từ modal
            children: [], // children ban đầu là rỗng
        };

        // Thêm `newNode` vào children của parentNode
        parentNode.children.push(newNode);
        console.log('Đã thêm node mới:', newNode);
    }

    modalVisible.value = false; // Đóng modal
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
            // const newName = prompt("Nhập tên cho phòng ban mới:");
            // const a = openModal('Thêm node mới')
            // // const newCode = prompt("Nhập mã code cho phòng ban mới:")
            // const newNode = {
            //     id: `${id}-${node.children.length}`, // Tạo id mới dựa trên node cha
            //     name: a,
            //     level: node.level + 1,
            //     code: `DPM${id}-${node.children.length}`,
            //     children: [],
            // };
            // node.children.push(newNode);
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

onEvent('demoteNode', (parentId, targetId) => {
    const demoteNode = (node, parentId, targetId) => {
        if (!node.children) return false;

        // Tìm node cha và node mục tiêu
        const parentIndex = node.children.findIndex(child => child.id === parentId);
        const targetNode = node.children.find(child => child.id === targetId);

        if (parentIndex !== -1 && targetNode) {
            // Xóa node cha từ danh sách con của node hiện tại
            const [movedNode] = node.children.splice(parentIndex, 1);

            // Tăng level của node cha (để nó trở thành node con của node mục tiêu)
            movedNode.level = targetNode.level + 1;

            // Thêm node cha vào danh sách con của node mục tiêu
            targetNode.children.push(movedNode);
            return true;
        }

        // Tiếp tục tìm kiếm trong danh sách con
        for (let child of node.children) {
            if (demoteNode(child, parentId, targetId)) {
                return true;
            }
        }
        return false;
    }

    const rootNode = treeData.value[0];
    if (demoteNode(rootNode, parentId, targetId)) {
        console.log(`Node ${parentId} đã được giảm cấp và di chuyển dưới node ${targetId}`);
    } else {
        console.log("Không tìm thấy node để giảm cấp.");
    }
});



</script>
<style scoped>
.container {
    border: 1px solid rgba(220, 220, 220, 1);
    border-radius: 10px;
    padding: 0 28px 18px 0;
    max-width: 500px;
    margin: 0 auto;
}

.back-white {
    width: 100%;
    height: 18px;
    z-index: 9999;
    background-color: white;
    border-radius: 10px;
}
</style>