# 不能用Windows的cmd来执行,否则madge指令的过滤规则没法生效

# 在此加入需要忽略的文件
ignore_files=(
    'react-umg\.ts'
)

regx=$(IFS=\| ; echo "${ignore_files[*]}")
# echo "$regx"

madge -c --extensions ts,tsx -x "$regx" ./TypeScript

# 下面的指令可以生成图
# madge -c -i madge.svg -x "$regx" ./TypeScript
