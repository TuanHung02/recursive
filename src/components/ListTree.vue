<template>

    <div class="container">
        <draggable v-model="listData1" group="departments" :animation="300" itemKey="id">
            <template #item="{ element: department }">

                <TheNode :department="department" :key="department.id" />

            </template>
        </draggable>
    </div>
    <div class="container">

        <draggable v-model="listData2" group="departments" :animation="300" itemKey="id">
            <template #item="{ element: department }">
                <TheNode :department="department" :key="department.id" />
            </template>
        </draggable>
    </div>
</template>

<script setup>
import TheNode from './TheNode.vue';
import { ListTreeData1 } from '@/data';
import { ListTreeData2 } from '@/data';
import draggable from 'vuedraggable';
import { ref } from 'vue';

const listData1 = ref(ListTreeData1);
const listData2 = ref(ListTreeData2);

</script>
<style scoped>
.container {
    border: 1px solid rgba(220, 220, 220, 1);
    border-radius: 10px;
    padding: 18px 38px 18px 0;
    max-width: 500px;
    min-width: 430px;
}
</style>