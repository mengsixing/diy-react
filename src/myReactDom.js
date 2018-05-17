/**
 * ReactDOM
 */

// 将vdom转换成真实dom
function _render(element) {
  var mountNode = document.createDocumentFragment();
  
  // 原生html标签
  if (typeof element.type === "string") {
    var htmlTag = document.createElement(element.type);
    for (var item of element.props.children) {
      //文本节点
      if (typeof item === "string" || typeof item === "number") {
        htmlTag.appendChild(document.createTextNode(item));
      } else {
        // react 组件
        var dom=_render(item, htmlTag);
        htmlTag.appendChild(dom);
      }
    }
    //绑定属性和事件
    for (propName in element.props) {
      if (
        hasOwnProperty.call(element.props, propName) &&
        propName !== "children"
      ) {
        //区分属性类型：标签属性，style，className
        if (propName.match(/style/)) {
          // 转换成符合要求的style字段值
          let styleString = JSON.stringify(element.props[propName]);
          styleString = styleString
            .replace(/[\{\}\"]/g, "")
            .replace(/\,/g, ";")
            .replace(/([A-Z])/g, function(word) {
              return "-" + word.toLowerCase();
            });
          htmlTag[propName] = styleString;
          continue;
        }
        if (propName.match(/on[A-Z]\w+/)) {
          // htmlTag.addEventListener(
          //   propName.toLowerCase().substr(2),
          //   element.props[propName]
          // );
          // htmlTag.onclick=function(){
          //   alert(1);
          // }
          htmlTag[propName.toLowerCase()] = element.props[propName];
          continue;
        }
        htmlTag[propName] = element.props[propName];
      }
    }
    return mountNode.appendChild(htmlTag);
  }

  // 为react组件
  if (typeof element.type === "function") {
    var component = new element.type(element.props);
    return renderComponent(component, mountNode);
  }

  // 直接是一个文本节点
  if (typeof element === "string" || typeof element === "number") {
    return document.createTextNode(element);
  }

  // 可能是一个children集合
  if(Array.isArray(element)){
    var result=document.createDocumentFragment();
    element.forEach(item=>{
      result.appendChild(_render(item));
    });
    return result;
  }
}

// 渲染react组件
function renderComponent(component, parentNode) {
  let base;
  if (component.isPureReactComponent && component.shouldComponentUpdate) {
    throw "如果使用PureReactComponent,不能再使用shouldComponentUpdate声明周期";
  }
  // 非首次渲染
  if (component.base) {
    let isUpdate = true;
    if (component.isPureReactComponent) {
      isUpdate =
        !shallowEqual(component.props, component.preProps) ||
        !shallowEqual(component.state, component.preState);
    }
    if (component.shouldComponentUpdate) {
      isUpdate = component.shouldComponentUpdate(
        component.props,
        component.state
      );
    }
    // 阻值更新
    if (!isUpdate) {
      console.log("阻止更新");
      return;
    }
    const rendered = component.render();
    base = diff(rendered, component.base);
    // 这里直接使用了replaceChild，导致组件全部更新，采用dom diff算法可优化
    // component.base.parentNode.replaceChild(base, component.base);
    // 声明周期componentDidUpdate
    component.componentDidUpdate &&
      component.componentDidUpdate(component.preProps, component.preState);
  } else {
    // 首次渲染
    const rendered = component.render();
    base = _render(rendered, parentNode);
    // 声明周期componentDidUpdate
    component.componentDidMount && component.componentDidMount();
  }
  component.base = base;
  return base;
}

var ReactDOM = {
  render(vdom, rootNode) {
    var result = diff(vdom);
    rootNode.appendChild(result);
  }
};
