# ace-vue-editor

** Current in test version **

Now only use in Vue

---

## install

```
npm i -S ace-vue-editor
```

## view

![May312020 212706.gif](http://ttc-tal.oss-cn-beijing.aliyuncs.com/1590931668/May-31-2020%2021-27-06.gif)

## demo

[Live demo](https://maxlasting.github.io/demo/ace-vue-markdown/index)

```vue
<template>
  <div class="editor">
    <!-- <ace-markdown-editor :value="defaultValue" title="Article title..." @submit="submitFn"></ace-markdown-editor> -->
    <!-- use lazy loading, the editor has 1.7mb size -->
    <!-- autosave will emit save event in per saveInterval seconds-->
    <component v-if="ready" :is="aceMarkdownEditor" :value="defaultValue" title="" @submit="submitFn" @save="saveFn" autosave :saveInterval="10 * 1000">
      <div slot="header">
        <a class="insert" @click="insertImageFn">插入图片</a>
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
      defaultValue: 'hello, world'
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
    submitFn (data) {
      console.log(data)
    },
    saveFn (data) {
      console.log(data)
    },
    insertImageFn () {
      this.$refs.editor.$insertImage('https://')
    },
  }
}
</script>

<style lang="scss">
body, html {
  width: 100%;
  margin: 0;
  height: 100%;
  overflow: hidden;
}

.editor {
  height: 100%;
  position: relative;
}

.editor .loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 20px;
  margin-bottom: 30px;
  color: #686868;
}
</style>
```
