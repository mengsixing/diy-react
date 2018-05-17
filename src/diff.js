/**
 * diff 算法
 * 原理：将vdom和真实dom比较，如果有区别，就更新真实dom
 */

function diff(vdom, dom) {
  // 初始化，直接渲染
  if (!dom) {
    return _render(vdom);
  }
  return diffNode(vdom, dom);
}

// 比较节点
function diffNode() {
  // 比较标签名
  if (vdom.type === dom.tagName.toLowerCase()) {
    // 比较标签属性
    diffAttribute(vdom, dom);
    // 比较children
    diffChildren(vdom.props.children, dom.childNodes);
  } else {
    // 标签不一致，直接替换节点
    return _render(vdom);
  }
  return dom;
}

// 比较属性
function diffAttribute(vdom, dom) {
  var domAttrs = dom.getAttributeNames();
  var vdomAttrs = Object.keys(vdom.props).filter(item => item != 'children' && !item.match(/on[A-Z]\w+/));
  // 比较标签属性长度
  if (domAttrs.length !== vdomAttrs.length) {
    vdomAttrs.forEach(propName => {
      dom.setAttribute(propName, vdom.props[propName]);
    });
  } else {
    // 遍历vdom，若发现不相等，就直接更新属性
    for (var i = 0; i < vdomAttrs.length; i++) {
      // 新增属性
      if (!hasOwnProperty.call(domAttrs, vdomAttrs[i])) {
        dom.setAttribute(vdomAttrs[i], vdom.props[vdomAttrs[i]]);
      }
    }
  }
}

// 比较子节点
function diffChildren(vdom, dom) {
  for (let node of vdom) {
    // 文本节点
    if (typeof node === 'string') {
      if ()
    }
    if (typeof node === 'function') {
      console.log('发现react节点');
    }
  }
  for (let index = 0; index < vdom.length; index++) {
    dom[index].textContent = vdom[index];
  }
}
