## 组件渲染生命周期

上文说道diff在处理react组件时，会调用Component.render方法生成vdom，我们详细来说明一下

## renderComponent

这里采用renderComponent方法来处理组件渲染。

首次渲染，直接创建dom返回。

触发生命周期：

* componentDidMount

``` js
  const rendered = component.render();
  base = _render(rendered, parentNode);
  // 绑定dom到component
  component.base = base;
  // 声明周期componentDidUpdate
  component.componentDidMount && component.componentDidMount();
  return base;
```

非首次渲染，则执行更新策略。

触发生命周期：

* shouldComponentUpdate
* componentDidUpdate


``` js
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
    const renderedVdom = component.render();
    // diff 算法
    base = diff(renderedVdom, component.base);
    // 声明周期componentDidUpdate
    component.componentDidUpdate &&
      component.componentDidUpdate(component.preProps, component.preState);
    // 绑定dom到component
    component.base = base;
    return base;
  }
```

