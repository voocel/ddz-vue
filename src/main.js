import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueNativeSock from 'vue-native-websocket'
import 'element-ui/lib/theme-chalk/index.css'
import '@/permission' // permission control
import Common from '@/utils/common.js'
import VCI from 'vue-component-inspector'

Vue.prototype.$common = Common
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(VueNativeSock, 'ws://' + process.env.VUE_APP_SOCKET_URL + ':' + process.env.VUE_APP_SOCKET_PORT, {
  format: 'json',
  connectManually: true
  // reconnection: true,
  // reconnectionAttempts: 5,
  // reconnectionDelay: 3000
})
const options = {
  noInspect: ['ElPagination', 'ElDialog', 'ElAutocomplete', 'ElDropdown', 'ElDropdownMenu', 'ElDropdownItem', 'ElMenu', 'ElSubmenu', 'ElMenuItem', 'ElMenuItemGroup', 'ElInput', 'ElInputNumber', 'ElRadio', 'ElRadioGroup', 'ElRadioButton', 'ElCheckbox', 'ElCheckboxButton', 'ElCheckboxGroup', 'ElSwitch', 'ElSelect', 'ElOption', 'ElOptionGroup', 'ElButtonGroup', 'ElTable', 'ElTableColumn', 'ElDatePicker', 'ElTimeSelect', 'ElTimePicker', 'ElPopover', 'ElTooltip', 'ElBreadcrumb', 'ElBreadcrumbItem', 'ElForm', 'ElFormItem', 'ElTabs', 'ElTabPane', 'ElTag', 'ElTree', 'ElAlert', 'ElSlider', 'ElIcon', 'ElRow', 'ElCol', 'ElUpload', 'ElProgress', 'ElSpinner', 'ElBadge', 'ElCard', 'ElRate', 'ElSteps', 'ElStep', 'ElCarousel', 'ElScrollbar', 'ElCarouselItem', 'ElCollapse', 'ElCollapseItem', 'ElCascader', 'ElColorPicker', 'ElTransfer', 'ElContainer', 'ElHeader', 'ElAside', 'ElMain', 'ElFooter', 'ElTimeline', 'ElTimelineItem', 'ElLink', 'ElDivider', 'ElImage', 'ElCalendar', 'ElBacktop', 'ElPageHeader', 'ElCascaderPanel', 'ElAvatar', 'ElDrawer', 'ElPopconfirm', 'ElCollapseTransition', 'ElTreeNode', undefined, 'SvgIcon', 'SidebarItem', 'ElTableBody', 'ElTableHeader', 'ElSelectDropdown']
}
Vue.use(VCI, options)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
