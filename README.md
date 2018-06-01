# diy-react

手工做一个react。


## 相关文章

[step1-组件初始渲染](https://github.com/yhlben/diy-react/blob/master/docs/step1.md)

[step2-组件生命周期](https://github.com/yhlben/diy-react/blob/master/docs/step2.md)

[step3-diff算法](https://github.com/yhlben/diy-react/blob/master/docs/step3.md)

[step4-异步setState](https://github.com/yhlben/diy-react/blob/master/docs/step3.md)



## 疑问

1、在父组件重新渲染的时候，子组件现在会被全部替换，没有做更新操作？

答：diff算法的问题，这里diff和真实dom比较，所以不能判断之前的子组件。

## todolist

* [x] ReactDOM.render
* [x] React.createElement
* [x] React.Component
* [x] Component.prototype.setState
* [x] Component.shouldComponentUpdate
* [x] React.PureComponent
* [x] Diff算法
    * [x] 属性比较
    * [x] 节点比较
    * [x] 子节点比较
* [x] Async SetState

