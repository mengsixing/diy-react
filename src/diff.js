/**
 * diff 算法
 * 原理：将vdom和真实dom比较，如果有区别，就更新真实dom
 */

function diff(vdom, dom) {
  // 初始化，直接渲染
  if(!dom){
    return _render(vdom);
  }
  // 更新时，做比较
  // ...
}
