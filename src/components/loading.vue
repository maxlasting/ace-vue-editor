<template>
  <div class="ace_editor_loading">
    <span v-for="item in 5" :key="item"></span>
  </div>
</template>

<style lang="scss">
.ace_editor_loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 20px;
  margin-bottom: 30px;

  span {
    height: 100%;
    display: inline-block;
    width: 8px;
    border-radius: 4px;
    background: lightgreen;
    animation: loading 1s ease infinite;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.4s;
  }
  span:nth-child(4) {
    animation-delay: 0.6s;
  }
  span:nth-child(5) {
    animation-delay: 0.8s;
  }

  @keyframes loading {
    0%,
    100% {
      height: 20px;
      background: lightgreen;
    }
    50% {
      height: 40px;
      margin: -15px 0;
      background: lightblue;
    }
  }
}
</style>
