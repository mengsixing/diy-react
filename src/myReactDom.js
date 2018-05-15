// 渲染组件[原生html|react组件]
function _render(element, mountNode) {

  // 根节点为原生html标签
  if (typeof (element.type) === 'string') {
    var htmlTag = document.createElement(element.type);
    for (var item of element.props.children) {
      //文本节点
      if (typeof (item) === 'string' || typeof (item) === 'number') {
        htmlTag.appendChild(document.createTextNode(item));
      } else {
        // react 组件
        htmlTag.appendChild(_render(item, htmlTag));
      }
    }
    //绑定属性和事件
    for (propName in element.props) {
      if (hasOwnProperty.call(element.props, propName) && propName !== 'children') {
        //区分属性类型：标签属性，style，className
        if (propName.match(/style/)) {
          alert('获取到style属性');
          continue;
        }
        if (propName.match(/on[A-Z]\w+/)) {
          htmlTag.addEventListener(propName.toLowerCase().substr(2), element.props[propName]);
          continue;
        }
        htmlTag[propName] = element.props[propName];
      }
    }
    return mountNode.appendChild(htmlTag);
  }

  // 根节点为react组件
  if (typeof element.type === 'function') {
    var component = new element.type(element.props);
    return renderComponent(component, mountNode);
  }

}

function renderComponent(component, parentNode) {
  let base;
  // 非首次渲染
  if (component.base) {
    if (component.shouldComponentUpdate) {
      var isUpdate = component.shouldComponentUpdate(component.props, component.state);
      if (!isUpdate) {
        return;
      }
    }
    const rendered = component.render();
    base = _render(rendered, parentNode);
    component.base.parentNode.replaceChild(base, component.base);
    // 声明周期componentDidUpdate
    component.componentDidUpdate && component.componentDidUpdate(component.preProps, component.preState);
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
  render(element, mountNode) {
    mountNode.appendChild(_render(element, mountNode));
  }
}
