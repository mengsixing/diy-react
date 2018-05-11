// 渲染组件[原生html|react组件]
function renderComponent(element) {
  var fragment = document.createDocumentFragment();
  // 原生html标签
  if (typeof (element.type) === 'string') {
    var domElement = document.createElement(element.type);
    for (var item of element.props.children) {
      if (typeof (item) === 'string' || typeof (item) === 'number') {
        domElement.appendChild(document.createTextNode(item));
      } else {
        domElement.appendChild(renderComponent(item));
      }
    }

    //绑定属性和事件
    for (propName in element.props) {
      if (hasOwnProperty.call(element.props, propName) && propName!=='children') {
        //区分属性类型：标签属性，style，className
        if (propName.match(/style/)) {
          alert('获取到style属性');
          continue;
        }
        if (propName.match(/on[A-Z]\w+/)) {
          domElement.addEventListener(propName.toLowerCase().substr(2),element.props[propName]);
          continue;
        }
        domElement[propName] = element.props[propName];
      }
    }

    fragment.appendChild(domElement);
  }
  // react组件
  if (typeof element.type === 'function') {
    var domComplict = new element.type(element.props).render();
    var domElement = renderComponent(domComplict);
    fragment.appendChild(domElement);
  }
  return fragment;
}

var ReactDOM = {
  render(element, mountNode) {
    mountNode.innerHTML = '';
    mountNode.appendChild(renderComponent(element));
  }
}
