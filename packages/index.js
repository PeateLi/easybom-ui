import EProgress from './Progress/index.js';
const components = [
    EProgress,
  ]
  
  const install = function(Vue) {
    if (install.installed) return
    components.map(component => Vue.component(component.name, component))
    MetaInfo.install(Vue)
    Vue.prototype.$loading = WLoadingBar
  }
  
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
  }
  
  export default {
    install,
    ...components
  }