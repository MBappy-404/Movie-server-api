# 🎬 Movie Server (Complete Build)

A public movie streaming server project – designed to store, organize, and stream your movie collection locally or remotely. This is completed with features being added step by step.

## 🚧 Project Status

**Complete Backend Server**  
Initial setup, basic routing, and video streaming functionality are being implemented.

---

## ✨ Technology Used ⚙️
<li>Node</li>
<li>Express</li>
<li>React</li>
<li>Prisma</li>
<li>PostgreSQL</li>
<li>sslcommerz Payment Gateway</li>
<li>TypeScript</li>

## ✨ Features (Planned & In Progress)

- [x] Project setup with Node.js/Express backend
- [x] Serve movie files from local storage
- [x] User authentication & dashboard
- [x] Stream movies via HTML5 video player
- [x] Movie metadata (title, description, poster)
- [x] Search and filtering
- [x] Admin panel for uploads and management
- [x] Responsive frontend UI (React/Next.js)

---

# Folder Structure 📂
<p>I organized the project by creating this folder structure. The folders here are product, order and user. All of them are crated in different files, so that they can be controlled and handled very easily.</p>

<pre>
src/
│   ├── admin/
│   │   ├── admin.controller.ts
│   │   ├── admin.router.ts
│   │   ├── admin.service.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.interface.ts
│   │   ├── auth.route.ts
│   │   ├── auth.service.ts
│   │   ├── auth.validation.ts
│   ├── comment/
│   │   ├── comment.controller.ts
│   │   ├── comment.interface.ts
│   │   ├── comment.route.ts
│   │   ├── comment.service.ts
│   │   ├── comment.validation.ts
│   ├── content/
│   │   ├── content.constant.ts
│   │   ├── content.controller.ts
│   │   ├── content.interface.ts
│   │   ├── content.route.ts
│   │   ├── content.service.ts
│   │   ├── content.validation.ts
│   ├── SSL/
│   │   ├── ssl.interface.ts
│   │   ├── ssl.service.ts
│   ├── discount/
│   │   ├── discount.controller.ts
│   │   ├── discount.interface.ts
│   │   ├── discount.route.ts
│   │   ├── discount.service.ts
│   │   ├── discount.validation.ts
│   ├── user/
│   │   ├── user.constant.ts
│   │   ├── user.controller.ts
│   │   ├── user.interface.ts
│   │   ├── user.route.ts
│   │   ├── user.service.ts
│   │   ├── user.validation.ts
│   ├── genre/
│   │   ├── genre.controller.ts
│   │   ├── genre.interface.ts
│   │   ├── genre.route.ts
│   │   ├── genre.service.ts
│   │   ├── genre.validation.ts
│   ├── like/
│   │   ├── like.controller.ts
│   │   ├── like.route.ts
│   │   ├── like.service.ts
│   ├── payment/
│   │   ├── payment.controller.ts
│   │   ├── payment.interface.ts
│   │   ├── payment.route.ts
│   │   ├── payment.service.ts
│   ├── platform/
│   │   ├── platform.controller.ts
│   │   ├── platform.interface.ts
│   │   ├── platform.route.ts
│   │   ├── platform.service.ts
│   │   ├── platform.validation.ts
│   ├── reviews/
│   │   ├── reviews.controller.ts
│   │   ├── reviews.interface.ts
│   │   ├── reviews.route.ts
│   │   ├── reviews.service.ts
│   │   ├── reviews.validation.ts
├── app.ts
├── server.ts
</pre>
---

# Error Handling ⚠️
<li>I am implement error handling for invalid input, missing data, invalid email and insufficient stock.</li>
<pre>{
    "success": false,
    "message": "Validation Error",
    "errorSources": [
        {
            "path": "releaseYear",
            "message": "Release year is required"
        }
    ],
    "err": {
        "issues": [
            {
                "code": "invalid_type",
                "expected": "string",
                "received": "undefined",
                "path": [
                    "content",
                    "releaseYear"
                ],
                "message": "Release year is required"
            }
        ],
        "name": "ZodError"
    },
    "stack": "ZodError: [\n  {\n    \"code\": \"invalid_type\",\n  
}
</pre>
<li><strong>Not Found:</strong> If you hit a wrong route, it will send a message and tell you your status, and which route you hit. </li>
<pre>
{
    "success": false,
    "message": "API Not Found /api/content2",
    "error": "Error: API Not Found /api/content2\n    at notFound (/var/task/dist/middlewares/notFound.js:10:19)\n
}
</pre>

# Thanks you Sir/Mam 💕

 

