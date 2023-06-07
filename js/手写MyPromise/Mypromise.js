const PENDING = "pending";
const REJECTED = "rejected";
const FULLFILELD = "fullfilled";

class MyPromise {
  #state = PENDING;
  #result = void 0;
  #handlers = [];
  constructor(executor) {
    const resolve = (data) => {
      this.#changeState(FULLFILELD, data);
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
  #changeState(state, res) {
    if (this.#state !== PENDING) return;
    this.#state = state;
    this.#result = res;
    this.#run();
  }
  #isPromiseLike(p) {
    // 满足Promise A+规范即可
    if (typeof p === "object" || typeof p === "function") {
      return typeof p.then === "function";
    }
    return false;
  }

  //  运行微任务
  #runMicroTask(func) {
    if (typeof process === "object" && typeof process.nextTick === "function") {
      process.nextTick(func);
    } else if (typeof MutationObserver === "function") {
      const ob = new MutationObserver(func);
      const textNode = document.createTextNode("1");
      ob.observe(textNode, {
        characterData: true,
      });
      textNode.data = "2";
    } else {
      setTimeout(func, 0);
    }
  }
  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== "function") {
        const settled = this.#state === FULLFILELD ? resolve : reject;
        settled(this.#result);
        return;
      }
      try {
        const data = callback(this.#result);
        if (this.#isPromiseLike(data)) {
          data.then(resolve, reject);
        } else {
          resolve(data);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  #run() {
    if (this.#state === PENDING) return;
    while (this.#handlers.length) {
      const { onFullfilled, onRejected, resolve, reject } =
        this.#handlers.shift();
      if (this.#state === FULLFILELD) {
        this.#runOne(onFullfilled, resolve, reject);
      } else if (this.#state === REJECTED) {
        this.#runOne(onRejected, resolve, reject);
      }
    }
  }

  then(onFullfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handlers.push({
        onFullfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (data) => {
        onFinally();
        return data;
      },
      (err) => {
        onFinally();
        throw err;
      }
    );
  }
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    let _resolve, _reject;
    const p = new MyPromise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    if(p.#isPromiseLike(value)) {
      value.then(_resolve, _reject);
    }else{
      _resolve(value)
    }
    return p
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
}

const p = new MyPromise((resolve,reject)=>{
  resolve(1)
})
MyPromise.resolve(p).then(data=>{
  console.log(data)
  
})
MyPromise.resolve(111).then(data=>{
  console.log(data)
})