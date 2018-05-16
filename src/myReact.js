function Component(props) {
  this.props = props;
}
Component.prototype.setState = function (partialState, callback) {
  this.preProps = {...this.props};
  this.preState = {...this.state};
  // 源码中使用fiber机制来管理渲染，这里没做处理
  Object.assign(this.state, partialState);
  // base.parentNode 会在初始化组件后绑定到Component对象上
  renderComponent(this,this.base.parentNode);
};


// 中间类，用于继承
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

function PureComponent(props){
  this.props = props;
}

PureComponent.prototype=new ComponentDummy();
PureComponent.prototype.constructor = PureComponent;
PureComponent.prototype.isPureReactComponent=true;


function createElement(type, attr, children) {
  var propName = void 0;
  var props = {};
  if (attr != null) {
    // 将剩余属性添加到新的props对象中
    for (propName in attr) {
      if (hasOwnProperty.call(attr, propName)) {
        props[propName] = attr[propName];
      }
    }
  }

  // Children可以不止一个argument，那些被转移到新分配的prop对象。
  var childrenLength = arguments.length - 2;
  var childArray = Array(childrenLength);
  for (var i = 0; i < childrenLength; i++) {
    childArray[i] = arguments[i + 2];
  }
  props.children = childArray;

  // 默认props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  return ReactElement(type, props);
}

function ReactElement(type, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: Symbol['for']('react.element'),
    type: type,
    props: props,
  };
  return element;
};

var React = {
  Component,
  PureComponent,
  createElement
};
