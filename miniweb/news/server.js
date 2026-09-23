const http = require("http");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
    let filePath = "";

    if (req.url === "/") {
        filePath = path.join(__dirname, "views", "home.html");
    } 
    else if (req.url === "/about") {
        filePath = path.join(__dirname, "views", "about.html");
    } 
    else if (req.url.startsWith("/news")) {
        filePath = path.join(__dirname, "views", "news.ejs");
    } 
    else if (req.url.startsWith("/search")) {
        filePath = path.join(__dirname, "views", "search.ejs");
    } 
    else if (req.url === "/login") {
        filePath = path.join(__dirname, "views", "login.ejs");
    } 
    else {
        res.writeHead(404, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end("<h1>404 - Không tìm thấy trang</h1>");
        return;
    }

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.writeHead(500, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end("<h1>Lỗi server</h1>");
            return;
        }

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        // SEARCH
        if (req.url.startsWith("/search") && req.method === "GET") {
            const myURL = new URL(
                req.url,
                "http://localhost:3000"
            );

            const keyword = myURL.searchParams.get("keyword");

            data = ejs.render(data, {
                keyword: keyword
            });

            res.end(data);
            return;
        }

        // NEWS
        if (req.url.startsWith("/news")) {
            const pathParts = req.url.split("/");
            const id = pathParts[2];

            let newsList = [
                {
                    id: 1,
                    title: "Nodejs",
                    description: "Lập trình backend"
                },
                {
                    id: 2,
                    title: "Web động",
                    description: "Trả về dữ liệu tương ứng với request"
                },
                {
                    id: 3,
                    title: "React",
                    description: "Lập trình frontend"
                }
            ];

            if (id) {
                data = ejs.render(data, {
                    id: id,
                    newsList: [newsList[id - 1]]
                });
            } 
            else {
                data = ejs.render(data, {
                    id: "",
                    newsList: newsList
                });
            }

            res.end(data);
            return;
        }

        // LOGIN POST
        if (req.url === "/login" && req.method === "POST") {
            let body = "";

            req.on("data", chunk => {
                body += chunk.toString();
            });

            req.on("end", () => {
                const formData = querystring.parse(body);

                const username = formData.username;

                let islogin = false;

                if (username) {
                    islogin = true;
                }

                const result = ejs.render(data, {
                    islogin: islogin,
                    username: username
                });

                res.end(result);
            });

            return;
        }

        // LOGIN GET
        if (req.url === "/login" && req.method === "GET") {
            data = ejs.render(data, {
                islogin: false,
                username: ""
            });

            res.end(data);
            return;
        }

        // HTML bình thường
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});