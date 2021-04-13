const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a view',
  prompts: [{
    type: 'input',
    name: 'ModuleName',
    message: '请输入文件路径(例如 newPages/page 将新建于pages文件夹下)',
    validate: notEmpty('ModuleName')
  },
  {
    type: 'input',
    name: 'fileName',
    message: '请输入文件名称(例如 list)',
    validate: notEmpty('fileName')
  },
  {
    type: 'checkbox',
    name: 'blocks',
    message: 'Blocks:',
    choices: [{
      name: '<template>',
      value: 'template',
      checked: true
    },
    {
      name: '<script>',
      value: 'script',
      checked: true
    },
    {
      name: 'style',
      value: 'style',
      checked: true
    }],
    validate(value) {
      if (value.indexOf('script') === -1 && value.indexOf('template') === -1) {
        return 'View require at least a <script> or <template> tag.'
      }
      return true
    }
  },
  {
    type: 'confirm',
    name: 'hasRouter',
    message: '是否存在该路由文件',
  },
  {
    type: 'input',
    name: 'routerTitle',
    message: '请输入路由标题',
    when: function (answers) {
      return !answers.hasRouter
    }
  }
  ],
  actions: data => {
    var actions = [{
      type: 'add',
      path: `src/pages/{{ModuleName}}/{{fileName}}.vue`,
      templateFile: 'plop-templates/page/index.hbs',
      data: {
        name: '{{ fileName }}',
        template: data.blocks.includes('template'),
        script: data.blocks.includes('script'),
        style: data.blocks.includes('style')
      }
    }]
    if (!data.hasRouter) {
      actions.push(
        {
          type: 'add',// 添加路由文件
          path: 'src/router/modules/{{ModuleName}}.ts',
          templateFile: 'plop-templates/page/router.hbs'
        },
      )
    }
    return actions
  }
}
