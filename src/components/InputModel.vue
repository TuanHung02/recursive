<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal">
            <div class="title">{{ title }}</div>
            <div class="content">
                <div class="f-input" :class="{ 'error': nameError }">
                    <label for="name">Tên phòng ban</label>
                    <input id="name" v-model="name" type="text" placeholder="Tên phòng ban"
                        @focus="startValidating('name')" @blur="validateInputs" />
                    <p v-if="nameError" class="error-message">
                        Tên phòng ban không được để trống, không chứa ký tự đặc biệt
                    </p>
                </div>
                <div class="f-input">
                    <label for="code">Mã phòng ban</label>
                    <input id="code" v-model="code" type="text" placeholder="Mã phòng ban (không bắt buộc)"
                        @focus="startValidating('code')" @blur="validateInputs" />
                </div>
                <div class="action">
                    <button class="btn-del" @click="close">Hủy</button>
                    <button class="btn-cf" @click="confirm" :disabled="!isFormValid">
                        Lưu
                    </button>
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
    initialCode: String,
});

const emits = defineEmits(['confirm', 'close']);

const specialCharRegex = /[!@#$%^&*()_+]/g;

const name = ref(props.initialName || '');
const code = ref(props.initialCode || '');
const nameError = ref(false);
const codeError = ref(false);
const isFormValid = ref(false);

const isNameTouched = ref(false);
const isCodeTouched = ref(false);

const validateInputs = () => {
    if (isNameTouched.value) {
        nameError.value = !name.value.trim() || specialCharRegex.test(name.value);
    }
    if (isCodeTouched.value) {
        codeError.value = specialCharRegex.test(code.value);
    }
    isFormValid.value = !nameError.value && !codeError.value;
};

const startValidating = (field) => {
    if (field === 'name') isNameTouched.value = true;
    if (field === 'code') isCodeTouched.value = true;
};

const close = () => emits('close');

const confirm = () => {
    if (isFormValid.value) {
        emits('confirm', { name: name.value.trim(), code: code.value.trim() });
    }
};

watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            name.value = props.initialName || '';
            code.value = props.initialCode || '';
            nameError.value = false;
            codeError.value = false;
            isNameTouched.value = false;
            isCodeTouched.value = false;
            isFormValid.value = false;
        }
    }
);
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 500px;
}

.title {
    background-color: #48647f;
    color: #fff;
    padding: 12px 20px;
    font-size: 20px;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
}

.content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.f-input {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.f-input label {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #48647f;
}

.f-input input {
    border: 2px solid #dcdcdc;
    border-radius: 4px;
    padding: 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}

.f-input.error input {
    border-color: #ff7777;
}

.error-message {
    color: #ff7777;
    font-size: 12px;
    margin-top: 4px;
}

.action {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

button {
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.btn-del {
    background-color: #fff;
    color: #48647f;
    border: 2px solid #dcdcdc;
}

.btn-del:hover {
    background-color: #f2f2f2;
}

.btn-cf {
    background-color: #48647f;
    color: #fff;
    border: 2px solid #48647f;
}

.btn-cf:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-cf:not(:disabled):hover {
    opacity: 0.8;
}
</style>
