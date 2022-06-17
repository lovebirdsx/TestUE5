rm Content/JavaScript/Game -rf
rm Content/JavaScript/UniverseEditor -rf
tsc-watch --onSuccess "sh Tools/on_watch_success.sh"
