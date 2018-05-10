
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = {};
}

function createElement(type, config, children) {
  var propName = void 0;
  var props = {};
  var self = null;
  var source = null;

  if (config != null) {
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 将剩余属性添加到新的props对象中
    for (propName in config) {
      if (hasOwnProperty.call(config, propName)) {
        props[propName] = config[propName];
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
    }
    {
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
  return ReactElement(type, self, source, false, props);
}

function ReactElement(type, self, source, owner, props) {
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
