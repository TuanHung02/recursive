<template>
    <div class="tree-node">
        <div @contextmenu.prevent="showDropdown" class="tree-node__content">
            <input type="checkbox" v-model="isChecked" @change="toggleCheck" />
            <span @click="toggleCollapse">{{ node.name }} - level:{{ node.level }} - {{ node.code }}</span>
        </div>

        <!-- Dropdown menu -->
        <div v-if="showMenu" :style="dropdownStyle" class="dropdown-menu">
            <button @click="addNode">Thêm</button>
            <button @click="editNode">Sửa</button>
            <button @click="deleteNode">Xóa</button>
            <button @click="increaseLevel">Tăng Cấp</button>
            <button @click="decreaseLevel">Giảm Cấp</button>
        </div>

        <div v-if="!collapsed" class="tree-node__children">
            <TreeNode v-for="child in node.children" :key="child.id" :node="child" @update="updateNode" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { emitEvent } from '@/eventBus';
const props = defineProps({
    node: Object,
});
const emit = defineEmits(['update']);

const isChecked = ref(false);
const collapsed = ref(false);
const showMenu = ref(false);
const dropdownStyle = reactive({ top: '0px', left: '0px' });

function toggleCollapse() {
    collapsed.value = !collapsed.value;
}

function toggleCheck() {
    emitEvent('checkboxToggled', { id: props.node.id, checked: isChecked.value });
}

function showDropdown(event) {
    showMenu.value = true;
    dropdownStyle.top = `${event.clientY}px`;
    dropdownStyle.left = `${event.clientX}px`;
    document.addEventListener('click', closeDropdown);
}

function closeDropdown() {
    showMenu.value = false;
    document.removeEventListener('click', closeDropdown);
}

function addNode() {
    emitEvent('addNode', props.node.id);
    closeDropdown();
}

function editNode() {
    emitEvent('editNode', props.node.id);
    closeDropdown();
}

function deleteNode() {
    emitEvent('deleteNode', props.node.id);
    closeDropdown();
}

function updateNode(updatedNode) {
    emit('update', updatedNode);
}

function increaseLevel() {
    emitEvent('increaseLevel', props.node.id);
    closeDropdown();
}

function decreaseLevel() {
    emitEvent('demoteNode', props.node.id);
    closeDropdown();
}
</script>

<style scoped>
.tree-node {
    margin-left: 20px;
}

.tree-node__content {
    display: flex;
    align-items: center;
}

.dropdown-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
}
</style>