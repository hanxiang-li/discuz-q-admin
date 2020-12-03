import Jsona from 'jsona';
const data = new Jsona();

export const dataFormatter = (val) => {
  return data.deserialize(val)
}
export const dataSerialize = (val, includeNames) => {
  return data.serialize({
    stuff: val,
    includeNames: includeNames
  })
}

/**
 * 对象深拷贝
 */
export const deepClone = data => {
  var type = getObjType(data);
  var obj;
  if (type === 'array') {
    obj = [];
  } else if (type === 'object') {
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};
export const getObjType = obj => {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
};

export const analyzingData = (data, included) => {
  included  = included ? included : [];

  var newIncludes = {};
  included.forEach(function(nowOne) {
    newIncludes[nowOne.type+nowOne.id] = nowOne;
  })

  /**
   * 获取一条数据真实数据
   * @return {[type]} [description]
   */
  function getOneData(nowData) {
    var result = {};

    //没有值时返回空对象
    if(!nowData) return result;

    if(!nowData.attributes) {
      nowData = newIncludes[nowData.type+nowData.id];
    }
    // else{
    //   result._data = nowData.attributes;
    // }

    result._data = nowData.attributes;
    if(nowData.id) result._data.id = nowData.id; //有id时将id加入_data

    if(nowData.relationships) {
      var relationObj = {};

      for(var relationKey in nowData.relationships) {
        relationObj[relationKey] = getData(nowData.relationships[relationKey].data);
      }

      result = {...result, ...relationObj};
    }

    return result;
  }

  /**
   * 获取一条数据和一组数据
   * @param  {[type]} nowData [description]
   * @return {[type]}         [description]
   */
  function getData(nowData) {
    var result = {};

    if(nowData instanceof Array) {
      result = [];

      nowData.forEach(function(nowOne) {
        result.push(getOneData(nowOne));
      });
    } else {
      result = getOneData(nowData);
    }

    return result;
  }

  return getData(data, included);
}
