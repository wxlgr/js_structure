const PENDING = "pending";
const FULLFILLED = "fullfilled";
const REJECTED = "rejected";

class MyPromise {
  state = "pending";
  result = void 0;
  #handlers = [];
  constructor(executor) {
    const resolve = (data) => {
      this.#changeState(FULLFILLED, data);
    };
    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  //   改变状态
  #changeState(state, result) {
    if (this.state !== PENDING) return;
    this.state = state;
    this.result = result;
    this.#run();
  }
  //  判断是否符合Promise A+规范 含有then 方法
  #isPromiseLike(p) {
    if (typeof p === "object" || typeof p === "function") {
      return typeof p.then === "function";
    }
    return false;
  }
  //  以微任务执行一个回调
  #runMicroTask(func) {
    // node环境
    if (typeof process?.nextTick === "function") {
      process.nextTick(func);
    }
    // 浏览器
    else if (typeof MutationObserver == "function") {
      const ob = new MutationObserver(func);
      const textNode = document.createTextNode("1");
      // 监控文本节点的字符数据变化
      ob.observe(textNode, {
        characterData: true,
      });
      textNode.data = "2";
    } else {
      setTimeout(func, 0);
    }
  }
  //  执行一个回调
  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== "function") {
        const settled = this.state === FULLFILLED ? resolve : reject;
        settled(this.result);
        return;
      }
      try {
        const data = callback(this.result);
        if (this.#isPromiseLike(data)) {
          data.then(resolve, reject);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  //   状态改变时执行回调函数
  #run() {
    if (this.state === PENDING) return;

    while (this.#handlers.length) {
      const { onFullfilled, onRejected, resolve, reject } =
        this.#handlers.shift();
      if (this.state === FULLFILLED) {
        this.#runOne(onFullfilled, resolve, reject);
      } else if (this.state === REJECTED) {
        this.#runOne(onRejected, resolve, reject);
      }
    }
  }

  then(onFullfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handlers.push({ onFullfilled, onRejected, resolve, reject });
      this.#run();
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(OnFinally) {
    return this.then(
      (data) => {
        OnFinally();
        return data;
      },
      (err) => {
        OnFinally();
        throw err;
      }
    );
  }
  static resolve(value) {
    let _resolve, _reject;
    const p = new MyPromise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    if (p.#isPromiseLike(value)) {
      value.then(_resolve, _reject);
    } else {
      _resolve(value);
    }
    return p;
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

const p1 = new MyPromise((resolve, reject) => {
  resolve(1);
});
MyPromise.resolve(p1).then((data) => {
  console.log(data);
});
MyPromise.reject(111)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("error: " + err);
  })
  .finally(() => {
    console.log("finally");
  });
