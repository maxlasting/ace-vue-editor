<template>
  <div class="editor">
    <!-- <ace-markdown-editor :value="defaultValue" title="Article title..." @submit="submitFn"></ace-markdown-editor> -->
    <component v-if="ready" :is="aceMarkdownEditor" :value="defaultValue" title="" @submit="submitFn" @save="saveFn" ref="editor">
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
    submitFn (data) {
      // const { title, source, html } = data
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

.editor .insert {
  cursor: pointer;
}
</style>
