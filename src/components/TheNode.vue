<template>
    <div class="tree-node">
        <div v-if="node.name != null" class="tree-node__content">
            <div class="container">
                <span class="wrapper">
                    <div class="node-level">{{ node.level }} </div>
                    <div class="node-code">{{ node.code }}</div>
                    <div class="node-name">{{ node.name }}</div>
                </span>
            </div>

        </div>

    </div>
</template>

<script setup>
defineProps({
    node: Object,
});


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
</style>