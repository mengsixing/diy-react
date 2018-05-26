// 异步setstate思路
// 创建2个数组
// 组件数组，放入即将被更新的组件
// newState数组，放入新的状态

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

