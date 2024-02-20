<template>
<div class=" flex flex-col">
    <tree-componet :onNodeSelect="onNodeSelect" :selectedKey="selectedKey" :nodes="nodes" :onSelectChange="onSelectChange" ></tree-componet>
</div>
</template>

<script setup lang="ts">
import TreeComponet from '../components/TreeComponet.vue'
import { ref, inject, type Ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from '../plugins/axios'
const toast = useToast();

const nodes = ref([]);
const selectedKey = ref();
const env = import.meta.env;
const filepath: Ref<string> = inject('filepath')!
const editorContent: Ref<string> = inject('editorContent')!
const saveFun: Ref<any> = inject('saveFun')!

const loadData = async ()=>{
    const originDataRes = await axios.get(`${env.VITE_API_PATH}/api/file/list`);
    let t = processOriData(originDataRes.data);
    (nodes as any).value =  t;
}

let lastNodeKey = 0;
const onNodeSelect = async (node: any)=>{
    if(node.key === lastNodeKey) return
    lastNodeKey = node.key;
    toast.add({ severity: 'success', summary: 'Node Selected', detail: node.label, life: 3000 });
    
    if(node.type === 'directory'){
        expendItem(node)
    }else{
        let res: any = await axios.get(`${env.VITE_API_PATH}/api/file/content`, {
            method: 'GET',
            params: {
                path: node.key
            },
        });
        editorContent.value = res.data
        filepath.value = node.key
    }
}

const onSelectChange = ()=>{
    console.log('onSelectChange')
}
const processItem = (item: any)=>{
    return {
        key: item.path,
        label: item.name,
        data: item.name,
        type: item.type,
        icon: `pi pi-fw ${item.type === 'directory' ? 'pi-folder' : 'pi-file'}`,
        children: [] as any[]
    }
}
const processOriData = (od: any)=>{
    const res = []
    res.push(processItem(od))
    for(let i = 0; i < od.children.length; i++){
        res[0].children.push(processItem(od.children[i]))
    }
    return res;
}

const expendItem = async (item: any)=>{
    if(item.type != 'directory' || item.children.length > 0) return
    const res = await axios.get(`${env.VITE_API_PATH}/api/file/list`, {
        method: 'GET',
        params: {
            path: item.key
        }
    });
    const resData = res.data
    for(let i = 0; i < resData.children.length; i++){
        item.children.push(processItem(resData.children[i]))
    }
    return item;
}

const save = ()=> {
    axios
    .post(`${env.VITE_API_PATH}/api/file`, {
      path: filepath.value,
      content: editorContent.value
    })
    .then((res) => {
      toast.add({ severity: 'success', summary: 'Success', detail: '保存成功', life: 3000 })
    })
    .catch((err) => {
      toast.add({ severity: 'error', summary: 'Error', detail: '保存失败', life: 3000 })
    })
}

loadData()
saveFun.value = save

</script>