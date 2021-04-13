import { Message, MessageBox } from "element-ui";
import { getResorceList } from "@/utils/auth.ts";

/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time: any, cFormat: any) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result: any, key: any) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time: any, option: any) {
  if ((`${time}`).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d: any = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return `${Math.ceil(diff / 60)}分钟前`;
  } else if (diff < 3600 * 24) {
    return `${Math.ceil(diff / 3600)}小时前`;
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      `${d.getMonth() +
      1
      }月${d.getDate()
      }日${d.getHours()
      }时${d.getMinutes()
      }分`
    );
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url: any) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj: any = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs: any, $1: any, $2: any) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str: any) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual: any) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json: any) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map(key => {
      // eslint-disable-next-line no-undefined
      if (json[key] === undefined) return "";
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url: any) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    `{"${decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, " ")
    }"}`
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val: any) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target: any, source: any) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element: any, className: any) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += `${className}`;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type: any) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}


/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source: any) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments");
  }
  const targetObj: any = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr: any) {
  return Array.from(new Set(arr));
}


/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: any, cls: any) {
  return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele: any, cls: any) {
  if (!hasClass(ele, cls)) ele.className += ` ${cls}`;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele: any, cls: any) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
    ele.className = ele.className.replace(reg, " ");
  }
}

var lastUuid = 0;

export function uuid() {
  return new Date().getTime() * 1000 + (lastUuid++ % 1000);
}
export function timeData(date: any) {
  const dataaStr = new Date(date);
  let month: any = dataaStr.getMonth() + 1;
  let day: any = dataaStr.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${dataaStr.getFullYear()}-${month}-${day}`;
}

// 生成随机字符串
// len 长度 type： num str all
export function makeRandom(len: any = 6, type?: any) {
  var text = "";
  var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var possible: any;
  if (type === "num") {
    possible = "0123456789";
  } else if (type === "str" || !type) {
    possible = str;
  } else if (type === "all") {
    possible = `${str}0123456789`;
  }
  for (var i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function identification() {
  return new Date().valueOf() + makeRandom(6);
}

/** *******自定义函数**********/

// 获取字典Value
export function getdictName(dictCode: any, codeList: any) {
  let str = "";
  if (Array.isArray(dictCode)) {
    dictCode.map((item, index) => {
      codeList.map((iteminner: any) => {
        if (iteminner.dictCode === item) {
          if (index !== dictCode.length - 1) {
            str += `${iteminner.dictName}、`;
          } else {
            str += iteminner.dictName;
          }
        }
      });
    });
    return str;
  }
  const select = (codeList || []).filter((item: any) => {
    return item.dictCode === dictCode;
  });
  return select && select[0] && select[0].dictName ? select[0].dictName : "";
}

export function hasThisButton(code: any) {
  const resorceList: any = getResorceList();
  // console.log(resorceList, code)
  if (resorceList) {
    const selectAttr = resorceList.filter((item: any) => {
      // console.log(item, code)
      return item === code;
    });
    // console.log(selectAttr)
    if (selectAttr && selectAttr.length !== 0) {
      return true;
    } else {
      return false;
    }
  }
}

export function ishasValue(row: any, key: any) {
  const value = row[key] || row[key] === 0 ? row[key] : "--";
  return value;
}


var getWindow = function (node: any) {
  var doc = node.ownerDocument || node;
  return doc.defaultView || doc.parentWindow;
};

// 获取el位置
export function getClientRect(element: any) {
  var bcr;
  // trace  IE6下在控制编辑器显隐时可能会报错，catch一下
  try {
    bcr = element.getBoundingClientRect();
  } catch (e) {
    bcr = { left: 0, top: 0, height: 0, width: 0 };
  }
  var rect: any = {
    left: Math.round(bcr.left),
    top: Math.round(bcr.top),
    height: Math.round(bcr.bottom - bcr.top),
    width: Math.round(bcr.right - bcr.left)
  };
  var doc;
  while (
    (doc = element.ownerDocument) !== document &&
    (element = getWindow(doc).frameElement)
  ) {
    bcr = element.getBoundingClientRect();
    rect.left += bcr.left;
    rect.top += bcr.top;
  }
  rect.bottom = rect.top + rect.height;
  rect.right = rect.left + rect.width;
  return rect;
}

// 下载文件
export function downloadFile(content: any, filename: any, type: any) {
  return new Promise((resolve, reject) => {
    try {
      // 创建隐藏的可下载链接
      let url, blob;
      // 字符内容转变成blob地址
      switch (type) {
        case "excel":
          blob = new Blob([content], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          url = URL.createObjectURL(blob);
          break;
        case "doc":
          blob = new Blob([content], {
            type:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8"
          });
          url = URL.createObjectURL(blob);
          break;
        case "other":
          blob = new Blob([content], {
            type: "application/octet-stream;charset=utf-8"
          });
          url = URL.createObjectURL(blob);
          break;
        case "file":
          blob = new Blob([content], {
            type: "text/plain;charset=utf-8"
          });
          url = URL.createObjectURL(blob);
          break;
        case "url":
          url = content;
          break;
        default:
          blob = content;
          url = URL.createObjectURL(blob);
          break;
      }
      let eleLink;
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        // console.log(blob)
        // eleLink = document.createElement("iframe");
        // eleLink.src = url;
        blob
          ? window.navigator.msSaveBlob(blob, filename)
          : window.open(url, "_blank");
      } else {
        eleLink = document.createElement("a");
        eleLink.href = url;
        eleLink.style.display = "none";
        filename ? (eleLink.download = filename) : null;
        document.body.appendChild(eleLink);
        // 触发点击
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      }
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
}

export function judgeLink(to: any, next: any) {
  // 路由验证权限
  if (to.meta.authority) {
    let authority = to.meta.authority ? to.meta.authority.split(",") : [],
      judge = true;
    for (const i in authority) {
      if (authority[i] === "unable") {
        // eslint-disable-next-line no-const-assign
        judge = true;
        break;
      }
      if (hasThisButton(authority[i])) {
        // eslint-disable-next-line no-const-assign
        judge = false;
      }
    }
    if (judge) {
      Message.error("您暂无权限访问该页面");
      next("/reception");
      return false;
    }
  }
  return true;
}

// 获取当前时间/时间戳
export function getTimeNum(j?: any) {
  return j ? new Date() : new Date().valueOf();
}
// 时间戳转换为时间
export function timestampToTime(timestamp: any) {
  timestamp
    ? (timestamp =
      typeof timestamp === "string"
        ? timeToTimestamp(timestamp)
        : timestamp.valueOf())
    : (timestamp = getTimeNum());
  const date = new Date(timestamp);
  const Y = date.getFullYear();
  const M =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : date.getMonth() + 1;
  const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  const w = date.getDay();
  return {
    Year: Y,
    Month: M,
    Day: D,
    Hour: h,
    Minite: m,
    Second: s,
    Week: w
  };
}
// 上下午时间
export function transTime(time: any, en: any) {
  if (time) {
    const timeArr = time.split(":");
    timeArr[0] =
      Number(timeArr[0]) > 12
        ? en
          ? Number(timeArr[0] - 12) + (en === "small" ? "pm" : "PM")
          : `下午 ${Number(timeArr[0] - 12)}`
        : en
          ? timeArr[0] + (en === "small" ? "am" : "AM")
          : `上午 ${timeArr[0]}`;
    return timeArr.join(":");
  }
  return time;
}
// 时间格式化
export function TimeTransform(type: any, addtime: any, updatetime: any) {
  if (!addtime && !updatetime) {
    addtime = getTimeNum();
  }
  let time;
  if (updatetime && updatetime != null && updatetime !== "") {
    time = updatetime;
  } else {
    time = addtime;
  }
  if (type) {
    let time_trans, NewTime: any;
    // console.log(NewTime)
    type === "差值" ? null : (NewTime = timestampToTime(time));
    switch (type) {
      case "区间":
        const UntilTime = Math.round(
          parseInt((Number(getTimeNum()) / 1000 - Number(time)) as any) / 3600
        );
        if (UntilTime === 0) {
          let UntilT = parseInt(
            ((60 * (Number(getTimeNum()) / 1000 - Number(time))) / 3600) as any
          );
          UntilT = UntilT === 0 ? 1 : UntilT;
          time_trans = `${UntilT}分钟前`;
        } else if (UntilTime < 24) {
          time_trans = `${UntilTime}小时前`;
        } else if (UntilTime < 48) {
          time_trans = "1天前";
        } else if (UntilTime < 72) {
          time_trans = "2天前";
        } else {
          time_trans =
            `${NewTime.Year
            }年${NewTime.Month
            }月${NewTime.Day
            }日 ${NewTime.Hour
            }:${NewTime.Minite}`;
        }
        break;
      case "差值":
        if (!addtime || !updatetime) {
          return "";
        }
        let j = false;
        addtime =
          typeof addtime === "string"
            ? timeToTimestamp(addtime)
            : addtime.valueOf();
        updatetime =
          typeof updatetime === "string"
            ? timeToTimestamp(updatetime)
            : updatetime.valueOf();
        time = (updatetime - addtime) / 1000;
        time < 0 ? ((time = -time), (j = true)) : null;
        const d = 24 * 60 * 60,
          h = 60 * 60,
          m = 60;
        const day = Math.floor(time / d),
          hour = Math.floor((time % d) / h),
          minite = Math.floor(((time % d) % h) / m),
          second = Math.floor(((time % d) % h) % m);
        // console.log(day,hour,minite,second)
        time_trans = { day, hour, minite, second };
        // time_trans=day?
        // (day+'天'+(hour?(hour+'小时'):'1小时')):
        // ((hour?(hour<10?('0'+hour):hour):'00')+':'+(minite?(minite<10?('0'+minite):minite):'00')+':'+(second?(second<10?('0'+second):second):'01'));
        time_trans =
          (day ? `${day}天` : "") +
          ((hour ? `${hour}小时` : "") + (minite ? `${minite}分` : ""));
        j ? (time_trans = `-${time_trans}`) : null;
        break;
      default:
        type = type.replace("YYYY", NewTime.Year);
        type = type.replace("YY", NewTime.Year.toString().slice(2, 4));
        type = type.replace("MM", NewTime.Month);
        type = type.replace("M", Number(NewTime.Month));
        type = type.replace("DD", NewTime.Day);
        type = type.replace("D", Number(NewTime.Day));
        type = type.replace("hh", NewTime.Hour);
        type = type.replace("mm", NewTime.Minite);
        type = type.replace("ss", NewTime.Second);
        const week = ["日", "一", "二", "三", "四", "五", "六"];
        const weekTxt =
          NewTime.Week || NewTime.Week === 0 ? week[Number(NewTime.Week)] : "";
        type = type.replace("W", weekTxt);
        return type;
    }
    return time_trans;
  }
  return addtime;
}
// 时间转换为时间戳
export function timeToTimestamp(value: any) {
  var time = null;
  if (value !== "" && value !== null) {
    value = value.toString();
    value = value.split("/").join(",");
    value = value.split(" ").join(",");
    value = value.split("-").join(",");
    value = value.split(":").join(",");
    var arr = value.split(",");
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == null) {
        arr.splice(i, 1);
        i--;
      }
    }
    time = new Date(
      arr[0],
      arr[1] - 1,
      arr[2],
      arr[3] ? arr[3] : 0,
      arr[4] ? arr[4] : 0,
      arr[5] ? arr[5] : 0
    );
    time = time.valueOf();
  }
  return time;
}

// 获取本月天数
export function getDays(n: any) {
  var today = new Date();
  var d = new Date(
    today.getFullYear(),
    Number(today.getMonth() + 1 + (n || 0)),
    0
  );
  return d.getDate();
}
// 自定义element提示框确认框样式
export function alertFn(msg: any, type: any) {
  Message({
    iconClass: type ? "el-icon-circle-check" : "el-icon-circle-close",
    customClass: `troila-alert troila-alert-${type ? "success" : "error"}`,
    message: msg || (type ? "成功" : "失败"),
    type: type ? "success" : "error",
    showClose: true, // type ? false :
    duration: 3000
  });
}

export function confirmFn(text: any, title: any, config: any) {
  MessageBox.confirm(text, title, {
    type: "warning",
    customClass: "troila-confirm",
    dangerouslyUseHTMLString: true,
    ...config
  });
}
// 递归获取数据
export function recursion(
  item_: any,
  id = "id",
  children = "children",
  disabled = "disabled",
  judge = true
): any {
  let item;
  try {
    item = JSON.parse(JSON.stringify(item_));
  } catch (error) {
    item = item_;
  }
  let arr = [];
  item && (item[disabled] === judge || !item[id]) ? null : arr.push(item[id]);
  if (item[children] && item[children].length > 0) {
    for (const i in item[children]) {
      arr = arr.concat(
        recursion(item[children][i], id, children, disabled, judge)
      );
    }
  }
  return arr;
}
export function JudgeClass(el: any, name: any) {
  var e = el || window.event || arguments[0];
  var elme = e.target || e.srcElement;
  var className: any = [];
  var getclass = function () {
    if (elme.classList && elme.classList.length > 0) {
      className.push(elme.classList);
    }
    if (elme.parentElement || elme.parentNode) {
      elme = elme.parentElement || elme.parentNode;
      getclass();
    }
  };
  getclass();
  if (name) {
    const names = name.split(",");
    for (var i = 0; i < className.length; i++) {
      for (var j = 0; j < className[i].length; j++) {
        if (names.indexOf(className[i][j]) > -1) {
          return true;
        }
      }
    }
  }
  return false;
}

export function getMatched(this_: any) {
  // console.log(this_.$route)
  if (!this_.$route.meta || !this_.$route.meta.title) {
    return [];
  }
  // console.log(this_.$route.matched)
  let matched = this_.$route.matched.filter(
    (item: any) =>
      this_.$route.meta &&
      this_.$route.meta.title &&
      (item.name === this_.$route.name ||
        (this_.$route.meta.pName && item.name === this_.$route.meta.pName))
  );
  // console.log(matched)
  if (matched.length === 0) {
    return [];
  }
  const first = matched[0];
  if (first.name === this_.$route.name) {
    matched = [first];
  }
  return matched.map((v: any) => v.meta.title);
}

export function replaceBr(val: any, type: any) {
  // type 不传无变化,  1 替换val中回车为html的<br/> 空格为html的&bsp,  2 替换为段落,  3 回车替换为空格,  4 清除回车空格返回纯文本

  if (val) {
    val = val.toString();
    switch (type) {
      case 1:
        return val
          .replace(/\r\n/g, "<br/>")
          .replace(/\n/g, "<br/>")
          .replace(/\r/g, "<br/>")
          .replace(/\s/g, "&nbsp;");
      case 2:
        return (
          `<p>${val
            .replace(/\r\n/g, "</p><p>")
            .replace(/\n/g, "</p><p>")
            .replace(/\r/g, "</p><p>")
            .replace(/\s/g, "&nbsp;")
          }</p>`
        );
      case 3:
        return val
          .replace(/\r\n/g, " ")
          .replace(/\n/g, " ")
          .replace(/\r/g, " ");
      case 4:
        return val
          .replace(/\r\n/g, "")
          .replace(/\n/g, "")
          .replace(/\r/g, "")
          .replace(/\s/g, "");
    }
  } else {
    return "";
  }
}

export function replaceSpace(val: any, type: any) {
  // type 不传返回val去头尾空格,  1 返回去除所有空格, 2 返回去头尾空格 文字间多个空格只保留一个
  if (val) {
    val = val.toString();
    if (type) {
      switch (type) {
        case 1:
          return val.replace(/\s/g, "");
        case 2:
          var text = val
            .replace(/^\s\s*/, "")
            .replace(/\s\s*$/, "")
            .replace(/\s\s*/g, " ");
          return text;
        case "html":
          var text = val.replace(/\s\s*/g, "&nbsp;");
          return text;
      }
    }
    return val.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  } else {
    return "";
  }
}

export function getItemVal(arr: any, key: any, id: any, opt: any = {}): any {
  const idname = opt.idname || "id",
    children = opt.children || "children";
  for (const i in arr) {
    if (arr[i][idname] === id) {
      // console.log(arr[i][key], key, arr[i], id);
      return arr[i][key];
    }
    if (arr[i][children] && arr[i][children].length > 0) {
      const res = getItemVal(arr[i][children], key, id, opt);
      if (res !== null) {
        return res;
      }
    }
  }
  return null;
}

export const beautifierConf = {
  html: {
    indent_size: "2",
    indent_char: " ",
    max_preserve_newlines: "-1",
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "separate",
    brace_style: "end-expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: "110",
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: "2",
    indent_char: " ",
    max_preserve_newlines: "-1",
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "normal",
    brace_style: "end-expand",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: "110",
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
};

export function getExploreName() {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    return "Opera";
  } else if (
    userAgent.indexOf("compatible") > -1 &&
    userAgent.indexOf("MSIE") > -1
  ) {
    return "IE";
  } else if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
  } else if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  } else if (
    userAgent.indexOf("Safari") > -1 &&
    userAgent.indexOf("Chrome") === -1
  ) {
    return "Safari";
  } else if (
    userAgent.indexOf("Chrome") > -1 &&
    userAgent.indexOf("Safari") > -1
  ) {
    return "Chrome";
  } else if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return "IE>=11";
  } else {
    return "Unkonwn";
  }
}

export function contentType(name: any) {
  const FilenameExtension = name.toUpperCase().split(".")[
    name.toUpperCase().split(".").length - 1
  ];
  if (FilenameExtension === "BMP") {
    return "image/bmp";
  }
  if (FilenameExtension === "GIF") {
    return "image/gif";
  }
  if (
    FilenameExtension === "JPEG" ||
    FilenameExtension === "JPG" ||
    FilenameExtension === "PNG"
  ) {
    return "image/jpeg";
  }
  if (FilenameExtension === "HTML") {
    return "text/html";
  }
  if (FilenameExtension === "TXT") {
    return "text/plain";
  }
  if (FilenameExtension === "VSD") {
    return "application/vnd.visio";
  }
  if (FilenameExtension === "PPTX" || FilenameExtension === "PPT") {
    return "application/vnd.ms-powerpoint";
  }
  if (FilenameExtension === "XLSX" || FilenameExtension === "XLS") {
    return "application/vnd.ms-excel";
  }
  if (FilenameExtension === "DOCX" || FilenameExtension === "DOC") {
    return "application/msword";
  }
  if (FilenameExtension === "XML") {
    return "text/xml";
  }
  if (FilenameExtension === "PDF") {
    return "application/pdf";
  }
  return null;
}

export function imgTypeValid(dataPrix: any) {
  if (dataPrix.indexOf("data:image/jpeg;") > -1) {
    return ".jpeg";
  } else if (dataPrix.indexOf("data:image/jpg;") > -1) {
    return ".jpg";
  } else if (dataPrix.indexOf("data:image/gif;") > -1) {
    return ".gif";
  } else if (dataPrix.indexOf("data:image/png;") > -1) {
    return ".png";
  } else if (dataPrix.indexOf("data:image/apng;") > -1) {
    return ".apng";
  } else if (dataPrix.indexOf("data:image/svg;") > -1) {
    return ".svg";
  } else if (dataPrix.indexOf("data:image/bmp;") > -1) {
    return ".bmp";
  }
  return null;
}

export function fileTypeValid(dataPrix: any) {
  if (dataPrix.indexOf("data:text/plain;") > -1) {
    return ".txt";
  }
  return null;
}

export function numberFormat(number: any, decimals: any, dec_point: any, thousands_sep: any) {
  /*
   * 参数说明：
   * number：要格式化的数字
   * decimals：保留几位小数
   * dec_point：小数点符号
   * thousands_sep：千分位符号
   * */
  number = (`${number}`).replace(/[^0-9+-Ee.]/g, "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s: any = "",
    toFixedFix = function (n: any, prec: any) {
      var k = Math.pow(10, prec);
      return `${Math.ceil(n * k) / k}`;
    };

  s = (prec ? toFixedFix(n, prec) : `${Math.round(n)}`).split(".");
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, `$1${sep}$2`);
  }

  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

export function roundFixed(num: any, fixed: any) {
  var pos = num.toString().indexOf("."),
    decimal_places = num.toString().length - pos - 1,
    _int = num * Math.pow(10, decimal_places),
    divisor_1 = Math.pow(10, decimal_places - fixed),
    divisor_2 = Math.pow(10, fixed);
  return Math.round(_int / divisor_1) / divisor_2;
}

// 价格标注
export function getSmallPrice(v: any) {
  v = v.toString();
  const arr = [],
    base = 4,
    text = [];
  for (let i = 0; i < v.length; i++) {
    if (i % base === 0) {
      arr.splice(0, 0, v.substr(v.length - 1 - i, 1));
    } else {
      arr[0] = v.substr(v.length - 1 - i, (i % base) + 1);
    }
  }
  const unit = ["元", "万", "亿"];
  for (let i = 0; i < arr.length; i++) {
    if (Number(arr[i]) > 0) {
      text.push(Number(arr[i]) + unit[arr.length - 1 - i]);
    }
  }
  //   console.log(text)
  return text;
}

// 返回价格
export function transformPrice(price: any, judge: any) {
  if (!price && price !== 0) {
    return "";
  }
  price = price.toString().replace(/[^0-9.]/g, "");
  var price1;
  var arr = price.split(".");
  if (arr.length > 1) {
    price1 = `${arr[0]}.${arr[1].substr(0, 2)}`;
    // console.log(price1)
  } else {
    price1 = price;
  }
  var setPoint = function (n: any) {
    // console.log(n.toLocaleString())
    const nString = n.toLocaleString();
    const nStringArr = nString.split("."),
      nFront: any = [];
    const nChange = nStringArr[0].split(",").join("");
    for (let i = 0; i < nChange.length / 3; i++) {
      nFront.splice(
        0,
        0,
        nChange.slice(
          nChange.length - (i + 1) * 3 > 0 ? nChange.length - (i + 1) * 3 : 0,
          nChange.length - i * 3
        )
      );
    }
    return (
      nFront.join(",") +
      (nFront.length > 0
        ? `.${nStringArr.length > 1 && Number(nStringArr[1])
          ? nStringArr[1].toString().length < 2
            ? `${nStringArr[1]}0`
            : nStringArr[1]
          : "00"}`
        : "")
    );
  };
  if (judge === true && Number(price1) > 1000000000000) {
    alertFn("金额过长，已为您缩短到13位之内", false);
  }
  return judge
    ? setPoint(price1)
    : Number(price1)
      ? Number(price1).toString()
      : "";
}

// 金额转换
export function toChies(currencyDigits: any) {
  // Constants:
  var MAXIMUM_NUMBER = 99999999999.99;
  // Predefine the radix characters and currency symbols for output:
  var CN_ZERO = "零";
  var CN_ONE = "1";
  var CN_TWO = "2";
  var CN_THREE = "3";
  var CN_FOUR = "4";
  var CN_FIVE = "5";
  var CN_SIX = "6";
  var CN_SEVEN = "7";
  var CN_EIGHT = "8";
  var CN_NINE = "9";
  var CN_TEN = "-";
  var CN_HUNDRED = "百";
  var CN_THOUSAND = "千";
  var CN_TEN_THOUSAND = "万";
  var CN_HUNDRED_MILLION = "亿";
  // var CN_SYMBOL = "人民币";
  var CN_DOLLAR = "元";
  var CN_TEN_CENT = "角";
  var CN_CENT = "分";
  var CN_INTEGER = "整";

  // Variables:
  var integral; // Represent integral part of digit number.
  var decimal; // Represent decimal part of digit number.
  var outputCharacters; // The output result.
  var parts;
  var digits, radices, bigRadices, decimals;
  var zeroCount;
  var i, p, d;
  var quotient, modulus;

  // Validate input string:
  currencyDigits = currencyDigits.toString();
  // if (currencyDigits == '') {
  //   console.log('请输入小写金额！')
  //   return ''
  // }
  // if (currencyDigits.match(/[^,.\d]/) != null) {
  //   console.log('小写金额含有无效字符！')
  //   return ''
  // }
  // if (
  //   currencyDigits.match(
  //     /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/
  //   ) == null
  // ) {
  //   console.log('小写金额的格式不正确！')
  //   return ''
  // }

  // Normalize the format of input digits:
  currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
  currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
  // Assert the number is not greater than the maximum number.
  if (Number(currencyDigits) > MAXIMUM_NUMBER) {
    console.log("金额过大，应小于1000亿元！");
    return "";
  }

  // Process the coversion from currency digits to characters:
  // Separate integral and decimal parts before processing coversion:
  parts = currencyDigits.split(".");
  if (parts.length > 1) {
    integral = parts[0];
    decimal = parts[1];
    // Cut down redundant decimal digits that are after the second.
    decimal = decimal.substr(0, 2);
  } else {
    integral = parts[0];
    decimal = "";
  }
  // Prepare the characters corresponding to the digits:
  digits = new Array(
    CN_ZERO,
    CN_ONE,
    CN_TWO,
    CN_THREE,
    CN_FOUR,
    CN_FIVE,
    CN_SIX,
    CN_SEVEN,
    CN_EIGHT,
    CN_NINE
  );
  radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
  bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
  decimals = new Array(CN_TEN_CENT, CN_CENT);
  // Start processing:
  outputCharacters = "";
  // Process integral part if it is larger than 0:
  if (Number(integral) > 0) {
    zeroCount = 0;
    for (i = 0; i < integral.length; i++) {
      p = integral.length - i - 1;
      d = integral.substr(i, 1);
      quotient = p / 4;
      modulus = p % 4;
      if (d === "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          outputCharacters += digits[0];
        }
        zeroCount = 0;
        outputCharacters += digits[Number(d)] + radices[modulus];
      }
      if (modulus === 0 && zeroCount < 4) {
        outputCharacters += bigRadices[quotient];
        zeroCount = 0;
      }
    }
    outputCharacters += CN_DOLLAR;
  }
  // Process decimal part if there is:
  if (decimal !== "") {
    for (i = 0; i < decimal.length; i++) {
      d = decimal.substr(i, 1);
      if (d !== "0") {
        outputCharacters += digits[Number(d)] + decimals[i];
      }
    }
  }
  // Confirm and return the final output string:
  if (outputCharacters === "") {
    outputCharacters = CN_ZERO + CN_DOLLAR;
  }
  if (decimal === "") {
    outputCharacters += CN_INTEGER;
  }
  const arr = outputCharacters.split("-");
  if (arr.length > 1) {
    for (let i = 0; i < arr.length - 1; i++) {
      [
        CN_HUNDRED,
        CN_THOUSAND,
        CN_TEN_THOUSAND,
        CN_HUNDRED_MILLION,
        CN_DOLLAR
      ].indexOf(arr[i + 1][0]) > -1
        ? (arr[i] = `${arr[i]}0`)
        : "";
    }
  }
  outputCharacters = arr.join(""); // CN_SYMBOL +
  return outputCharacters;
}

// // 金额转换
// export function toChies(currencyDigits) {
//   // Constants:
//   var MAXIMUM_NUMBER = 99999999999.99
//   // Predefine the radix characters and currency symbols for output:
//   var CN_ZERO = '零'
//   var CN_ONE = '壹'
//   var CN_TWO = '贰'
//   var CN_THREE = '叁'
//   var CN_FOUR = '肆'
//   var CN_FIVE = '伍'
//   var CN_SIX = '陆'
//   var CN_SEVEN = '柒'
//   var CN_EIGHT = '捌'
//   var CN_NINE = '玖'
//   var CN_TEN = '拾'
//   var CN_HUNDRED = '佰'
//   var CN_THOUSAND = '仟'
//   var CN_TEN_THOUSAND = '万'
//   var CN_HUNDRED_MILLION = '亿'
//   var CN_SYMBOL = '人民币'
//   var CN_DOLLAR = '元'
//   var CN_TEN_CENT = '角'
//   var CN_CENT = '分'
//   var CN_INTEGER = '整'

//   // Variables:
//   var integral // Represent integral part of digit number.
//   var decimal // Represent decimal part of digit number.
//   var outputCharacters // The output result.
//   var parts
//   var digits, radices, bigRadices, decimals
//   var zeroCount
//   var i, p, d
//   var quotient, modulus

//   // Validate input string:
//   currencyDigits = currencyDigits.toString()
// //   if (currencyDigits == '') {
// //     console.log('请输入小写金额！')
// //     return ''
// //   }
//   if (currencyDigits.match(/[^,.\d]/) != null) {
//     console.log('小写金额含有无效字符！')
//     return ''
//   }
//   if (
//     currencyDigits.match(
//       /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/
//     ) == null
//   ) {
//     console.log('小写金额的格式不正确！')
//     return ''
//   }

//   // Normalize the format of input digits:
//   currencyDigits = currencyDigits.replace(/,/g, '') // Remove comma delimiters.
//   currencyDigits = currencyDigits.replace(/^0+/, '') // Trim zeros at the beginning.
//   // Assert the number is not greater than the maximum number.
//   if (Number(currencyDigits) > MAXIMUM_NUMBER) {
//     console.log('金额过大，应小于1000亿元！')
//     return ''
//   }

//   // Process the coversion from currency digits to characters:
//   // Separate integral and decimal parts before processing coversion:
//   parts = currencyDigits.split('.')
//   if (parts.length > 1) {
//     integral = parts[0]
//     decimal = parts[1]
//     // Cut down redundant decimal digits that are after the second.
//     decimal = decimal.substr(0, 2)
//   } else {
//     integral = parts[0]
//     decimal = ''
//   }
//   // Prepare the characters corresponding to the digits:
//   digits = new Array(
//     CN_ZERO,
//     CN_ONE,
//     CN_TWO,
//     CN_THREE,
//     CN_FOUR,
//     CN_FIVE,
//     CN_SIX,
//     CN_SEVEN,
//     CN_EIGHT,
//     CN_NINE
//   )
//   radices = new Array('', CN_TEN, CN_HUNDRED, CN_THOUSAND)
//   bigRadices = new Array('', CN_TEN_THOUSAND, CN_HUNDRED_MILLION)
//   decimals = new Array(CN_TEN_CENT, CN_CENT)
//   // Start processing:
//   outputCharacters = ''
//   // Process integral part if it is larger than 0:
//   if (Number(integral) > 0) {
//     zeroCount = 0
//     for (i = 0; i < integral.length; i++) {
//       p = integral.length - i - 1
//       d = integral.substr(i, 1)
//       quotient = p / 4
//       modulus = p % 4
//       if (d == '0') {
//         zeroCount++
//       } else {
//         if (zeroCount > 0) {
//           outputCharacters += digits[0]
//         }
//         zeroCount = 0
//         outputCharacters += digits[Number(d)] + radices[modulus]
//       }
//       if (modulus == 0 && zeroCount < 4) {
//         outputCharacters += bigRadices[quotient]
//         zeroCount = 0
//       }
//     }
//     outputCharacters += CN_DOLLAR
//   }
//   // Process decimal part if there is:
//   if (decimal != '') {
//     for (i = 0; i < decimal.length; i++) {
//       d = decimal.substr(i, 1)
//       if (d != '0') {
//         outputCharacters += digits[Number(d)] + decimals[i]
//       }
//     }
//   }
//   // Confirm and return the final output string:
//   if (outputCharacters == '') {
//     outputCharacters = CN_ZERO + CN_DOLLAR
//   }
//   if (decimal == '') {
//     outputCharacters += CN_INTEGER
//   }
//   outputCharacters = CN_SYMBOL + outputCharacters
//   return outputCharacters
// }
