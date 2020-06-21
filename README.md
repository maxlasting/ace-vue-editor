# ace-vue-editor

![npm](https://img.shields.io/npm/v/ace-vue-editor) ![](https://img.shields.io/npm/l/ace-vue-editor) ![GitHub repo size](https://img.shields.io/github/repo-size/maxlasting/ace-vue-editor)

The markdown editro for vue, like [juejin.im](https://juejin.im).

## Install

```
npm i -S ace-vue-editor
```

## view

![](https://cdn.maxlasting.com/images/7dvJyR.png)

## Live demo

[demo](https://maxlasting.github.io/demo/ace-vue-markdown/index)

## Usage

```vue
<template>
  <div class="editor">
    <!-- <ace-markdown-editor :value="defaultValue" title="Article title..." @submit="submitFn"></ace-markdown-editor> -->
    <!-- use lazy loading, the editor has 1.7mb size -->
    <!-- autosave will emit save event in per saveInterval seconds-->
    <component v-if="ready" :is="aceMarkdownEditor" :value="defaultValue" title="" @save="saveFn" @droped="dropedFn" ref="editor">
      <!-- <div slot="logo">Logo</div> -->
      <div class="editor_fns" slot="header">
        <a class="insert" @click="insertImageFn">插入图片</a>
        <div class="submit" @click="submitFn">提交</div>
        <div class="others">其它功能...</div>
        </div>
      <div slot="footer"></div>
    </component>
    <div v-else class="loading">
      加载中...
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ready: false,
      aceMarkdownEditor: null,
      defaultValue: ''
    }
  },
  async mounted () {
    await this.initEditor()
  },
  methods: {
    async initEditor () {
      const aceMarkdownEditor = await import('ace-vue-editor')
      this.aceMarkdownEditor = aceMarkdownEditor.default
      this.ready = true
    },
    submitFn () {
      const data = this.$refs.editor.$submit()
      console.log(data)
    },
    saveFn (data) {
      console.log(data)
    },
    insertImageFn () {
      this.$refs.editor.$insertImage('https://')
    },
    dropedFn (images) {
      console.log(images)
      // this.$refs.editor.$insertImage('https://')
    }
  }
}
</script>
```

## Others

If you have good suggestions, please leave a message on my GitHub.
