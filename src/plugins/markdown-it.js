import MarkdownIt from 'markdown-it'
import highlight from 'markdown-it-highlightjs'
import emoji from 'markdown-it-emoji'
import ins from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import footnote from 'markdown-it-footnote'
import sup from 'markdown-it-sup'
import sub from 'markdown-it-sub'
import todo from 'markdown-it-task-lists'

const markdown = new MarkdownIt({
  html: true,
  xhtmlout: true,
  breaks: true,
  langPrefix: 'language-',
  linkify: true,
  typographer: true,
})

markdown
  .use(highlight)
  .use(emoji)
  .use(ins)
  .use(mark)
  .use(footnote)
  .use(sup)
  .use(sub)
  .use(todo, { label: true })

export default markdown
