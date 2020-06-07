const Command = 'Cmd'
const Shift = 'Shift'
const Alt = 'Alt'

function createKeyBinding(keys) {
  const keybinding = keys.join('-')
  return {
    win: keybinding.replace('Cmd', 'Ctrl'),
    mac: keybinding
  }
}

// action: keybinding
export const keybindings = {
  'toggleBold': createKeyBinding([Command, 'B']),
  'toggleItalic': createKeyBinding([Shift, Command, 'I']),
  'toggleHeading': createKeyBinding([Command, 'H']),
  'toggleStrikeThrough': createKeyBinding([Shift, Command, 'S']),
  'toggleBlockquote': createKeyBinding([Command, '.']),
  'toggleUnorderedList': createKeyBinding([Command, 'L']),
  'toggleOrderedList': createKeyBinding([Command, Alt, 'L']),
  'insertImage': createKeyBinding([Command, 'I']),
  'insertLink': createKeyBinding([Command, 'K']),
  'insertTable': createKeyBinding([Command, Alt, 'T']),
  'insertCode': createKeyBinding([Command, Shift,  'C']),
  'editorSave': createKeyBinding([Command, 'S'])
}

export const bindingMethods = {
  _moveCursor(row, column) {
    this.editor.moveCursorTo(row, column)
    this.editor.focus()
  },
  /* Ctrl/Cmd-B */
  toggleBold () {
    const selection = this.editor.getSelection()
    if (!selection.isEmpty()) {
      const range = selection.getRange()
      const text = this.editSession.getTextRange(range)
      this.editSession.replace(range, `**${text}**`)
      selection.clearSelection()
      return
    }
    const { row, column } = selection.getCursor()
    this.editor.insert('****')
    this._moveCursor(row, column + 2)
  },
  /* Shift-Ctrl/Cmd-I */
  toggleItalic () {
    const selection = this.editor.getSelection()
    if (!selection.isEmpty()) {
      const range = selection.getRange()
      const text = this.editSession.getTextRange(range)
      this.editSession.replace(range, `*${text}*`)
      return
    }
    const position = selection.getCursor()
    this.editor.insert('**')
    this._moveCursor(position.row, position.column + 1)
  },
  /* Shift-Ctrl/Cmd-S */
  toggleStrikeThrough() {
    const selection = this.editor.getSelection()
    if (!selection.isEmpty()) {
      const range = selection.getRange()
      const text = this.editSession.getTextRange(range)
      this.editSession.replace(range, `~~${text}~~`)
      return
    }
    const position = selection.getCursor()
    this.editor.insert('~~~~')
    this._moveCursor(position.row, position.column + 2)
  },

  /* Ctrl/Cmd-H */
  toggleHeading() {
    const selection = this.editor.getSelection()
    const { row } = selection.getCursor()
    const lineText = this.editSession.getLine(row)
    const length = lineText.length
    const level = lineText.search(/[^#]/)
    // console.log(row, column, level, length)
    const range = {
      start: {
        row,
        column: 0
      },
      end: {
        row,
        column: length
      }
    }
    if (level >= 6) {
      return
    }
    const heading = level <= 0 ? '# ' : '#'
    this.editSession.replace(range, heading + lineText)
    this.editor.focus()
  },
  /* Ctrl/Cmd-. */
  toggleBlockquote() {
    const selection = this.editor.getSelection()
    const { row } = selection.getCursor()
    const lineText = this.editSession.getLine(row)
    const length = lineText.length
    const index = lineText.search(/[^>]/)
    // console.log(row, column, index, length)
    const range = {
      start: {
        row,
        column: 0
      },
      end: {
        row,
        column: length
      }
    }
    if (index <= 0) {
      this.editSession.replace(range, `> ${lineText}`)
    } else {
      this.editSession.replace(range, lineText.replace(/^(\s*)>\s+/, ''))
    }
    this.editor.focus()
  },

  /* Ctrl/Cmd-L */
  toggleUnorderedList() {
    const selection = this.editor.getSelection()
    const { row } = selection.getCursor()
    const lineText = this.editSession.getLine(row)
    const length = lineText.length
    const index = lineText.search(/[^\*]/)
    // console.log(row, column, index, length)
    const range = {
      start: {
        row,
        column: 0
      },
      end: {
        row,
        column: length
      }
    }
    if (index <= 0) {
      this.editSession.replace(range, `* ${lineText}`)
    } else {
      this.editSession.replace(range, lineText.replace(/^(\s*)\*\s+/, ''))
    }
    this.editor.focus()
  },

  /* Ctrl/Cmd-Alt-L */
  toggleOrderedList() {
    const selection = this.editor.getSelection()
    const { row } = selection.getCursor()
    const lineText = this.editSession.getLine(row)
    const length = lineText.length
    const index = lineText.search(/[^\d{1}]/)
    // console.log(row, column, index, length)
    const range = {
      start: {
        row,
        column: 0
      },
      end: {
        row,
        column: length
      }
    }
    if (index <= 0) {
      // follow last row order num
      // console.log(this.lastFocusRow, this.orderNum)
      if (this.lastFocusRow + 1 === row) {
        this.orderNum += 1
        this.lastFocusRow += 1
      } else {
        this.lastFocusRow = row
        this.orderNum = 1
      }
      this.editSession.replace(range, `${this.orderNum}. ${lineText}`)
    } else {
      this.lastFocusRow = row
      this.orderNum = 1
      this.editSession.replace(range, lineText.replace(/^(\s*)\d{1}\.\s+/, ''))
    }
    this.editor.focus()
  },
  /* Ctrl/Cmd-K */
  insertLink() {
    const selection = this.editor.getSelection()
    if (!selection.isEmpty()) {
      const range = selection.getRange()
      this.editSession.replace(range, '[]()')
      const { row, column } = selection.getSelectionAnchor()
      selection.clearSelection()
      this._moveCursor(row, column - 1)
      return
    }
    this.editor.insert('[]()')
    const { row, column } = selection.getSelectionAnchor()
    this._moveCursor(row, column - 1)
  },
  /* Ctrl/Cmd-I */
  insertImage(url) {
    let num = 0
    if (typeof url !== 'string') num = -1
    const selection = this.editor.getSelection()
    if (!selection.isEmpty()) {
      const range = selection.getRange()
      this.editSession.replace(range, `![](${typeof url === 'string' ? url : ''})`)
      const { row, column } = selection.getSelectionAnchor()
      selection.clearSelection()
      this._moveCursor(row, column + num)
      return
    }
    this.editor.insert(`![](${typeof url === 'string' ? url : ''})`)
    const { row, column } = selection.getSelectionAnchor()
    this._moveCursor(row, column + num)
  },
  /* Ctrl/Cmd-Shift-C */
  insertCode() {
    const code = '\n' +
    '```\n\n' +
    '```'
    const selection = this.editor.getSelection()
    if (!selection.isEmpty()) {
      const range = selection.getRange()
      this.editSession.replace(range, code)
      const { row, column } = selection.getSelectionAnchor()
      selection.clearSelection()
      this._moveCursor(row - 2, column + 3)
      return
    }
    this.editor.insert(code)
    const { row, column } = selection.getSelectionAnchor()
    this._moveCursor(row - 2, column + 3)
  },
  /* Ctrl/Cmd-Alt-T */
  insertTable() {
    const table = '\n\n' +
    '| Column 1 | Column 2 | Column 3 |\n' +
    '| -------- | -------- | -------- |\n' +
    '| Text     | Text     | Text     |\n'
    const selection = this.editor.getSelection()
    if (!selection.isEmpty()) {
      const range = selection.getRange()
      this.editSession.replace(range, table)
      selection.clearSelection()
      this.editor.focus()
      return
    }
    this.editor.insert(table)
    this.editor.focus()
  },
}
