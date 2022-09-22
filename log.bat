@echo off
rem *** Colored Echo ***
setlocal EnableDelayedExpansion
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
  set "DEL=%%a"
)

rem Prepare a file "X" with only one dot
<nul > X set /p ".=."
rem *** Color Echo ***
set arg=%*
call !arg!

rem *** Color Echo ***
del X
exit /b
:i
set "param=^%~1" !
set "param=!param:"=\"!"
findstr /p /A:09 "." "!param!\..\X" nul
<nul set /p ".=%DEL%%DEL%%DEL%%DEL%%DEL%%DEL%%DEL%"
echo :
exit /b
:w
set "param=^%~1" !
set "param=!param:"=\"!"
findstr /p /A:0e "." "!param!\..\X" nul
<nul set /p ".=%DEL%%DEL%%DEL%%DEL%%DEL%%DEL%%DEL%"
echo :
exit /b
:e
set "param=^%~1" !
set "param=!param:"=\"!"
findstr /p /A:0c "." "!param!\..\X" nul
<nul set /p ".=%DEL%%DEL%%DEL%%DEL%%DEL%%DEL%%DEL%"
echo :
exit /b
rem *** Color Echo ***