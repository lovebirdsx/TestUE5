/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */

/**
 * 代码规范
 * 有任何疑问请联系 @林晨晨
 */
module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/all',
        'plugin:prettier/recommended',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['simple-import-sort', 'spellcheck', 'import'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.eslint.json',
        // debugLevel: true,
    },
    root: true,
    rules: {
        'import/no-restricted-paths': [
            'error',
            {
                basePath: './TypeScript',
                zones: [
                    { target: './Game', from: './Editor', message: 'Game不能访问Editor' },
                    { target: './Common', from: './Editor', message: 'Common不能访问Editor' },
                    { target: './Common', from: './Game', message: 'Common不能访问Game' },
                ],
            },
        ],
        // 禁止在循环内出现 await
        'no-await-in-loop': 'error',
        // 禁止使用 console 统一使用 Log
        'no-console': 'error',
        // 禁止条件判断中常量表达式
        'no-constant-condition': ['error', { checkLoops: false }],
        // 禁止常规字符串中出现占位符
        'no-template-curly-in-string': 'error',
        // 强制访问器成对出现
        'accessor-pairs': 'error',
        // 强制数组方法必须有返回
        'array-callback-return': 'error',
        // 强制变量使用作用域
        'block-scoped-var': 'error',
        // 强制圈复杂度
        complexity: ['error', 20],
        // 强制返回值一致
        'consistent-return': 'error',
        // 强制括号风格一致
        curly: 'error',
        // 强制尽可能使用点号
        'dot-notation': 'error',
        // 强制使用全等
        eqeqeq: 'error',
        // 禁用 alert
        'no-alert': 'error',
        // 禁用 caller
        'no-caller': 'error',
        // 禁止正则表达式除法操作符
        'no-div-regex': 'error',
        // 禁止 if return 后有 else
        'no-else-return': 'error',
        // 禁止与 null 比较
        'no-eq-null': 'error',
        // 禁止扩展原生类型
        'no-extend-native': 'error',
        // 禁止不必要的绑定
        'no-extra-bind': 'error',
        // 禁止不必要的标签
        'no-extra-label': 'error',
        // 禁止数字前导和末尾小数点
        'no-floating-decimal': 'error',
        // 禁止全局变量和函数
        'no-implicit-globals': 'error',
        // 禁止不必要的嵌套块
        'no-lone-blocks': 'error',
        // 禁止多空格
        'no-multi-spaces': 'error',
        // 禁止多行字符串
        'no-multi-str': 'error',
        // 禁止 new 不存储结果
        'no-new': 'error',
        // 禁止对方法使用 new
        'no-new-func': 'error',
        // 禁止对基础类型使用 new
        'no-new-wrappers': 'error',
        // 禁止字符串中八进制转义
        'no-octal-escape': 'error',
        // 禁止对函数参数赋值
        'no-param-reassign': 'error',
        // 禁止返回中赋值
        'no-return-assign': 'error',
        // 禁止返回 await
        'no-return-await': 'error',
        // 禁止自我比较
        'no-self-compare': 'error',
        // 禁止逗号操作符
        'no-sequences': 'error',
        // 禁止抛出字面量异常
        'no-throw-literal': 'error',
        // 禁止不变循环条件
        'no-unmodified-loop-condition': 'error',
        // 禁止不必要 call apply
        'no-useless-call': 'error',
        // 禁止不必要连接
        'no-useless-concat': 'error',
        // 禁止不必要返回
        'no-useless-return': 'error',
        // 禁用 void 操作符
        'no-void': 'error',
        // 强制使用命名捕获
        'prefer-named-capture-group': 'error',
        // 强制 error 作为 promise 拒绝原因
        'prefer-promise-reject-errors': 'error',
        // 强制立即执行方法包裹
        'wrap-iife': 'error',
        // 强制 import export 排序
        'simple-import-sort/imports': 'warn',
        'simple-import-sort/exports': 'warn',
        // 强制命名规范
        '@typescript-eslint/naming-convention': [
            'error',
            // 全局变量
            // 全大写下划线命名
            {
                format: ['UPPER_CASE'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'variable',
                modifiers: ['global', 'const'],
                types: ['boolean', 'string', 'number'],
            },
            // 类
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'class',
            },
            // 接口
            // 带 I 前缀的严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                prefix: ['I'],
                selector: 'interface',
            },
            // 类型
            // 带 T 前缀的严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                prefix: ['T'],
                selector: 'typeAlias',
            },
            // 泛型
            // 带 T 前缀的严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                prefix: ['T'],
                selector: 'typeParameter',
            },
            // 枚举
            // 待 E 前缀的严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                prefix: ['E'],
                selector: 'enum',
            },
            // 类属性
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'classProperty',
            },
            // 类方法
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'classMethod',
            },
            // 访问器
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'accessor',
            },
            // 类型属性
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'typeProperty',
            },
            // 类型方法
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'typeMethod',
            },
            // 字面量属性
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'objectLiteralProperty',
            },
            // 字面量方法
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'objectLiteralMethod',
            },
            // 参数属性
            // 严格大写驼峰命名
            {
                format: ['StrictPascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'parameterProperty',
            },
            // 枚举成员
            // 严格大写驼峰命名
            {
                format: ['PascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'enumMember',
            },
            // 变量
            // 严格小写驼峰命名
            {
                format: ['strictCamelCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'variable',
            },
            // 函数
            // 严格小写驼峰命名
            {
                format: ['strictCamelCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'function',
            },
            // 参数
            // 严格小写驼峰命名
            {
                format: ['strictCamelCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
                selector: 'parameter',
            },
        ],
        // 禁止魔法数字
        '@typescript-eslint/no-magic-numbers': [
            'error',
            {
                ignoreEnums: true,
                ignoreNumericLiteralTypes: true,
                ignoreReadonlyClassProperties: true,
                ignore: [-1, -0.5, 0, 0.001, 0.5, 1, 2, 10, 90, 180, 360],
            },
        ],
        '@typescript-eslint/no-use-before-define': ['error', { classes: false }],
        // 禁止未使用变量除了方法参数
        '@typescript-eslint/no-unused-vars': [
            'error',
            { vars: 'all', args: 'none', ignoreRestSiblings: false },
        ],
        // 关闭空方法报错
        '@typescript-eslint/no-empty-function': 'off',
        // 关闭枚举强制初始化
        '@typescript-eslint/prefer-enum-initializers': 'off',
        // 关闭强制安全参数
        '@typescript-eslint/no-unsafe-argument': 'off',
        // 关闭禁止纯静态类
        '@typescript-eslint/no-extraneous-class': 'off',
        // 关闭禁止覆盖声明
        '@typescript-eslint/no-shadow': 'off',
        // 关闭禁止布尔类型自动转换
        '@typescript-eslint/strict-boolean-expressions': 'off',
        // 关闭强制参数只读
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        // 关闭禁止类型别名
        '@typescript-eslint/no-type-alias': 'off',
        // 关闭禁止构造函数定义属性
        '@typescript-eslint/no-parameter-properties': 'off',
        // 关闭禁止始终一致的条件
        '@typescript-eslint/no-unnecessary-condition': ['off'],
        // 关闭强制类型导入
        '@typescript-eslint/consistent-type-imports': 'off',
        // 关闭禁止加操作符
        '@typescript-eslint/restrict-plus-operands': 'off',
        // 关闭强制字符串中只能引用字符串类型
        '@typescript-eslint/restrict-template-expressions': 'off',
        // 关闭强制字段排序
        '@typescript-eslint/member-ordering': 'off',
        // 拼写检查
        'spellcheck/spell-checker': [
            'warn',
            {
                skipWords: [
                    // 语言关键字
                    'tsconfig',
                    'Nullable',
                    'Readonly',
                    'enum',
                    'endregion',
                    'commonjs',
                    // 引擎关键字
                    'cpp',
                    'unref',
                    'Uint',
                    'Minimap',
                    'Rotator',
                    'Lerp',
                    'lerp',
                    'Anim',
                    'Hud',
                    'hud',
                    'Subobject',
                    'Quantization',
                    'Unscaled',
                    'Tickable',
                    'Niagara',
                    'Walkable',
                    'Unpossessed',
                    'Struct',
                    'interp',
                    'Shader',
                    'Ptr',
                    'Deproject',
                    'Collider',
                    'Quaternion',
                    'Quat',
                    'Slerp',
                    // 插件关键字
                    'puerts',
                    'sqlite',
                    'Sqlite',
                    'protobuf',
                    'kcp',
                    'Kcp',
                    'mtu',
                    'udp',
                    'wnd',
                    'Lgui',
                    // 通用关键字
                    'rpc',
                    'ctor',
                    'Gameplay',
                    'init',
                    'Init',
                    'npc',
                    'Npc',
                    'comp',
                    'comps',
                    'Comp',
                    'Comps',
                    'num',
                    'Num',
                    'skel',
                    'Skel',
                    'suc',
                    'Suc',
                    'err',
                    'Err',
                    'Lod',
                    'Utf8',
                    'selectable',
                    'scrollbar',
                    'dropdown',
                    'TOD',
                    'QTE',
                    'rtt',
                    'Fov',
                    'infos',
                    'ids',
                    'teleport',
                    'Teleport',
                    // 项目关键字
                    'Kuro',
                    'Aki',
                    'Hulu',
                ],
                minLength: 3,
            },
        ],
    },
};
