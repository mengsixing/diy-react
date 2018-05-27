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
        if (item) {
          var dom = _render(item, htmlTag);
          htmlTag.appendChild(dom);
        }
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
          let styleString = styleObjectToString(element.props[propName]);
          htmlTag[propName] = styleString;
          continue;
        }
        if (propName.match(/on[A-Z]\w+/)) {
          htmlTag[propName.toLowerCase()] = element.props[propName];
          continue;
        }
        htmlTag[propName] = element.props[propName];
      }
    }
    return mountNode.appendChild(htmlTag);
  }

  // react组件
  if (typeof element.type === "function") {
    // 直接new一个新的子react组件（应该使用以前的）
    var component = new element.type(element.props);
    return renderComponent(component);
  }

  // 文本节点
  if (typeof element === "string" || typeof element === "number") {
    return document.createTextNode(element);
  }

  // children集合
  if (Array.isArray(element)) {
    var result = document.createDocumentFragment();
    element.forEach(item => {
      result.appendChild(_render(item));
    });
    return result;
  }
}

// 渲染react组件
function renderComponent(component) {
  let base;
  if (component.isPureReactComponent && component.shouldComponentUpdate) {
    throw "如果使用PureReactComponent,不能再使用shouldComponentUpdate声明周期";
  }
  // 非首次渲染
  if (component.base) {
    let isUpdate = true;
    if (component.isPureReactComponent) {
      isUpdate = !shallowEqual(component.props, component.preProps) ||
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
    const renderedVdom = component.render();
    // diff 算法
    base = diff(renderedVdom, component.base);
    // 声明周期componentDidUpdate
    component.componentDidUpdate &&
      component.componentDidUpdate(component.preProps, component.preState);
  } else {
    // 首次渲染
    // getDerivedStateFromProps生命周期
    if(component.constructor.getDerivedStateFromProps){
      component.state=component.constructor.getDerivedStateFromProps(component.props,component.state);
    }
    const rendered = component.render();
    base = _render(rendered);
    // componentDidMount生命周期
    component.componentDidMount && setTimeout(() => {
      component.componentDidMount()
    }, 0);
  }
  // 绑定dom到component
  component.base = base;
  return base;
}

var ReactDOM = {
  render(vdom, rootNode) {
    var result = diff(vdom);
    rootNode.appendChild(result);
  }
};
