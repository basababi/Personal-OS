' Personal OS — чимээгүй эхлүүлэгч (консол цонхгүй)
On Error Resume Next
Set sh = CreateObject("WScript.Shell")
' VSCode/терминалаас өвлөгдөж болзошгүй хувьсагчийг бүрэн устгана
sh.Environment("PROCESS").Remove "ELECTRON_RUN_AS_NODE"
On Error GoTo 0
root = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\") - 1)
sh.CurrentDirectory = root
' windowStyle=1: electron.exe нь GUI апп тул консол цонх гарахгүй;
' 0 (нуух) өгвөл Electron-ий эхний цонх нуугдмал үлддэг тул хэрэглэхгүй
sh.Run """" & root & "\node_modules\electron\dist\electron.exe"" """ & root & """", 1, False
