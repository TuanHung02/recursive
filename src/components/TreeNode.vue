<template>
    <div class="tree-node">
        <div v-if="node.name != null" @contextmenu.prevent="showDropdown" class="tree-node__content">
            <!-- <input type="checkbox" v-model="isChecked" @change="toggleCheck" /> -->
            <div class="container">
                <span class="wrapper" @click="toggleCollapse">
                    <div class="node-level">{{ node.level }} </div>
                    <div class="node-code">{{ node.code }}</div>
                    <div class="node-name">{{ node.name }}</div>
                </span>
            </div>
            <hr v-if="node.name != null" class="node-horizontal">
            <div v-if="node.name != null" class="node-vertical"></div>
        </div>
        <!-- <div style="position: relative;">
            <hr v-if="node.name != null" class="node-horizontal">
            <div v-if="node.name != null" class="node-vertical"></div>
        </div> -->

        <!-- Dropdown menu -->
        <div v-if="showMenu" :style="dropdownStyle" class="dropdown-menu">
            <button @click="addNode">Thêm phòng ban</button>
            <button @click="editNode">Sửa phòng ban</button>
            <button @click="deleteNode">Xóa phòng ban</button>
            <button v-if="node.level !== 1" @click="increaseLevel">Nâng level</button>
            <button @click="decreaseLevel">Giảm level</button>
        </div>


        <div v-show="!collapsed" class="tree-node__children">
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

// const isChecked = ref(false);
const collapsed = ref(false);
const showMenu = ref(false);
const dropdownStyle = reactive({ top: '0px', left: '0px' });

const toggleCollapse = () => {
    collapsed.value = !collapsed.value;
}

// const toggleCheck() => {
//     emitEvent('checkboxToggled', { id: props.node.id, checked: isChecked.value });
// }

const showDropdown = (event) => {
    showMenu.value = true;
    dropdownStyle.top = `${event.clientY}px`;
    dropdownStyle.left = `${event.clientX}px`;
    document.addEventListener('click', closeDropdown);
}

const closeDropdown = () => {
    showMenu.value = false;
    document.removeEventListener('click', closeDropdown);
}

const addNode = () => {
    emitEvent('addNode', props.node.id);
    closeDropdown();
}

const editNode = () => {
    emitEvent('editNode', props.node.id);
    closeDropdown();
}

const deleteNode = () => {
    emitEvent('deleteNode', props.node.id);
    closeDropdown();
}

const updateNode = (updatedNode) => {
    emit('update', updatedNode);
}

const increaseLevel = () => {
    emitEvent('increaseLevel', props.node.id);
    closeDropdown();
}

const decreaseLevel = () => {
    emitEvent('demoteNode', props.node.id);
    closeDropdown();
}
</script>

<style scoped>
.tree-node {
    margin-left: 28px;
}

.tree-node__content {
    display: flex;
    align-items: center;
    position: relative;
}

.dropdown-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 4px;
    height: 200px;
    z-index: 9999;

    button {
        background: rgba(255, 255, 255, 1);
        border: none;
        padding: 12px 10px;
        cursor: pointer;
        width: 150px;
        text-align: start;
    }

    button:hover {
        background-color: rgba(72, 100, 127, 1);
        color: rgba(255, 255, 255, 1);
    }
}

.container {
    height: 39px;
    background-color: white;
    width: 100%;
}

.wrapper {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    background: rgba(240, 240, 240, 1);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    color: rgba(102, 102, 102, 1);
    width: 100%;
}

.node-level {
    width: 18px;
    height: 18px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
    background-color: rgba(72, 100, 127, 1);
    color: rgba(255, 255, 255, 1);
}

.node-code {
    margin-left: 8px;
    margin-right: 30px;
}

.node-horizontal {
    position: absolute;
    width: 10px;
    border: 1px solid rgba(220, 220, 220, 1);
    top: 8px;
    z-index: 9999;
    right: 100%;
}

.node-vertical {
    width: 2px;
    height: calc(100% + 100vh);
    display: inline-block;
    position: absolute;
    background-color: rgba(220, 220, 220, 1);
    left: -12px;
    bottom: calc(100% - 18px);
    z-index: -99999;
}
</style>