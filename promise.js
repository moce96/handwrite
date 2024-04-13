console.log(123)

const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
  // 保存初始化状态
  var self = this;

  // 初始化状态
  this.state = PENDING;

  // 用于保存 resolve 或者 rejected 传入的值
  this.value = null;

  // 用于保存 resolve 的回调函数
  this.onFulfilledCallbacks = [];

  // 用于保存 reject 的回调函数
  this.onRejectedCallbacks = [];

  // 状态转变为 resolved 方法
  function resolve(value) {
    // 判断传入元素是否为 Promise 值，如果是，则状态改变必须等待前一个状态改变后再进行改变
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }

    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为 pending 时才能转变，
      if (self.state === PENDING) {
        // 修改状态
        self.state = RESOLVED;

        // 设置传入的值
        self.value = value;

        // 执行回调函数
        self.onFulfilledCallbacks.forEach(callback => {
          callback(value);
        });
      }
    }, 0);
  }

  // 状态转变为 rejected 方法
  function reject(value) {
    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为 pending 时才能转变
      if (self.state === PENDING) {
        // 修改状态
        self.state = REJECTED;

        // 设置传入的值
        self.value = value;

        // 执行回调函数
        self.onRejectedCallbacks.forEach(callback => {
          callback(value);
        });
      }
    }, 0);
  }

  // 将两个方法传入函数执行
  try {
    fn(resolve, reject);
  } catch (e) {
    // 遇到错误时，捕获错误，执行 reject 函数
    reject(e);
  }
}
//但是当resolve在setTomeout内执行，then时state还是pending等待状态 
//我们就需要在then调用的时候，将成功和失败存到各自的数组，一旦reject或者resolve，就调用它们

MyPromise.prototype.then = function(onResolved, onRejected) {
  onResolved = typeof onResolved === "function" ? onResolved : function(value) { return value; };
  onRejected = typeof onRejected === "function" ? onRejected : function(error) { throw error; };

  const self = this;
  console.log(self.state,'then-self-state')

  return new MyPromise((resolve, reject) => {
      let fulfilled = () => {
          try {
              const result = onResolved(self.value);
              return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
          } catch (err) {
              reject(err);
          }
      };

      let rejected = () => {
          try {
              const result = onRejected(self.value);
              return result instanceof MyPromise ? result.then(resolve, reject) : reject(result);
          } catch (err) {
              reject(err);
          }
      };

      if (self.state === PENDING) {
          self.onFulfilledCallbacks.push(fulfilled);
          self.onRejectedCallbacks.push(rejected);
      } else if (self.state === RESOLVED) {
          fulfilled();
      } else if (self.state === REJECTED) {
          rejected();
      }
  });
};







let simplePromise = new MyPromise((resolve, reject) => {
  console.log('mp')
    // setTimeout(() => {
      console.log('mpset')

      resolve("Success!");
    // }, 1000);
  });

  console.log('456')
  
  simplePromise.then(value => {
    console.log(value);  // 应该在一秒后打印 "Success!"
  });
  

  console.log('789')


