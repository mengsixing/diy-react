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
function diffNode(vdom, dom) {
  // 比较标签名
  if (vdom.type === dom.tagName.toLowerCase()) {
    // 比较标签属性
    diffAttribute(vdom, dom);
    // 比较children
    diffChildren(vdom.props.children, dom.childNodes);
  } else if (dom._component.constructor == vdom.type) {
    // 相同组件
    diffComponent(vdom, dom._component.base);
  } else {
    // 标签不一致，直接替换节点
    return _render(vdom);
  }
  return dom;
}

function diffComponent(component, dom) {
  var vdom = new component.type(component.props).render();
  diffNode(vdom, dom);
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
        dom.setAttribute(vdomAttrs[i], styleObjectToString(vdom.props[vdomAttrs[i]]));
      }
    }
  }
}

// 比较子节点
function diffChildren(vdom, dom) {
  // 遍历多的vdom或dom
  // 如果dom多，就删掉多余的dom
  // 如果vdom多，就增加不够的dom
  var maxLen = vdom.length > dom.length ? vdom.length : dom.length;
  for (var i = 0; i < maxLen; i++) {
    // vdom不存在,删除dom
    if (!vdom[i] && typeof vdom[i] !== 'boolean') {
      dom[i].parentNode.removeChild(dom[i]);
      continue;
    }
    // dom不存在,增加dom
    if (!dom[i] && typeof vdom[i] !== 'boolean') {
      dom[0].parentNode.appendChild(_render(vdom[i]));
      continue;
    }
    // vdom文本节点
    if (typeof vdom[i] === 'string' || typeof vdom[i] === 'number') {
      // 如果原dom存在(替换)，不存在，则删除
      if (dom[i].nodeType === 3) {
        if (vdom[i].toString() === dom[i].textContent) {
          continue;
        } else {
          dom[i].textContent = vdom[i];
        }
      } else {
        var textNode = document.createTextNode(vdom[i]);
        dom[i].parentNode.replaceChild(textNode, dom[i]);
      }
    }
    // react 节点
    if (typeof vdom[i] === 'object') {
      // 如果原节点是text节点，直接替换
      if (dom[i].nodeType === 3) {
        var render_dom = _render(vdom[i]);
        dom[i].parentNode.replaceChild(render_dom, dom[i]);
        vdom[i].base = render_dom;
      } else {
        diffNode(vdom[i], dom[i]);
      }
    } else {
      var textNode = document.createTextNode(vdom[i]);
      dom[i].parentNode.replaceChild(textNode, dom[i]);
    }
    // 如果表达式为空，就删除dom
    if (typeof vdom[i] === 'boolean' && (!vdom[i] && typeof vdom[i] !== 'boolean')) {
      dom[i].parentNode.removeChild(dom[i]);
    }
  }
  // 如果表达式为空，就删除dom
  if (typeof vdom[i] === 'boolean' && !vdom[i]) {
    dom[i].parentNode.removeChild(dom[i]);
  }
}
