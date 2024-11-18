const http = require('http');
const url = require('url');
const fs = require("fs")

// 创建服务器
const server = http.createServer((req, res) => {
    // 解析请求的 URL 和查询参数
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    // 设置响应头
    res.writeHead(200, { 'Content-Type': 'application/json' });

    let responseData = {}
    if ("path" in query) {
        if(fs.existsSync(query.path)){
            var stat = fs.statSync(query.path);
            if (stat) {
                responseData = {
                    code: 0,
                    c: stat.birthtimeMs,
                    u: stat.mtimeMs,
                    a: stat.atimeMs,
                }
            }else{
                responseData = {
                    code: 2
                }
            }
        }else{
            responseData = {
                code: 3
            }
        }
        
       
    } else {
        // 构造返回的 JSON 数据
        responseData = {
            code: 1,
            message: 'Hello, this is your query data!',
            query: query, // 返回解析的查询参数
        };
    }

    // 返回 JSON 数据
    res.end(JSON.stringify(responseData));
});

// 监听端口
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});