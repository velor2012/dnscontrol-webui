<template>
<div class=" flex flex-col">
    <div class="w-full my-2 mx-6 flex-col items-center gap-10 justify-center" >
        <!-- <div class=" text-center">Home</div> -->
        <div class=" flex w-full justify-center">
            <div class=" w-[50vw]">
                <domain-item v-for="(item, idx) in data" :key="idx" :provider="item.provider" :domain="item.domain" @reload="loadData"></domain-item>
            </div>
        </div>
        <div class=" w-full flex items-center justify-center mt-4">
            <Button class="w-24" @click="openAddDomainConfirm"> 添加域名 </Button>
        </div>
    </div>
    <ConfirmDialog group="addDomainConfirm">
        <template #message="slotProps">
            <div class="flex flex-col items-center w-full gap-3 border-b border-surface-200 dark:border-surface-700">
                <InputText placeholder="请输入域名" v-model="newDomain" />
                <InputText placeholder="请输入域名提供商，cred.json中必须存在该的key" v-model="newProvider" />
            </div>
        </template>
    </ConfirmDialog>
    <ConfirmDialog group="editDomainConfirm">
        <template #message="slotProps">
            <div class=" p-2 flex flex-col">
                <div class="flex justify-center">
                    <div class=" min-h-[50vh] w-full">
                        <Editor/>
                    </div>
                </div>
            </div>
        </template>
    </ConfirmDialog>
    <ConfirmDialog group="delDomainConfirm">
        <template #message="slotProps">
            <div class="flex flex-col items-center w-full gap-3 border-b border-surface-200 dark:border-surface-700">
                <i severity="help" :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
                <p>{{ slotProps.message.message }}</p>
            </div>
        </template>
    </ConfirmDialog>
    <ConfirmDialog group="flushDomainConfirm">
        <template #message="slotProps">
            <div class="flex flex-col items-center w-full gap-3 border-b border-surface-200 dark:border-surface-700">
                <i severity="help" :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
                <p>{{ slotProps.message.message }}</p>
            </div>
        </template>
    </ConfirmDialog>
</div>
</template>

<script setup lang="ts">
import { ref, provide, type Ref, inject } from 'vue';
import axios from '../plugins/axios'
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DomainItem from '@/components/DomainItem.vue';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import Editor from '../components/Editor.vue';

const toast = useToast();
const confirm = useConfirm();
let data: Ref<any[]> = inject('domainArrs')!
const newDomain = ref<string>('')
const newProvider = ref<string>('')
    
const env = import.meta.env;
const loadData = async () => {
    try {
        const res = await axios.get(`${env.VITE_API_PATH}/api/domain/list`);
        data.value = res.data;
    } catch (error) {
        toast.add({severity:'error', summary: 'Error', detail: error, life: 3000});
    }
}
const openAddDomainConfirm = () => {
    confirm.require({
        group: 'addDomainConfirm',
        header: 'Add Domain',
        icon: 'pi pi-exclamation-circle',
        message: 'Please input the domain you want to add',
        accept: async () => {
            console.log('accept add domain:', newDomain.value)
            let res: any = await axios.post(`${env.VITE_API_PATH}/api/domain`, {
                domain: newDomain.value,
                provider: newProvider.value
            }).then(res =>{
                toast.add({severity:'success', summary: 'Success', detail: 'Add domain success', life: 3000});
                loadData()
            }).catch(e=>{
                e.response && toast.add({severity:'error', summary: 'Error', detail: e.response.data.message, life: 3000});
            });
        }
    });
}
loadData()
</script>