
## 初始化

Component -> DOM

## 入口点

我们使用React写出的各种组件，最后都会被挂载到页面上，ReactDOM.render 就是干这事的。

例：将Test组件挂载到id为root的节点上。

``` js
ReactDOM.render(<Test title="ben" />,document.getElementById('root'));
```

## jsx语法

<Test title="ben" /> 这种叫jsx写法,浏览器是不认识的，直接运行会报错，这里使用babel进行转换。

![babel转换](https://github.com/yhlben/diy-react/blob/master/docs/images/babel.png?raw=true)

可以看到，经过babel转换后的代码变为 React.createElement(Test, { title: "ben" });

## React.createElement

采用工厂模式，生成一个vdom。

``` js
function ReactElement(type, props) {
  var element = {
    $$typeof: Symbol["for"]("react.element"),
    type: type,
    props: props
  };
  return element;
}
```

## ReactDOM.render

diff是把虚拟dom转换为dom，而render则是将dom挂载到页面的rootNode节点上。

``` js
var ReactDOM = {
  render(vdom, rootNode) {
    var result = diff(vdom);
    rootNode.appendChild(result);
  }
};
```

diff方法在处理react组件时，会调用组件内部的render方法，生成虚拟dom，然后递归调用diff方法。如果html节点，就直接插入到dom。（后续会详细介绍diff算法）

``` js
  if (typeof element.type === "function") {
    var component = new element.type(element.props);
    return renderComponent(component, mountNode);
  }
  // ...html节点直接插入到dom中
```

## 结果

通过这几个关键步骤，就可以在页面中看到组件内容了。












