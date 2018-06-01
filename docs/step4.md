## 异步setState

上一篇文章中，采用diff算法，可以保证组件每次更新都是最小更新，但是每次setState都会触发一次diff算法。

如果碰到这种场景：

``` js
for ( let i = 0; i < 100; i++ ) {
    this.setState( { num: this.state.num + 1 } );
}
```

react组件会被渲染100次，调用100次diff算法，这对性能是一个很大的负担。


## 解决方案

对于同一个组件，只需要把多个setState合并为一个，最后去调用一次diff渲染，就可以了。

我们可以定义一个更新队列，在一个更新周期内，将队列中的setState取出进行合并，然后调用diff算法进行渲染。


实现方法：

``` js
// 创建2个数组
// setStateQueue[]，放入所有需要更新的组件和newState
// renderQueue[]，放入需要更新的组件，无重复

const setStateQueue = [];
const renderQueue = [];
function enqueueSetState(partialState,component){
  // 等待上一个周期执行完，再执行下一个周期
  if(renderQueue.length==0){
    setTimeout(()=>{
      batchUpdate();
    },0);
  }
  setStateQueue.push({
    component,
    partialState
  });

  // 每个组件只更新一次
  if(!renderQueue.includes(component)){
    renderQueue.push(component);
  }
  
}
```


批量更新时，先把state合并到component.state上，然后选混更新所有组件

``` js

// 批量更新
function batchUpdate(){
  // 合并setStateQueue中的值
  setStateQueue.map((item)=>{
    // setState为一个对象
    if(typeof (item.partialState)==='object'){
      Object.assign( item.component.state,item.partialState);
    }
    // setState为一个函数
    if(typeof (item.partialState)==='function'){
      var newState= item.partialState(item.component.state);
      Object.assign( item.component.state,newState);
    }

  });
  var item =renderQueue.shift();
  while(item){
    renderComponent(item,item.base.parentNode);
    item =renderQueue.shift();
  }
}

```


