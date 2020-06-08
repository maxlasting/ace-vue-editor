<template>
  <div class="__ace_editor_tips__">
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
        <span>插入表格</span>
        <span>Ctrl / Command + Alt + T</span>
      </li>
      <li class="list__item">
        <span>插入代码</span>
        <span>Ctrl / Command + Shift + C</span>
      </li>
      <li class="list__item">
        <span>行内代码</span>
        <span>Ctrl / Command + Alt + C</span>
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
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.__ace_editor_tips__ {
  height: 100%;
  width: 100%;
  .title {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
  }
  .list {
    list-style: square;
    padding: 0;
    padding-left: 24px;
  }
  .list .list__item {
    padding: 4px 0;
    span + span {
      margin-left: 16px;
    }
  }
  .list .list__item + .list__item {
    margin-top: 4px;
  }
}
</style>
