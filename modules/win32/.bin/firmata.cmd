@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\firmata\repl.js" %*
) ELSE (
  node  "%~dp0\..\firmata\repl.js" %*
)