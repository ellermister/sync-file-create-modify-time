# sync-file-create-modify-time

在windows上，从A电脑复制到B电脑的文件时，丢失文件的创建时间和修改时间，通过脚本进行批量修改同步。

1. 当目录结构保持一致时可用
2. 在 A 电脑上运行 server.js
3. 在 B 电脑上运行 local.js 
4. 并修改 local.js 里面的目录即可



## setfilectimecmd.exe
参数表达式
```bash
setfilectimecmd.exe {file_path} {c/u} {datetime}
```

- file_path 路径
- c 创建时间
- u 修改时间
- datetime 具体要修改为的时间  2008-10-30 01:02:03

## setfilectime.dll
编译了一个32位dll, 发现nodejs调用不了这个，又编译了一个exe

## 函数
bool set_file_ctime 修改文件创建时间
- path string
- datetime string


bool set_file_utime 改文件修改时间
- path string
- datetime string