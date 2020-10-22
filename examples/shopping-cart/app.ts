import Vue from 'vue'
import App from './components/App.vue'
import { currency } from './currency'

Vue.filter('currency', currency)

new Vue({
  el: '#app',
  render: h => h(App)
})
