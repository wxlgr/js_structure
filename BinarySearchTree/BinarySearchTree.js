function BinarySearchTree() {
  this.root = null;
}
// 节点类
BinarySearchTree.Node = function (key) {
  this.key = key;
  this.left = null;
  this.right = null;
};

//  插入函数
BinarySearchTree.prototype.insert = function (key) {
  // 1.创建新节点
  const newNode = new BinarySearchTree.Node(key);
  // 2.判断根节点是否为空
  if (this.root == null) {
    this.root = newNode;
    return true;
  }
  // 3.递归查找位置进行插入
  insertNode(this.root, newNode);

  // 用于递归判断插入的内部类
  function insertNode(node, newNode) {
    if (newNode.key < node.key) {
      //往左找
      if (node.left == null) {
        node.left = newNode;
        return true;
      } else {
        // 继续查找
        insertNode(node.left, newNode);
      }
    } else {
      // 往右找
      if (node.right == null) {
        node.right = newNode;
        return true;
      } else {
        insertNode(node.right, newNode);
      }
    }
  }
};

//先序遍历
BinarySearchTree.prototype.preOrderTraversal = function (handle) {
  preOrderTraversalNode(this.root);
  function preOrderTraversalNode(node) {
    // 为空则返回
    if (!node) return;
    // 不为空则执行回调函数
    handle(node.key);
    // 遍历左节点
    preOrderTraversalNode(node.left);
    // 遍历右节点
    preOrderTraversalNode(node.right);
  }
};
//中序遍历
BinarySearchTree.prototype.midOrderTraversal = function (handle) {
  minOrderTraversalNode(this.root);
  function minOrderTraversalNode(node) {
    // 为空则返回
    if (!node) return;
    // 遍历左节点
    minOrderTraversalNode(node.left);
    // 不为空则执行回调函数
    handle(node.key);
    // 遍历右节点
    minOrderTraversalNode(node.right);
  }
};

//后序遍历
BinarySearchTree.prototype.postOrderTraversal = function (handle) {
  postOrderTraversalNode(this.root);
  function postOrderTraversalNode(node) {
    // 为空则返回
    if (!node) return;
    // 遍历左节点
    postOrderTraversalNode(node.left);
    // 遍历右节点
    postOrderTraversalNode(node.right);
    // 不为空则执行回调函数
    handle(node.key);
  }
};

//   最小值
BinarySearchTree.prototype.min = function () {
  if (!this.root) return null;

  let node = this.root;
  while (node.left) {
    node = node.left;
  }
  return node.key;
};
//   最大值
BinarySearchTree.prototype.max = function () {
  if (!this.root) return null;
  let node = this.root;
  while (node.right) {
    node = node.right;
  }
  return node.key;
};

// 查找,返回对应节点
BinarySearchTree.prototype.search = function (key) {
  return serachNode(this.root);
  function serachNode(node) {
    if (!node) return null;
    if (key === node.key) return node;
    return serachNode(key <= node.key ? node.left : node.right);
  }
};

// 删除节点
BinarySearchTree.prototype.remove = function (key) {
  let parent = null;
  let current = this.root;
  //   是否是左节点
  let isLeftNode = true;
  current = serachNode(this.root);
  function serachNode(node) {
    if (!node) return null;
    if (key === node.key) return node;

    parent = node;
    isLeftNode = key < node.key;
    return serachNode(key < node.key ? node.left : node.right);
  }
  console.log('父节点',parent.key,"待删除的节点", current.key, "待删除节点是不是其父节点的左子节点",isLeftNode);

  // 不存在
  if (current == null) {
    // 不存在，删除失败
    return false;
  }
  // 叶子节点
  else if (current.left == null && current.right == null) {
    if (current === this.root) {
      this.root = null;
    } else {
      parent[isLeftNode ? "left" : "right"] = null;
    }
  }
  // 单子节点
  else if (
    (current.left !== null && current.right == null) ||
    (current.left == null && current.right !== null)
  ) {
    // 获得那个单子节点
    let singleChild = current.left !== null ? current.left : current.right;

    // 如果是删除根节点，用那个单子节点作为新的根节点

    if (current === this.root) {
      this.root = singleChild;
    } else {
      parent[isLeftNode ? "left" : "right"] = singleChild;
    }
  }
  // 双子节点
  else if (current.left !== null && current.right !== null) {
    // 找到的后继者
    let successor = this.getSuccessor(current);
    // 根节点
    if (current == this.root) {
      this.root = successor;
    } else {
      // 替换成后继者节点
      parent[isLeftNode ? "left" : "right"] = successor;
      // 把删除节点的左节点挂载至后继节点的左节点
      successor.left = current.left;
    }
  }
  return true;
};
BinarySearchTree.prototype.getSuccessor = function (delNode) {
  // 后继者
  let successor = delNode.right;
  // 后继者的父节点
  let successorParent = delNode;
  while (successor.left) {
    successorParent = successor;
    successor = successor.left;
  }
  console.log("successorParent：", successorParent.key);
  console.log("successor：", successor.key);

  if (successor != delNode.right) {
    // 不是删除节点的直接右节点
    // 后继者父节点的左节点=后继者的右节点
    successorParent.left = successor.right;
    // 把删除节点的右节点挂载至后继者节点
    successor.right = delNode.right;
  }
  return successor;
};

export { BinarySearchTree };
