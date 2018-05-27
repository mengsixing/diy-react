## diff算法

每当组件更新时，都会重新更新dom，为了减少dom更新，我们需要找出真正改变的dom。

diff算法其实就是找出最小差异。

这里的dom算法采用同层比较dom和vdom，找出差异，直接更新的方法。

整体思路：以vdom为基准，对比真实dom，从左向右，依次比较，发现节点不对，立即替换。

## 比较dom节点

1、比较标签名

2、比较标签属性

3、比较子节点

``` js
// 比较节点
function diffNode(vdom, dom) {
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

```

## 比较属性

1、根据vdom的长度去修改真实dom

``` js
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
```


## 比较子节点

1、判断vdom和dom长度是否相等，找出长度最大的length

2、根据该长度遍历vdom，如果dom多，就删掉多余的dom，如果vdom多，就增加不够的dom

3、文本节点，直接替换

4、react节点，调用render后，调用比较节点方法

``` js
// 比较子节点
function diffChildren(vdom, dom) {
    // 遍历多的vdom或dom
    // 如果dom多，就删掉多余的dom
    // 如果vdom多，就增加不够的dom
    var maxLen=vdom.length>dom.length?vdom.length:dom.length;
    for (var i = 0; i < maxLen; i++) {
      // vdom不存在,删除dom
      if(!vdom[i] && typeof vdom[i] !=='boolean' ){
        dom[i].parentNode.removeChild(dom[i]);
        continue;
      }
      // dom不存在,增加dom
      if(!dom[i] && typeof vdom[i] !=='boolean'){
        dom[0].parentNode.appendChild(_render(vdom[i]));
        continue;
      }
      // vdom文本节点
      if(typeof vdom[i] ==='string'||typeof vdom[i] ==='number'){
        // 如果原dom存在(替换)，不存在，则删除
          if(dom[i].nodeType === 3){
            if(vdom[i].toString()===dom[i].textContent){
              continue;
            }else{
              dom[i].textContent=vdom[i];
            }
          }else{
            var textNode=document.createTextNode(vdom[i]);
            dom[i].parentNode.replaceChild(textNode,dom[i]);
          }
      }
      // react 节点
      if (typeof vdom[i] === 'object') {
        // 如果原节点是text节点，直接替换
        if(dom[i].nodeType===3){
          var render_dom=_render(vdom[i]);
          dom[i].parentNode.replaceChild(render_dom,dom[i]);
          vdom[i].base=render_dom;
        }else{
          diffNode(vdom[i],dom[i]);
        }
      }
      // 如果表达式为空，就删除dom
      if(typeof vdom[i] === 'boolean' && (!vdom[i] && typeof vdom[i] !=='boolean' )  ){
        dom[i].parentNode.removeChild(dom[i]);
      }
    }
}
```
