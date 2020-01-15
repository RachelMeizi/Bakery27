import Vue from 'vue'
import App from './App'
import Utils from './utils/util.js'
import store from './store'  

Vue.prototype.$store = store 
Vue.prototype.$util=Utils

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
