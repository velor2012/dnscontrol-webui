<template>
    <div class="card flex justify-center">
        <Tree :selectionKeys="selectedKey" :on-select-change="onSelectChange"
        selectionMode="single"
        @nodeSelect="onNodeSelect" :value="nodes" class="w-full md:w-[30rem]"></Tree>
        <div class=" min-h-[50vh] min-w-[50vw]">
            <Editor/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from 'vue';
import Tree from 'primevue/tree';
import Editor from './Editor.vue';

const nodes = ref([]);
const selectedKey = ref([]);

const props = defineProps({
    onNodeSelect: {
        type: Function
    },
    onSelectChange: {
        type: Function,
    },
    nodes: {
        type: Object,
    },
    selectedKey: {
        type: Object,
    }
});
const onNodeSelect = props.onNodeSelect

const onSelectChange = props.onSelectChange
const toRefNode = toRef(props, "nodes");
const toRefSelectedKey = toRef(props, "selectedKey");

watch(toRefNode, () => {
  // ......
  nodes.value = props.nodes as any
  console.log('nodes changed')
})

watch(toRefSelectedKey, () => {
  // ......
  selectedKey.value = props.selectedKey as any
  console.log('selectedKey changed')
})

// watch(nodes, () => {
//   // ......
//   console.log('node changed')
// })
</script>