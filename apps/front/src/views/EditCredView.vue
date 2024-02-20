<template>
<div class=" flex flex-col">
    <div class="card flex justify-center">
        <div class=" min-h-[50vh] min-w-[50vw]">
            <Editor/>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, inject, type Ref } from 'vue';
import Editor from '../components/Editor.vue';
import axios from '../plugins/axios'
const editorContent: Ref<string> = inject('editorContent')!
const saveFun: Ref<any> = inject('saveFun')!
editorContent.value = ""
const env = import.meta.env;
const loadData = async ()=>{
    let res: any = await axios.get(`${env.VITE_API_PATH}/api/domain/cred`);
    editorContent.value = res.data
}
const save = async ()=>{
    let res: any = await axios.put(`${env.VITE_API_PATH}/api/domain/cred`, {
        content: editorContent.value
    });
    console.log(res)
}
loadData()
saveFun.value = save
</script>