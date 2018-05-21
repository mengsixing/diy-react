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
  console.log('zhexie:', vdom.type);
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
        dom.setAttribute(vdomAttrs[i], styleObjectToString(vdom.props[vdomAttrs[i]]));
      }
    }
  }
}

// 比较子节点
function diffChildren(vdom, dom) {
  // 有删除节点
  // if(dom.length>vdom.length){
    
  // }

  // var vdomTypes= vdom.map((item)=>{
  //   return item.type || item;
  // })
  // dom.forEach((domItem,index)=>{
  //   var domType=domItem.nodeType===1 
  //   if(domItem.nodeType===1&& !vdomTypes.includes(domItem.tagName.toLowerCase())){
  //     domItem.parentNode.removeChild(domItem);
  //   }
  // });
  
  for (var i = 0; i < vdom.length; i++) {
    // 遍历多的vdom或dom
    // 如果dom多，就删掉多余的dom
    // 如果vdom多，就增加不够的dom
    if(dom[i]){

    }else{

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
    if(typeof vdom[i] === 'boolean' && !vdom[i]){
      dom[i].parentNode.removeChild(dom[i]);
    }
  }
}
