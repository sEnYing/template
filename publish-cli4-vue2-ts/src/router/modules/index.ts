const files = require.context(".", true, /\.js/);
const modules: any[] = [];
files.keys().forEach(key => {
  if (key === "./index.js") {
    return;
  }
  // // var mk = key.replace(/(^\.\/|\.js$)/g, '')
  // var m = files(key);
  // var item = Object.keys(m).reduce((s, e) => {
  //     if (e !== 'default') {
  //     if (Array.isArray(m[e])) {
  //         modules = modules.concat(m[e])
  //         return s
  //     } else s[e] = m[e]
  //     }
  //     return s
  // }, m.default || {})
  // if (item && item.path) modules.push(item)
  const mk = key.replace(/(^\.\/|\.js$)/g, "");
  const mkArr = mk.split("/");
  const m = files(key);
  const setFile = function (json: any, arr: any, file: any) {
    if (arr.length > 1) {
      setFile(json, arr.slice(1, arr.length), file);
    } else {
      if (file && file.path) json.push(file);
    }
  };
  const file = Object.keys(m).reduce((s, e) => {
    if (e !== "default") {
      s[e] = m[e];
    }
    return s;
  }, m.default || {});
  setFile(modules, mkArr, file);
  //   console.log(modules);
});
export default modules;
