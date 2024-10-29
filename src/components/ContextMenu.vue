<template>
    <div class="context-menu" :style="{ top: `${y}px`, left: `${x}px` }" @click.stop>
        <ul>
            <li @click="addDepartment">Thêm Phòng Ban</li>
            <li @click="editDepartment">Sửa Phòng Ban</li>
            <li @click="deleteDepartment">Xóa Phòng Ban</li>
        </ul>
    </div>
</template>

<script>
import { eventBus } from '@/eventBus';

export default {
    name: 'ContextMenu',
    props: {
        x: {
            type: Number,
            required: true,
        },
        y: {
            type: Number,
            required: true,
        },
    },
    methods: {
        addDepartment() {
            eventBus.$emit('addDepartment');
            this.hideMenu();
        },
        editDepartment() {
            eventBus.$emit('editDepartment');
            this.hideMenu();
        },
        deleteDepartment() {
            eventBus.$emit('deleteDepartment');
            this.hideMenu();
        },
        hideMenu() {
            eventBus.showMenu = false;
        },
    },
    mounted() {
        // Đóng menu khi nhấn bên ngoài
        document.addEventListener('click', this.hideMenu);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.hideMenu);
    },
};
</script>

<style scoped>
.context-menu {
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    padding: 5px 0;
    width: 150px;
}

.context-menu ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.context-menu li {
    padding: 8px 12px;
    cursor: pointer;
}

.context-menu li:hover {
    background-color: #eee;
}
</style>