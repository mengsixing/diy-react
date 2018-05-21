/** 
 * react源码中的pureComponent比较函数 
 */

// 检查简单类型
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  // 如果 不是object，null，就判断为不相等
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  // 对象长度不等，就判断为不相等
  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  // 判断参数名称，参数值，不匹配则判断为不相等。（这里只比较了一层，如果参数值是一个obj，则可能比较不到差异）
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

// 转换object样式
function styleObjectToString(obj) {
  let styleString = JSON.stringify(obj);
  styleString = styleString
    .replace(/[\{\}\"]/g, "")
    .replace(/\,/g, ";")
    .replace(/([A-Z])/g, function (word) {
      return "-" + word.toLowerCase();
    });
  return styleString;
}
