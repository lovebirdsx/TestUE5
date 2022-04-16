# 不能用Windows的cmd来执行,否则madge指令的过滤没法生效
# 下面的过滤字符串表示: 过滤
cd ..
madge -c -i madge.svg -x '(TsPlayer|TsEntity|TsEntityComponent|react-umg)\.ts$' ./TypeScript
