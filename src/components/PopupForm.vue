<!-- AddNodeModal.vue -->
<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal">
            <h3>Thêm phòng ban mới</h3>
            <label>Tên:</label>
            <input v-model="name" placeholder="Nhập tên" />

            <label>Mã:</label>
            <input v-model="code" placeholder="Nhập mã" />

            <button @click="handleAdd">Thêm</button>
            <button @click="closeModal">Hủy</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

 defineProps({
    isVisible: Boolean,
});
const emit = defineEmits(['close', 'addNode']);

// Biến lưu dữ liệu nhập
const name = ref('');
const code = ref('');

// Thực hiện thêm node
function handleAdd() {
    emit('addNode', { name: name.value, code: code.value });
    closeModal();
}

// Đóng modal và reset dữ liệu
function closeModal() {
    emit('close');
    name.value = '';
    code.value = '';
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    text-align: center;
}
</style>