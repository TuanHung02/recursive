<!-- InputModal.vue -->
<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal">
            <div class="title">{{ title }}</div>
            <div class="content">
                <div class="f-input">

                    <label>Tên phòng ban</label>
                    <input v-model="name" type="text" placeholder="Tên phòng ban" />
                </div>
                <div class="f-input">

                    <label>Mã phòng ban </label>
                    <input v-model="code" type="text" placeholder="Mã phòng ban (không bắt buộc)" />
                </div>
                <div class="action">
                    <button class="btn-del" @click="close">Hủy</button>
                    <button class="btn-cf" @click="confirm">Lưu</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    show: Boolean,
    title: String,
    initialName: String,
    initialCode: String
});

const emits = defineEmits(['confirm', 'close']);

const name = ref(props.initialName || '');
const code = ref(props.initialCode || '');

const close = () => emits('close');
const confirm = () => emits('confirm', { name: name.value, code: code.value });

watch(() => props.show, (newVal) => {
    if (newVal) {
        name.value = props.initialName || '';
        code.value = props.initialCode || '';
    }
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999999999;

}

.modal {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 500px;
}

.content {
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
}

.f-input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    label {
        font-size: 16px;
        font-weight: 700;
        line-height: 14px;
        text-align: left;
        color: rgba(72, 100, 127, 1);

    }

    input {
        border: 2px solid rgba(220, 220, 220, 1);
        outline: none;
        border-radius: 4px;
        padding: 10px 12px;
        margin: 10px 0 5px 0;
    }
}

.title {
    background: rgba(72, 100, 127, 1);
    border-radius: 4px 4px 0 0;
    padding: 11px 29px;
    font-size: 24px;
    font-weight: 700;
    text-align: left;
    color: rgba(255, 255, 255, 1);
    ;
}

.action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    width: 100%;
}

.btn-cf {
    border-radius: 4px;
    border: 2px solid rgba(255, 255, 255, 1);
    padding: 10px 8px;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    text-align: center;
    width: 108px;
    height: 40px;
    color: rgba(255, 255, 255, 1);
    background-color: rgba(72, 100, 127, 1);
    opacity: 0.4;
    cursor: pointer;

    &:hover {
        opacity: 1;
        transition: 0.2s;
    }
}


.btn-del {
    border-radius: 4px;
    border: 2px solid rgba(220, 220, 220, 1);
    padding: 10px 8px;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    text-align: center;
    width: 108px;
    height: 40px;
    color: rgba(72, 100, 127, 1);
    background-color: white;
    cursor: pointer;

}
</style>
        