# ace-vue-editor

![npm](https://img.shields.io/npm/v/ace-vue-editor) ![](https://img.shields.io/npm/l/ace-vue-editor) ![GitHub repo size](https://img.shields.io/github/repo-size/maxlasting/ace-vue-editor)

The markdown editro for vue， like [juejin.im](https://juejin.im)

## Install

```
npm i -S ace-vue-editor
```

## view

![May312020 212706.gif](http://ttc-tal.oss-cn-beijing.aliyuncs.com/1590931668/May-31-2020%2021-27-06.gif)

## Live demo

[demo](https://maxlasting.github.io/demo/ace-vue-markdown/index)

## Usage

```vue
<template>
  <div class="editor">
    <!-- <ace-markdown-editor :value="defaultValue" title="Article title..." @submit="submitFn"></ace-markdown-editor> -->
    <!-- use lazy loading, the editor has 1.7mb size -->
    <!-- autosave will emit save event in per saveInterval seconds-->
    <component v-if="ready" :is="aceMarkdownEditor" :value="defaultValue" title="" @save="saveFn" ref="editor">
      <div slot="header-before">
        <a class="insert" @click="insertImageFn">插入图片</a>
      </div>
      <div class="submit" slot="submit" @click="submitFn">提交</div>
      <div class="others" slot="header-after">其它功能...</div></div>
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
      const aceMarkdownEditor = await import('ace-markdown-editor')
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
  }
}
</script>

<style lang="scss">
body, html {
  width: 100%;
  margin: 0;
  height: 100%;
  overflow: auto;
}

.editor {
  height: 100%;
  position: relative;
  min-width: 1200px;
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

.editor .submit, .editor .insert, .editor .others {
  cursor: pointer;
  border: 1px solid #e8e8e8;
  padding: 6px 12px;
  border-radius: 4px;
  &:hover {
    color: #1890ff;
  }
}

.editor .submit {
  margin: 0 16px;
}
</style>
```
