<!-- TreeItem.vue -->
<template>
    <div :style="{ marginLeft: `${item.level * 20}px` }">
        <span>{{ item.name }} - Cấp độ {{ item.level }}</span>
        <button @click="handleAddChild">Thêm</button>
        <button @click="handleRemoveItem">Xóa</button>
        <button @click="handleIncreaseLevel">Tăng cấp</button>
        <button @click="handleDecreaseLevel">Giảm cấp</button>

        <div v-if="item.children.length">
            <TreeItem v-for="child in item.children" :key="child.id" :item="child" />
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
import TreeItem from './TreeItem.vue'

const props = defineProps({
    item: Object
})

const addNode = inject('addNode')
const deleteNode = inject('deleteNode')
const increaseLevel = inject('increaseLevel')
// const decreaseLevel = inject('decreaseLevel')
const moveToTopLevel = inject('decreaseLevel')

// Hàm xử lý khi nhấn các nút
function handleAddChild() {
    const newId = Date.now().toString() // Tạo ID ngẫu nhiên
    const newNode = { id: newId, name: `Phòng ban mới ${newId}`, level: props.item.level + 1, code: `DPM${newId}`, children: [] }
    addNode(props.item.id, newNode)
}

function handleRemoveItem() {
    deleteNode(props.item.id)
}

function handleIncreaseLevel() {
    increaseLevel(props.item.id)
}

// function handleDecreaseLevel() {
//     decreaseLevel(props.item.id)
// }
function handleDecreaseLevel() {
    if (props.item.level > 1) {
        moveToTopLevel(props.item)
    }

}
</script>

<style scoped>
button {
    margin-left: 5px;
}
</style>