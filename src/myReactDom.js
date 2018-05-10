// 渲染真实dom
function renderDom(element) {
  var domElement = document.createElement(element.type);
  for (var item of element.props.children) {
    if (typeof (item) === 'string') {
      domElement.appendChild(document.createTextNode(item));
    }
    if (typeof (item.type) === 'string') {
      domElement.appendChild(renderDom(item));
    }
    if (typeof (item.type) === 'function') {
      var com = renderComponent(item);
      domElement.appendChild(com);
    }
  }
  return domElement;
}

// 渲染jsx对象
function renderComponent(element) {
  var fragment = document.createDocumentFragment();
  // 原生html标签
  if (typeof (element.type) === 'string') {
    var domElement = renderDom(element);
    fragment.appendChild(domElement);
  }
  // react组件
  if (typeof element.type === 'function') {
    var domComplict = new element.type(element.props).render();
    var domElement = renderDom(domComplict);
    fragment.appendChild(domElement);
  }
  return fragment;
}

var ReactDOM = {
  render(element, mountNode) {
    mountNode.appendChild(renderComponent(element));
  }
}
