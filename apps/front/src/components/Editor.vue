<template>
    <MonacoEditor
    theme="vs"
    :options="MONACO_EDITOR_OPTIONS"
    language="javascript"
    v-model:value="code"
  ></MonacoEditor>
  </template>

<script lang="ts" setup>
import { inject } from 'vue'
import MonacoEditor from 'monaco-editor-vue3';

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
}

const code = inject('editorContent')

</script>
