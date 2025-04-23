const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 5050;

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Serve login page
    if (url === '/' && method === 'GET') {
        fs.readFile(path.join(__dirname, 'login.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h2>Error loading login page</h2>');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Handle POST login
    else if (url === '/login' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const email = params.get('email');
            const password = params.get('password');
            const remember = params.get('remember') === 'on';

            // Simple authentication check (replace with your actual auth logic)
            if (email === 'rajalakshmim.23it@kongu.edu' && password === '1234') {
                // Set cookie if "Remember me" was checked
                if (remember) {
                    res.setHeader('Set-Cookie', `user=${email}; Max-Age=${60 * 60 * 24 * 7}; HttpOnly`);
                }

                // Successful login response
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Welcome</title>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                        <style>
                            body { 
                                font-family: 'Inter', sans-serif;
                                background-image: url('a.jpg');
                                background-size: cover;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                position: relative;
                            }
                            body::before {
                                content: "";
                                position: absolute;
                                top: 0; left: 0; right: 0; bottom: 0;
                                background-color: rgba(255, 255, 255, 0.8);
                                z-index: 0;
                            }
                            .welcome-box {
                                background: white;
                                padding: 2.5rem;
                                border-radius: 16px;
                                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                                max-width: 400px;
                                text-align: center;
                                position: relative;
                                z-index: 1;
                            }
                            h2 { 
                                color: #4361ee; 
                                margin-bottom: 1rem;
                                font-weight: 600;
                            }
                            p {
                                color: #6c757d;
                                margin-bottom: 1.5rem;
                            }
                            .btn {
                                display: inline-block;
                                background: linear-gradient(to right, #4361ee, #3a86ff);
                                color: white;
                                padding: 0.75rem 1.5rem;
                                border-radius: 8px;
                                text-decoration: none;
                                font-weight: 500;
                                transition: all 0.3s;
                            }
                            .btn:hover {
                                opacity: 0.9;
                                box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
                            }
                        </style>
                    </head>
                    <body>
                        <div class="welcome-box">
                            <h2>Welcome back!</h2>
                            <p>You have successfully logged in as ${email}</p>
                            <a href="/" class="btn">Back to Home</a>
                        </div>
                    </body>
                    </html>
                `);
            } else {
                // Failed login response
                res.writeHead(401, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Login Failed</title>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                        <style>
                            body { 
                                font-family: 'Inter', sans-serif;
                                background-image: url('a.jpg');
                                background-size: cover;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                position: relative;
                            }
                            body::before {
                                content: "";
                                position: absolute;
                                top: 0; left: 0; right: 0; bottom: 0;
                                background-color: rgba(255, 255, 255, 0.8);
                                z-index: 0;
                            }
                            .error-box {
                                background: white;
                                padding: 2.5rem;
                                border-radius: 16px;
                                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                                max-width: 400px;
                                text-align: center;
                                position: relative;
                                z-index: 1;
                            }
                            h2 { 
                                color: #ef233c; 
                                margin-bottom: 1rem;
                                font-weight: 600;
                            }
                            p {
                                color: #6c757d;
                                margin-bottom: 1.5rem;
                            }
                            a {
                                color: #4361ee;
                                text-decoration: none;
                                font-weight: 500;
                            }
                            a:hover {
                                text-decoration: underline;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="error-box">
                            <h2>Invalid credentials</h2>
                            <p>The email or password you entered is incorrect.</p>
                            <p><a href="/">Try again</a></p>
                        </div>
                    </body>
                    </html>
                `);
            }
        });
    }

    // Serve static files (CSS, JS, images)
    else if (method === 'GET') {
        const filePath = path.join(__dirname, url);
        const extname = path.extname(filePath);
        let contentType = 'text/html';

        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
        }

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File not found
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>404 Not Found</title>
                            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                            <style>
                                body { 
                                    font-family: 'Inter', sans-serif;
                                    background-image: url('a.jpg');
                                    background-size: cover;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    margin: 0;
                                    position: relative;
                                }
                                body::before {
                                    content: "";
                                    position: absolute;
                                    top: 0; left: 0; right: 0; bottom: 0;
                                    background-color: rgba(255, 255, 255, 0.8);
                                    z-index: 0;
                                }
                                .error-box {
                                    background: white;
                                    padding: 2.5rem;
                                    border-radius: 16px;
                                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                                    max-width: 400px;
                                    text-align: center;
                                    position: relative;
                                    z-index: 1;
                                }
                                h2 { 
                                    color: #333; 
                                    margin-bottom: 1rem;
                                    font-weight: 600;
                                }
                                p {
                                    color: #6c757d;
                                    margin-bottom: 1.5rem;
                                }
                                a {
                                    color: #4361ee;
                                    text-decoration: none;
                                    font-weight: 500;
                                }
                                a:hover {
                                    text-decoration: underline;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="error-box">
                                <h2>404 Not Found</h2>
                                <p>The page you requested doesn't exist.</p>
                                <p><a href="/">Go to login page</a></p>
                            </div>
                        </body>
                        </html>
                    `);
                } else {
                    // Server error
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                // Success
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }

    // Handle other methods
    else {
        res.writeHead(405, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>405 Method Not Allowed</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                <style>
                    body { 
                        font-family: 'Inter', sans-serif;
                        background-image: url('a.jpg');
                        background-size: cover;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        position: relative;
                    }
                    body::before {
                        content: "";
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background-color: rgba(255, 255, 255, 0.8);
                        z-index: 0;
                    }
                    .error-box {
                        background: white;
                        padding: 2.5rem;
                        border-radius: 16px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        max-width: 400px;
                        text-align: center;
                        position: relative;
                        z-index: 1;
                    }
                    h2 { 
                        color: #333; 
                        margin-bottom: 1rem;
                        font-weight: 600;
                    }
                    p {
                        color: #6c757d;
                        margin-bottom: 1.5rem;
                    }
                    a {
                        color: #4361ee;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="error-box">
                    <h2>405 Method Not Allowed</h2>
                    <p>This method is not supported for this resource.</p>
                    <p><a href="/">Go to login page</a></p>
                </div>
            </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
