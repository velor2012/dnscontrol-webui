<template>
  <div class="flex flex-col">
    <div class="w-full my-2 mx-6 flex gap-10 justify-center">
      <Button label="首页" @click="goto('/')" />
      <Button label="配置Cred" @click="goto('/cred')" v-if="router.currentRoute.value.path == '/'" />
      <Button :loading="fetchDnsLoading" label="更新解析信息" @click="fetchDns"  v-if="router.currentRoute.value.path == '/'" />
      <Button label="浏览文件" @click="goto('/files')" />
      <Button :loading="saveLoading" label="保存" @click="save" v-if="router.currentRoute.value.path == '/files' 
      || router.currentRoute.value.path == '/cred'" />
    </div>
    <RouterView />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import { ref, provide } from 'vue'
import axios from './plugins/axios'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import router from './router'

const editorContent = ref<string>('我是父组件传过来的值:editorContent')
const filepath = ref<string>('我是父组件传过来的值:filepath')
const saveFun = ref<any>(()=>{})
const domainArrs = ref<Array<any>>([])
const fetchDnsLoading = ref<boolean>(false)
const saveLoading = ref<boolean>(false)
const toast = useToast()
const env = import.meta.env;
provide('editorContent', editorContent)
provide('filepath', filepath)
provide('domainArrs', domainArrs)
provide('saveFun', saveFun)

const save = async () => {
  saveLoading.value = true
  try{
      if(saveFun.value) {
        console.log('exit saveFun')
        await saveFun.value()
      }
      toast.add({severity:'success', summary: '保存成功', life: 3000})
  } catch(e) {
      toast.add({severity:'error', summary: '保存失败', detail: e, life: 3000})
  } finally {
      saveLoading.value = false
  }
}
const goto = async (url: string) => {
  router.push(url)
}
// test
const updateDns = async () => {}

const fetchDns = async () => {
    fetchDnsLoading.value = true
    const promiseArrs = []
    for(let i = 0; i < domainArrs.value.length; i++) {
        const promise = axios.get(`${env.VITE_API_PATH}/api/dns/reload`,{
            params:{
                domain: domainArrs.value[i].domain,
                provider: domainArrs.value[i].provider
            }
        }).then(res => {
            console.log('fetchDns:', res)
            toast.add({severity:'success', summary: '更新成功', detail: res, life: 3000})
        }).catch(e => {
            console.log('fetchDns:', e)
            toast.add({severity:'error', summary: '更新失败', detail: e, life: 3000})
        })
        promiseArrs.push(promise)
    }
    await Promise.all(promiseArrs)
    fetchDnsLoading.value = false
}

const checkDnscontrolExist = async () => {
    console.log('check dnscontrol exist')
    let res: any = await axios.get(`${env.VITE_API_PATH}/api/base/check`).then(res => {
        console.log('check dnscontrol: exist')
    }).catch(e => {
        console.log('check dnscontrol: miss!')
        toast.add({severity:'error', summary: '服务端缺少Dnscontrol', detail: e, life: 3000})
        return false
    })
    return res
}
checkDnscontrolExist()
</script>
