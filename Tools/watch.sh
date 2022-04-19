cd ..
# rm Content/JavaScript/Game -rf
# rm Content/JavaScript/Editor -rf
# rm Content/JavaScript/Common -rf
# tsc-watch --onSuccess "node ./Tools/send_editor_command.js 0 RestartEditor"
tsc-watch --onSuccess "sh Tools/on_watch_success.sh"
