## Backend by Javascript Mastery

### Basics of backend

## Teaching rom JS mastery.

### 1. Error handling in controller. - gives json error.

```javascript
if (!isPasswordValid) {
  const error = new Error("Invalid user password");
  error.statusCode = 400;
  throw error;
}
```

### 2. Session use in Mongodb operation.

```javascript
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // logic to create new user
    const { name, password, email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUser[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
```

### 3. Handle access and refresh token very easily. Not complicated as hitesh did.

### 4. Use of Arcjet to protect our APIs from bots and spammers.

1. Create project on arcjet.
2. Get the keys and paste in .env.development.local.

- ARCJET_KEY="aj_key.."
- ARCJET_ENV="development"

3. Choose stacks. here - **Node + Express**
4. you will get docs.
5. Install packages that mention.
6. Create a file `arcjet.js` in 📁**config** folder.
7. there we have configured which algo arcjet using to detect spams on our APIs.
8. Now, we are using arcjet as middleware. so, Create file `arcjet.middleware.js` in 📁**middleware** folder.
9. In that file, we actually sending messages and errors on basis of what arcjet detecting.
10. As everytime we do. `app.use(arcjetMiddleware);` in **app.js** file.
11. Now check by sending request as fast as possible.

When we send request to backend from frontend.
**This is how request goes with data.**

### 5. Workflows

#### Setting up Upstash

1. Go to Upstash.com. create account. you will be in **redis tab**.
2. Switch to **workflows tab**.
3. Copy the envs and paste in env file.
4. click on docs > quick start > expressjs.
5. install package by running `npm install @upstash/workflow`. (_Read some docs first_).
6. Create file `upstash.js` in **config** folder.(_make sure you export envs in env.js_)
7. In these file, config is there.
8. Create `workflow.routes.js` in routes folder. create ts router there.
9. Import it in app.js and create it route.
10. Now, create a controller

![alt text](image.png)

**Then it processes the data and sent back the response. just like below**

![alt text](image-1.png)

---

### Different types of API you will encounter

1. **RESTfull APIs** - the API uses APIs and **http** methods. Each request is independent and doesn't rely on each other.

like - http://api.example.com/user -- method - `GET`, `PATCH`, `POST`..

2. **GraphQl APIs** - Developed by facebook which offers more flexiblity than REST APIs by **letting clients request exactly the data they need**.

**Instead of multiple endpoints for different data.**

**eg:- For user - http://api/v1/user**
**eg:- For video - http://api/v1/video**

**GraphQl uses single end point i.e. `/graphql` end point and then clients can specify that exact fields they want without previously defined them in code.** _which is super efficient for complex application and super interconnected data_

---

### Backend architecture

#### There are few popular Backend Architecture.

![alt text](image-2.png)

---

## 🏗️ What is Backend Architecture?

**Backend Architecture** is the **blueprint** of how your backend system is structured — how components like databases, APIs, servers, business logic, caching, and third-party services interact.

Think of it like the **engine room** of your web or mobile app.

---

## 📦 Why It Matters?

Backend architecture decides:

- Performance 🔥
- Scalability 📈
- Cost efficiency 💰
- Developer experience 👨‍💻
- Maintainability 🛠️

---

## 🧱 Components of Backend Architecture

| Component          | Role                                                       |
| ------------------ | ---------------------------------------------------------- |
| **Server**         | Handles requests (Node.js, Python, Go, etc.)               |
| **Routing Layer**  | Directs requests to correct controller or handler          |
| **Controllers**    | Contains logic for each endpoint (GET /videos, POST /like) |
| **Services**       | Business logic layer (subscriptions, payments, etc.)       |
| **Database**       | Stores persistent data (PostgreSQL, MongoDB)               |
| **Cache**          | Speeds up responses (Redis, Memcached)                     |
| **Authentication** | Protects routes (JWT, OAuth, sessions)                     |
| **Queue Workers**  | Background jobs (emails, payment retries)                  |
| **API Gateway**    | Routes traffic in microservices                            |
| **Monitoring**     | Logs, metrics, error tracking (Sentry, Prometheus)         |

---

## 🧠 Types of Backend Architectures

Here’s how backend architectures are **categorized**:

---

### 1. **Monolithic Architecture** (💡 Simple MVPs)

#### 🔧 What:

All logic (API, DB access, etc.) in **one codebase and server**.

#### ✅ Pros:

- Easy to build and deploy
- Great for early-stage startups

#### ❌ Cons:

- Hard to scale
- Any bug can crash everything

#### 👁️ Example:

```plaintext
[Frontend] → [Monolithic Server (API + DB logic + Auth)] → [Database]
```

---

### 2. **Microservices Architecture** (⚙️ Scalable SaaS/Enterprises)

#### 🔧 What:

System broken into **small, independent services**, each doing one thing.

#### ✅ Pros:

- Scales well
- Easy to maintain, update services independently

#### ❌ Cons:

- Complexity
- Requires DevOps and infrastructure setup

#### 👁️ Example:

```plaintext
[Frontend] → [API Gateway] → [Auth Service]
                        → [Payment Service]
                        → [User Service]
                        → [DBs for each]
```

---

### 3. **Serverless Architecture** (🧠 Pay-as-you-use + scalable)

#### 🔧 What:

Uses cloud functions (like AWS Lambda) that run on demand — **no need to manage servers**.

#### ✅ Pros:

- Cheap for small workloads
- Auto-scales
- No server maintenance

#### ❌ Cons:

- Cold start delay
- Can be hard to debug

---

### 4. **Event-Driven Architecture** (📩 Reactive systems)

#### 🔧 What:

Components communicate by **sending/receiving events** (Kafka, RabbitMQ, etc.)

#### ✅ Pros:

- Real-time capabilities
- Loose coupling of services

#### ❌ Cons:

- Harder to test/debug
- More infra needed

#### 👁️ Use Case:

- Chat apps
- Payment notifications
- Subscription lifecycle triggers

---

### 5. **Hybrid Architecture** (Most real-world SaaS)

You might start monolithic, then split parts into services:

- Monolith for core
- Microservice for payments
- Serverless for webhooks

---

## 💼 Which Architecture Should You Use?

| Stage             | Recommended Architecture                   |
| ----------------- | ------------------------------------------ |
| Learning Projects | Monolithic (e.g., Express.js + MongoDB)    |
| MVP / Startup     | Monolithic with modular code or serverless |
| Scaling SaaS      | Microservices + queues + caching           |
| Real-Time Systems | Event-driven + WebSockets                  |

---

## 🚀 Pro-Move: Layered Architecture Inside Backend

Even in a monolith, use this structure:

```
controllers/     → handle HTTP requests
services/        → business logic
models/          → DB schemas (ORMs)
middlewares/     → auth, logging
utils/           → helpers
routes/          → API routes
```

---

### API setup and demo

1. We are going to use **httpie**. an alternative to **Postman**

---

### Here Start actual coding

#### 1. Set up of Upstash - Redis, Vector and Qstash

Great question, Shubham! You're seeing real-world dev setup in action. Let's **break it down like a pro**:

---

### 🧰 Command:

```bash
npx express-generator --no-view --git ./
```

This is using **Express Generator**, a tool to scaffold (generate) a basic Express.js project **instantly**.

---

### 🧠 Breakdown of Each Part:

| Part                | Meaning                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `npx`               | Runs a package without installing it globally. Comes with Node.js                                   |
| `express-generator` | Tool that generates boilerplate Express.js app                                                      |
| `--no-view`         | Skips template engine (like EJS or Pug). You're building an **API backend**, so views aren't needed |
| `--git`             | Initializes a **Git repo** inside the folder automatically                                          |
| `./`                | Target directory is the **current folder** (not a new one)                                          |

---

Now, delete folders - `bin, routes and public` and also delete content of **app.js**, not file of app.js.

### Now linter for clean code base and scalability

we are using here **ESlint**. most common for JS.
It actually format and maintain clean code through out our folder.

Run following command

```
npx eslint --init
```

---

Set up completed.

---

### Start creating express server

---

### env config

Create a folder `config`. inside it, create file **env.js**

_env.js_

```javascript
import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT } = process.env;
```

also create two files.

1. `.env.production.local`
2. `.env.development.local`

inside .env.production.local - `NODE_ENV='production'`

inside .env.development.local - `your actual envs`.

Now you can import envs from env.js

### Set up our routes

---

### Database setup

---

### Error handling

Create a folder `middleware`. in that error.middleware.js
