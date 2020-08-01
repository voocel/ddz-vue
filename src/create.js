import Vue from 'vue'

function create(Component, props) {
  // 1.创建Vue实例,Component是当前组件实例的根组件
  const vm = new Vue({
    // 1.1 render：虚拟DOM的实现
    // 1.2 h是createElement别名，返回虚拟DOM[VNode]
    // 1.3 参数props是要传递给Component的参数，{props: props, on: {click:onClick}}
    // 比如：<Component title content/>
    render: h => h(Component, {
      props
    })
    // 1.4 $mount()会把上面生成的VNode转化成真是DOM，并挂载到目标节点上
    // 若不指定选择器，会执行转化过程，只是不挂载
  }).$mount()

  // 2.手动挂载：使用原生dom api把它插入文档中
  // 2.1 vm.$el：真实dom元素
  document.body.appendChild(vm.$el)

  // 3.回收：防止内存泄漏
  // 3.1 vm.$children[0]获取组件实例
  const comp = vm.$children[0]
  comp.remove = () => {
    document.body.removeChild(vm.$el)
    comp.$destroy()
  }

  return comp
}

export default create
