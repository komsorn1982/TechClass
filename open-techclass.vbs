Option Explicit

Dim shell
Set shell = CreateObject("WScript.Shell")
WScript.Sleep 8000
shell.Run "cmd.exe /d /c start """" ""http://localhost:3000/""", 0, False
