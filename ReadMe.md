# TestUE5

个人用于测试UE5的工程

## 目录结构

### Plugins

- TestLiveCoding: 测试Unreal live coding相关代码

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
- v8的lib文件中，有大小超过100M的，github对于100M的文件必须通过LFS来支持
  - 参考 <https://git-lfs.github.com/>
