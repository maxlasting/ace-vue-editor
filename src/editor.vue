<template>
  <div class="__ace_markdown_editor__">
    <div class="editor__header">
      <input
        placeholder="输入文章标题..."
        v-model="articleTitle"
        spellcheck="false"
        maxlength="80"
        class="header__input"
        :class="{ 'toggle': !togglePreview }"
      >
      <div class="header__fns">
        <slot name="header-before"></slot>
        <div class="header__fns-submit">
          <div class="submit__btn" @click="clickToSubmitFn">
            <span class="submit__btn-text">发布</span>
          </div>
        </div>
        <slot name="header-after"></slot>
      </div>
    </div>

    <div class="editor__body" :class="{ 'toggle': !togglePreview }">
      <div class="editor__body-markdown" :class="{ 'toggle': !togglePreview }">
        <div class="markdown__editor y66" ref="editor"></div>
      </div>
      <div class="editor__body-html" v-show="togglePreview">
        <div class="html__content y66__markdown" v-html="html" v-highlight ref="preview"/>
      </div>
    </div>

    <div class="editor__footer" :class="{ 'toggle': !togglePreview }">
      <div class="editor__footer-left">
        <div class="footer__left-fns">
          <div class="tips" @mouseenter="showTipsFn" @mouseleave="hideTipsFn">
            <div class="tips__card" v-show="visibleTips">
              <div class="tips__card-wrapper">
                <div class="title">常用快捷键</div>
                <ul class="list">
                  <li class="list__item">
                    <span>添加标题</span>
                    <span>Command + H</span>
                  </li>
                  <li class="list__item">
                    <span>插入图片</span>
                    <span>Ctrl / Command + I</span>
                  </li>
                  <li class="list__item">
                    <span>插入链接</span>
                    <span>Ctrl / Command + k</span>
                  </li>
                  <li class="list__item">
                    <span>插入代码</span>
                    <span>Ctrl / Command + Shift + C</span>
                  </li>
                  <li class="list__item">
                    <span>插入表格</span>
                    <span>Ctrl / Command + Alt + T</span>
                  </li>
                  <li class="list__item">
                    <span>有序列表</span>
                    <span>Ctrl / Command + Alt + L</span>
                  </li>
                  <li class="list__item">
                    <span>无序列表</span>
                    <span>Ctrl / Command + T</span>
                  </li>
                  <li class="list__item">
                    <span>文字加粗</span>
                    <span>Command + B</span>
                  </li>
                  <li class="list__item">
                    <span>文字倾斜</span>
                    <span>Shift + Command + I</span>
                  </li>
                  <li class="list__item">
                    <span>文字划线</span>
                    <span>Shift + Command + S</span>
                  </li>
                  <li class="list__item">
                    <span>段落引用</span>
                    <span>Command + .</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <slot name="footer"></slot>
        </div>
        <div class="footer__left-toggle" :class="{ 'close-preview': !togglePreview }" @click="clickTotogglePreviewFn"></div>
      </div>

      <div class="editor__footer-right" v-show="togglePreview">
        <div class="footer__right-title">预览</div>
        <div class="footer__right-fonts">共 {{ totalLine }} 行 &nbsp; 字数: {{ words }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import markdown from '@plugins/markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/scss/atom-one-dark-reasonable.scss'
import highlightjsLineNumbers from '@plugins/highlightjs-line-numbers'
import ace from 'brace'
import 'brace/ext/searchbox'
import 'brace/mode/markdown'
import { keybindings, bindingMethods } from '@plugins/keybindings'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    saveInterval: {
      type: Number,
      default: 30 * 1000,
    },
    autosave: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      articleTitle: '',
      words: 0,
      totalLine: 0,
      description: '',
      source: '',
      html: '',
      editor: null,
      editSession: null,
      convertTimer: null,
      isEditorChange: false,
      togglePreview: true,
      visibleTips: false,
      saveTimer: null,
      isAutoSave: false,
    }
  },

  directives: {
    highlight (el) {
      const blocks = el.querySelectorAll('pre code')
      highlightjsLineNumbers(hljs)
      hljs.initLineNumbersOnLoad()
      blocks.forEach(block => hljs.highlightBlock(block))
    }
  },

  mounted () {
    this.initAceEditorFn()
    this.initEditorSyncScollerFn()
    this.InitKeybindingsFn()
    this.initPropsDataFn()
    this.autoEmitSaveFn()
  },

  watch: {
    source () {
      this.html = markdown.render(this.source)
    },

    title () {
      this.articleTitle = this.title
      this.$emit('change', {
        source: this.source,
        html: this.html,
        title: this.articleTitle
      })
    },

    value (md) {
      this.editor.setValue(this.source = md)
    },

    autosave () {
      this.autoEmitSaveFn()
    },
  },

  methods: {
    initPropsDataFn () {
      this.articleTitle = this.title
      this._updateEditorAndPreview(this.editSession.setValue(this.source = this.value))
      this.editor.focus()
    },
    autoEmitSaveFn () {
      if (!this.autosave) return clearInterval(this.saveTimer)
      this.saveTimer = setInterval(() => {
        this.isAutoSave = true
        this.editorSave()
      }, Math.max(this.saveInterval, 5 * 1000))
    },
    initAceEditorFn () {
      const editor = this.editor = ace.edit(this.$refs.editor)

      this.editSession = editor.getSession()
      this.editSelection = this.editSession.getSelection()

      editor.session.setMode('ace/mode/markdown')
      editor.setFontSize(14)

      this.editor.$blockScrolling = Infinity

      editor.session.setTabSize(2)
      editor.session.setUseSoftTabs(true)
      // 设置换行
      editor.session.setUseWrapMode(true)
      // 设置边距
      editor.renderer.setPadding(30)
      // 设置上下边距
      editor.renderer.setScrollMargin(12, 100)
      editor.renderer.getVScrollBarAlwaysVisible(true)

      editor.setOptions({
        // 高亮当前所在的行
        highlightActiveLine: false,
        // 多选
        enableMultiselect: true,
        // 关闭侧边栏
        showGutter: false,
        // 关闭打印边距
        showPrintMargin: false,
      })

      editor.session.on('change', () => {
        clearTimeout(this.convertTimer)
        this.convertTimer = setTimeout(() => {
          this._updateEditorAndPreview()
          this.isEditorChange = true
        }, 300)
      })
    },
    _updateEditorAndPreview () {
      this.totalLine = this.editSession.getLength()
      this.source = this.editor.getValue()
      this.words = this.source.replace(/\s*/g, '').length
    },
    _sleep (d) {
      return new Promise((resolve) => setTimeout(resolve, d))
    },
    async _editorSyncScoller (scrollTop) {
      if (this.isEditorChange) {
        await this._sleep(450)
        this.isEditorChange = false
      }
      const clientHeight = document.querySelector('.ace_scroller').clientHeight
      if (this._editorScroll) {
        this._editorScroll = false
        return
      }
      this._previewScroll = true
      const lineHeight = this.editor.renderer.lineHeight
      const height = this.editSession.getScreenLength() * lineHeight - clientHeight
      const ratio = parseFloat(scrollTop) / height
      const calScrollTop = (this.$refs.preview.scrollHeight - this.$refs.preview.clientHeight) * ratio
      this.$refs.preview.scrollTop = calScrollTop
    },
    _previewSyncScoller () {
      const clientHeight = document.querySelector('.ace_scroller').clientHeight
      if (this._previewScroll) {
        this._previewScroll = false
        return
      }
      this._editorScroll = true
      const height = this.$refs.preview.scrollHeight - this.$refs.preview.clientHeight
      const ratio = parseFloat(this.$refs.preview.scrollTop) / height
      const lineHeight = this.editor.renderer.lineHeight
      const scrollTop = (this.editSession.getScreenLength() * lineHeight - clientHeight) * ratio
      if (scrollTop < 0) return
      this.editSession.setScrollTop(scrollTop)
    },
    initEditorSyncScollerFn () {
      this.editSession.on('changeScrollTop', this._editorSyncScoller)
      this.$refs.preview.addEventListener('scroll', this._previewSyncScoller)
    },
    editorResizeFn() {
      setTimeout(() => {
        this.editor.resize(true)
      }, 10)
    },
    /* 绑定快捷键 */
    InitKeybindingsFn () {
      for (const action in keybindings) {
        if (!this[action] || typeof this[action] !== 'function') {
          console.error(action, 'is not found')
          continue
        }
        this.editor.commands.addCommand({
          name: action,
          bindKey: keybindings[action],
          exec: this[action]
        })
      }
    },
    clickToSubmitFn () {
      const preview = this.$refs.preview
      const firstp = preview.querySelector('p')
      const description = firstp ? firstp.innerHTML.replace(/<[^>]+>/g, '') + '...' : ''
      this.$emit('submit', {
        source: this.source, html: this.html, title: this.articleTitle, description,
      })
    },
    clickTotogglePreviewFn () {
      this.togglePreview = !this.togglePreview
      this.editorResizeFn()
    },
    editorSave (auto = false) {
      clearInterval(this.saveTimer)
      this.$emit('save', {
        source: this.source, title: this.articleTitle, html: this.html, auto: this.isAutoSave,
      })
      this.isAutoSave = false
    },
    showTipsFn () {
      this.visibleTips = true
    },
    hideTipsFn () {
      this.visibleTips = false
    },
    $insertImage (url) {
      this.insertImage(url)
    },
    ...bindingMethods,
  },
}
</script>

<style lang="scss" socped>
@import "styles/editor.scss";
@import "styles/theme.scss";
@import "styles/markdown.scss";
</style>
