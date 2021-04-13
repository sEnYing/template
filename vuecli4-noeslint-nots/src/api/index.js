const files = require.context('./modules', true, /\.js/)
const modules = {}
files.keys().forEach(key => {
  if (key === './index.js') {
    return
  }
  let mk = key.replace(/(^\.\/|\.js$)/g, '')
  let mkArr = mk.split('/')
  let m = files(key)
  let setFile=function(json,arr,file){
    json[arr[0]]?null:json[arr[0]]={};
    arr.length>1?setFile(json[arr[0]],arr.slice(1,arr.length),file):json[arr[0]]=file;
  }
  let file = Object.keys(m).reduce((s, e) => {
    if (e !== 'default') {
      s[e] = m[e]
    }
    return s
  }, m.default || {})
  setFile(modules,mkArr,file)
})
export default modules
