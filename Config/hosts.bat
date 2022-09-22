::adb pull /system/etc/hosts "%~dp0hosts"
adb remount
adb push "%~dp0hosts" /system/etc
pause
exit