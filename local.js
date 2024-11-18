import fs from 'fs'
import path from 'path'
import moment from 'moment'
import pLimit from 'p-limit' // 用于限制并发数量
import { execFileSync } from 'child_process'

const API_URL = `http://192.168.1.200:3000/`

const winSetFileCreateTime = (path, time) => {
    execFileSync('setfilectimecmd.exe', [path, "c", time])
}

const winSetFileUpdateTime = (path, time) => {
    execFileSync('setfilectimecmd.exe', [path, "u", time])
}


const sleep = async (timeout)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, timeout);
    })
}

const queryRemoteFile = async (path) => {
    let retry = 0
    while(1){
        try{
            const resp = await fetch(`${API_URL}?path=${path}`)
            if (resp.status === 200) {
                const body = await resp.json()
                return body
            }
            return { code: 999 }
        }catch(e){
            retry++
            await sleep(1000)
        }

        if(retry >=3){
            return {code: 998}
        }
    }

    
}

const syncLocalFileTime = async (path) => {
    const result = await queryRemoteFile(path)
    if (result.code === 0) {
        const fCreateTime = moment(result.c).format('YYYY-MM-DD hh:mm:ss')
        const fUpdateTime = moment(result.u).format('YYYY-MM-DD hh:mm:ss')

        console.log(fCreateTime)
        console.log(fUpdateTime)

        winSetFileCreateTime(path, fCreateTime)
        winSetFileUpdateTime(path, fUpdateTime)
        console.log(`[+] Sync ${path}`)
    } else {
        console.warn('查询远程文件失败')
    }
}

const deepGetFilesSync = async (filePath, ucallback) => {
    const files = fs.readdirSync(filePath)
    for (let i in files) {
        let filename = files[i]
        let filedir = path.join(filePath, filename)
        const stats = fs.statSync(filedir)

        let isFile = stats.isFile()
        let isDir = stats.isDirectory()
        if (isFile) {
            await ucallback(filedir)
        }
        if (isDir) {
            await ucallback(filedir)
            await deepGetFilesSync(filedir, ucallback)
        }
    }
}

// 使用p-limit来控制并发数量
const limit = pLimit(35)  // 控制最大并发数为5

const main = async () => {
    const paths = []

    await deepGetFilesSync("D:\\bak", async (path) => {
        paths.push(path)
    })

    // 将文件同步任务传递给limit函数，控制并发
    const tasks = paths.map((path) => limit(() => syncLocalFileTime(path)))

    // 等待所有同步任务完成
    await Promise.all(tasks)

    console.log('end')
}

main()
