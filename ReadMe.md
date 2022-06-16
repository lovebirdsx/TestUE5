# TestUE5

个人用于测试UE5的工程

## 首次运行

- 右键TestUE5.uproject, 生成工程文件后, 使用Vs2019进行编译
- 在根目录下运行  `npm ci`
- 在Content/Javascript 下执行 `npm ci`
- 在Content/Javascript/PuertsEditor下执行 `npm ci`
- 在根目录下运行 `tsc`

## 指令

- watch `npm run watch`
- check `npm run check`
- lint `npm run lint`

## 目录结构

### Plugins

- TestLiveCoding 测试Unreal live coding相关代码

### Content

- Test
  - LivecodingForEditor 测试Live coding
  - Hlod 测试HLOD
  - WorldPartition 测试World Partition

## 相关文件解释

- bat文件：确保UnrealEditor.exe在Path下
  - BuildHlodForTestHlod.bat 为TestHlod.umap生成HLOD
  - BuildHlodForTestHlod.bat 为TestHlod.umap生成HLOD

## 关于PuerTS

- 官方的安装说明 <https://github.com/Tencent/puerts/blob/master/doc/unreal/install.md>
- v8的lib文件中, 有大小超过100M的, github对于100M的文件必须通过LFS来支持
  - 参考 <https://git-lfs.github.com/>
- 如何启用PuerTS的自动模式（可以自动识别actor类型的ts, 并生成对应的蓝图对象）
  - 进入`Plugins/Puerts`, 执行`node enable_puerts_module.js`
    - 执行可能会失败,譬如项目中已经包含了`tsconfig.json`, 那么去掉enable_puerts_module.js中对应的拷贝tsconfig.json的步骤
  - 注意, 必须打开Puerts的watch功能（默认是打开的）

## VsCode

- 安装filewatcher插件, 可以在proto文件修改后自动生成对应的ts文件
