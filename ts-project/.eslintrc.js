module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    "no-extra-semi": 'warn',//禁止多余冒号
    "no-extra-parens": 'warn',//禁止非必要的括号
    "no-irregular-whitespace": 'warn',//不能有不规则的空格
    "no-multi-spaces": 'warn', //不能有多余空格
    "no-multiple-empty-lines": [1, { "max": 2 }],//空行最多不能超过2行
    "no-nested-ternary": 'warn', //禁止使用嵌套的三目运算
    "no-redeclare": 'warn',//禁止重复声明变量
    "no-self-compare": 'warn',//不能比较自身
    "no-shadow": 'warn',//外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
    "no-spaced-func": 'warn',//函数调用时 函数名与()之间不能有空格
    "no-trailing-spaces": 'warn',//一行结束后面不要有空格
    "no-undef": 'warn',//不能有未定义的变量
    "no-undef-init": 'warn',//变量初始化时不能直接给它赋值为undefined
    "no-unexpected-multiline": 'warn',//避免多行表达式
    "no-unneeded-ternary": 'warn',//禁止不必要的嵌套
    "no-unreachable": 'warn',//不能有无法执行的代码
    "no-unused-expressions": 'warn',//禁止无用的表达式
    "no-unused-vars": [2, { "vars": "all", "args": "after-used" }],//不能有声明后未被使用的变量或参数
    "no-use-before-define": 'warn',//未定义前不能使用
    "no-useless-call": 'warn',//禁止不必要的call和apply
    "no-var": 'warn',//禁用var，用let和const代替
    "no-warning-comments": [1, { "terms": ["todo", "fixme", "xxx"], "location": "start" }],//不能有警告备注
    "array-bracket-spacing": [2, "never"],//是否允许非空数组里面有多余的空格
    "arrow-parens": 0,//箭头函数用小括号括起来
    "arrow-spacing": 0,//=>的前/后括号
    "block-scoped-var": 0,//块语句中使用var
    "callback-return": 1,//避免多次调用回调
    "camelcase": 2,//强制驼峰法命名
    "comma-dangle": 0,//对象字面量项尾不能有逗号
    "comma-spacing": 0,//逗号前后的空格
    "consistent-return": 0,//return 后面是否允许省略
    "consistent-this": [2, "that"],//this别名
    "default-case": 2,//switch语句最后必须有default
    "eqeqeq": 2,//必须使用全等
    "func-names": 1,//函数表达式必须有名字
    "semi": [2, "always"],//语句强制分号结尾
    "quotes": 0,//必须单引号
  }
}
