module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'getter-return': 'error', // 强制 getter 函数中出现 return 语句
    'no-dupe-arg': 'off', // 禁止 function 定义中出现重名参数
    'no-dupe-keys': 'error', // 禁止对象字面量中出现重复的 key
    'no-duplicate-case': 'error', // 禁止出现重复的 case 标签
    'no-empty': 'off', // 禁止出现空语句块
    'no-extra-parens': 'warn', // 禁止不必要的括号
    'no-extra-semi': 'off', // 禁止不必要的分号
    'no-func-assign': 'error', // 禁止对 function 声明重新赋值
    'no-unexpected-multiline': 'error', // 禁止对 function 声明重新赋值
    'no-unreachable': 'warn', // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
    'array-callback-return': 'off', // 强制数组方法的回调函数中有 return 语句
    'block-scoped-var': 'off', // 强制把变量的使用限制在其定义的作用域范围内
    eqeqeq: 'warn', // 要求使用 === 和 !==
    'no-empty-function': 'off', // 禁止出现空函数
    'no-empty-pattern': 'warn', // 禁止使用空解构模式
    'no-eval': 'error', // 禁用 eval()
    'no-fallthrough': 'error', // 禁止 case 语句落空
    'no-redeclare': 'off', // 禁止多次声明同一变量
    'no-self-compare': 'warn', // 禁止自身比较
    'no-unmodified-loop-condition': 'error', // 禁用一成不变的循环条件
    'require-await': 'warn', // 禁止使用不带 await 表达式的 async 函数
    'no-label-var': 'warn', // 不允许标签与变量同名
    'no-shadow': 'off', // 禁止变量声明与外层作用域的变量同名
    'no-shadow-restricted-names': 'error', // 禁止将标识符定义为受限的名字
    'no-undef': 'error', // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    'no-undefined': 'error', // 禁止将 undefined 作为标识符
    'no-unused-vars': 'off', // 禁止出现未使用过的变量
    'no-use-before-define': 'error', // 禁止在变量定义之前使用它们
    'global-require': 'warn', // 要求 require() 出现在顶层模块作用域中
    'comma-dangle': 'off', // 要求或禁止末尾逗号
    indent: 'off', // 强制使用一致的缩
    'keyword-spacing': 'warn', // 强制在关键字前后使用一致的空格
    'multiline-ternary': 'off', // 要求或禁止在三元操作数中间换行
    'no-mixed-spaces-and-tabs': 'warn', // 禁止空格和 tab 的混合缩进
    semi: 'off', // 求或禁止使用分号代替 ASI
    'no-const-assign': 'error', // 禁止修改 const 声明的变量
    'no-duplicate-imports': 'error', // 禁止重复模块导入
    'prefer-const': 'warn', // 要求使用 const 声明那些声明后不再被修改的变量
    'prefer-template': 'warn', // 要求使用模板字面量而非字符串连接
    quotes: 'off', // 强制使用单引号
    'space-before-function-paren': 'off', // 强制函数声明后空格
    'no-multiple-empty-lines': 'warn',
    'no-unused-expressions': 'off',
    'eol-last': 'off',
    'one-var': 'off',
    'no-prototype-builtins': 'off',
    'brace-style': 'off',
    camelcase: 'off',
    'no-case-declarations': 'off',
    'no-array-constructor': 'off',
    'vue/valid-v-for': 'off',
    "@typescript-eslint/no-explicit-any": ["off"]
  }
}
