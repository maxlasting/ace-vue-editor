<template>
  <div class="editor">
    <!-- <ace-markdown-editor :value="defaultValue" title="Article title..." @submit="submitFn"></ace-markdown-editor> -->
    <!-- use lazy loading, the editor has 1.7mb size -->
    <!-- autosave will emit save event in per saveInterval seconds-->
    <component
      v-if="ready"
      :is="aceMarkdownEditor"
      :value="defaultValue"
      title=""
      @save="saveFn"
      @droped="dropedFn"
      ref="editor"
    >
      <!-- <div slot="logo">Logo</div> -->
      <div slot="title" style="height: 100%; display: flex; align-items: center;">自定义标题</div>
      <div class="editor_fns" slot="header">
        <a class="insert" @click="insertImageFn">插入图片</a>
        <div class="submit" @click="submitFn">提交</div>
        <div class="others">其它功能...</div>
      </div>
      <div slot="footer" style="margin-left: 16px;">底部插槽</div>
    </component>
    <div class="loading" v-else="ready">
      <div class="outer__line">
        <div class="inner"></div>
      </div>
      <span>资源加载中, 请耐心等待 ...</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ready: false,
      aceMarkdownEditor: null,
      defaultValue: ""
    };
  },
  async mounted() {
    await this.initEditor();
  },
  methods: {
    async initEditor() {
      const aceMarkdownEditor = await import("ace-vue-editor");
      this.aceMarkdownEditor = aceMarkdownEditor.default;
      this.ready = true;
    },
    submitFn() {
      const data = this.$refs.editor.$submit();
      console.log(data);
    },
    saveFn(data) {
      console.log(data);
    },
    insertImageFn() {
      this.$refs.editor.$insertImage("https://");
    },
    dropedFn(images) {
      console.log(images);
      // this.$refs.editor.$insertImage('https://')
    }
  }
};
</script>

<style lang="scss">
body,
html {
  width: 100%;
  margin: 0;
  height: 100%;
  overflow: auto;
}

.editor {
  height: 100%;
  position: relative;
  min-width: 1000px;
}

.editor .loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  margin-bottom: 30px;
  color: #686868;
  z-index: 10;
  background: rgba($color: #ffffff, $alpha: 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .outer__line {
    width: 45%;
    margin-bottom: 16px;
    height: 8px;
    border: 1px solid #dddddd;
    position: relative;
    .inner {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 30%;
      background: #eeeeee;
      height: 100%;
      animation: loading 3s linear infinite;
    }
  }
}

.editor .editor_fns {
  display: flex;
  align-items: center;
}

.editor .submit,
.editor .insert,
.editor .others {
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

@keyframes loading {
  0% {
    left: 0;
  }
  50% {
    left: 70%;
  }
  100% {
    left: 0;
  }
}
</style>
