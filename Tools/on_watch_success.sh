# 读取ini
if [ -e Saved/Editor.ini ]
then
    # 解析ini中的Section会输出警告, 将其忽略
    source Saved/Editor.ini >/dev/null 2>&1
fi

# 检查循环依赖
if [[ "$CheckCircular" == "True" ]]
then
    sh Tools/check_circular.sh
fi

# 运行Lint
if [[ "$RunLint" == "True" ]]
then
    npm run lint
fi

# 重新Reload编辑器
node ./Tools/send_editor_command.js 0 RestartEditor

echo 'finished'
