function Component(props) {
  this.props = props;
}

Component.prototype.setState = function (partialState, callback) {
  // 源码中使用fiber机制来管理渲染
  Object.assign( this.state, partialState );
  
  ReactDOM.render(this.render(),document.getElementById('root'));
};

function createElement(type, attr, children) {
  var propName = void 0;
  var props = {};
  if (attr != null) {
    // 将剩余属性添加到新的props对象中
    for (propName in attr) {
      if (hasOwnProperty.call(attr, propName) ) {
        props[propName] = attr[propName];
      }
    }
  }

  // Children可以不止一个argument，那些被转移到新分配的道具对象。
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    } {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // 解决默认props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  return ReactElement(type, false, props);
}

function ReactElement(type, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: Symbol['for']('react.element'),
    // Built-in properties that belong on the element
    type: type,
    props: props,
    // 记录负责创建此元素的组件。
    _owner: owner
  }; 
  {
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }
  return element;
};

var React = {
  Component,
  createElement
};
