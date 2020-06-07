import Vue from 'vue'
import app from '@app'

Vue.config.productionTip = false

new Vue({
  el: '#root',
  render: h => h(app),
})
