<template>
    <div class=" flex justify-between items-center border-white border-2 p-2 hover:border-collapse hover:rounded-md hover:border-black duration-300 transition-all">
        <InputGroup>
            <InputGroupAddon>
                <i class="pi pi-globe"></i>
            </InputGroupAddon>
            <InputText disabled :placeholder="domain" />
        </InputGroup>

        <InputGroup>
            <Chip :label="provider" class=" ml-2" />
        </InputGroup>

        <div class=" flex justify-center gap-4">
            <Button :loading="loadingUpdate" label="更新" class="w-20 h-10" @click="flushDns"/>
            <Button label="编辑" class="w-20 h-10" @click="openEditDialog"/>
            <Button label="删除" severity="danger" class="w-20 h-10" @click="openDeleteConfirm"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useConfirm } from "primevue/useconfirm";
import axios from '../plugins/axios'
import { useToast } from 'primevue/usetoast';
import { type Ref, inject, ref } from 'vue';
import Chip from 'primevue/chip';
const emit = defineEmits(['reload'])
const props = defineProps({
    domain: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    }
});

const env = import.meta.env;
const confirm = useConfirm();
const toast = useToast();
const editorContent: Ref<string> = inject('editorContent')!
const loadingUpdate = ref(false)

const openEditDialog = ()=>{
    console.log('openEditDialog domain:', props.domain)
    
    // 获取domain文件
    axios.get(`${env.VITE_API_PATH}/api/domain/content`, {
        params: {
            domain: props.domain
        }
    }).then(res => {
        debugger
        editorContent.value = res.data
    }).catch(e => {
        toast.add({severity:'error', summary: 'Error', detail: e, life: 3000});
    })

    confirm.require({
        group: 'editDomainConfirm',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-circle',
        message: 'Are you sure you want to edit this domain?',
        accept: async () => {
            console.log('accept delete domain:', props.domain)
            let res: any = await axios.put(`${env.VITE_API_PATH}/api/domain`, {
                domain: props.domain,
                content: editorContent.value
            }).then(res =>{
                toast.add({severity:'success', summary: 'Success', detail: 'Add domain success', life: 3000});
                emit('reload')
            }).catch(e=>{
                toast.add({severity:'error', summary: 'Error', detail: e, life: 3000});
            });
        }
    });
}
const openDeleteConfirm = ()=>{
    console.log('openDeleteConfirm domain:', props.domain)
    confirm.require({
        group: 'delDomainConfirm',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-circle',
        message: 'Are you sure you want to delete this domain?',
        accept: async () => {
            console.log('accept delete domain:', props.domain)
            let res: any = await axios.delete(`${env.VITE_API_PATH}/api/domain`, {
                data:
                {
                    domain: props.domain
                }
            }).then(res =>{
                toast.add({severity:'success', summary: 'Success', detail: 'Add domain success', life: 3000});
                emit('reload')
            }).catch(e=>{
                toast.add({severity:'error', summary: 'Error', detail: e, life: 3000});
            });
        }
    });
}

const flushDns = () =>{
    console.log('flushDns:', props.domain)
    confirm.require({
        group: 'flushDomainConfirm',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-circle',
        message: 'Are you sure you want to flush this domain?',
        accept: async () => {
            console.log('accept flush domain:', props.domain)
            loadingUpdate.value = true
            let res: any = await axios.post(`${env.VITE_API_PATH}/api/dns/flush`,{
                domain: props.domain
            }).then(res => {
                toast.add({severity:'success', summary: 'Success', detail: res, life: 3000})
            }).catch(e => {
                toast.add({severity:'error', summary: 'Error', detail: e, life: 3000})
            }).finally(()=>{
                loadingUpdate.value = false
            })
        }
    });
}
</script>