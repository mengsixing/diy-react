// 渲染组件[原生html|react组件]
function renderComponent(element) {
  var fragment = document.createDocumentFragment();
  // 原生html标签
  if (typeof (element.type) === 'string') {
    var domElement = document.createElement(element.type);
    for (var item of element.props.children) {
      if (typeof (item) === 'string') {
        domElement.appendChild(document.createTextNode(item));
      } else{
        domElement.appendChild(renderComponent(item));
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
    mountNode.appendChild(renderComponent(element));
  }
}
