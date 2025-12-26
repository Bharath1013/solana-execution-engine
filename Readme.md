# 🚀 Solana Execution Engine

> **NOTE:** This project uses **fully simulated routing and execution**.
> You can test the complete Solana trading lifecycle without spending real SOL.

The **Solana Execution Engine** is the “brain” of a trading system.
It takes a raw trade request (e.g., *Swap 1 SOL for USDC*) and manages the full lifecycle — routing, execution, queuing, and real-time streaming — until the trade reaches a terminal state.

This project demonstrates how **real Solana trading engines** are built internally:
high-performance queues, execution workers, Redis streaming, and WebSockets.

---

# 🔁 What Is Simulated?

Two critical layers are simulated so you can safely test everything.

### 🧭 Simulated Routing

Here, the engine:

* Uses mock Logic to comapre between radiyum and meteora.
* Computes best price paths
* Chooses the most efficient route

### ⚡ Simulated Execution

This mimics:

* Transaction signing
* Network latency
* Solana confirmations

Execution progresses through:

```
PENDING → PROCESSING → SUCCESS
```

All updates are streamed live via WebSockets.

---

# 🏗 System Architecture

This project uses a **high-performance Producer–Consumer model**:

```
Client
  ↓
Fastify API (Producer)
  ↓
BullMQ Queue (Redis)
  ↓
Execution Worker (Consumer)
  ↓
Redis Pub/Sub
  ↓
WebSocket → Client
```

---

## 🔩 Components

| Component          | Role                                                     |
| ------------------ | -------------------------------------------------------- |
| **Fastify API**    | Accepts incoming trade orders                            |
| **BullMQ + Redis** | Buffers requests and prevents Solana rate-limit overload |
| **Worker**         | Runs simulated routing and execution                     |
| **Redis Pub/Sub**  | Broadcasts live execution state                          |
| **WebSocket**      | Streams real-time updates to UI / Postman                |

---

# 🌍 Live Deployment (Render)

This project is deployed on **Render**:

```
https://solana-backend-2k67.onrender.com
```

⚠️ Render puts services to sleep when idle.
First request may take **30–60 seconds** to wake up.

---

# 🚀 Render Blueprint & Infrastructure

Deployment is handled using a **Render Blueprint** powered by `render.yaml`.

### `render.yaml` automatically provisions:

Webservice and Redis Instance
          
With one click, Render creates the full distributed system.

---

# 🚦 Local Setup

## 1️⃣ Install

clone this repo

```bash
cd sol-execution-engine
npm install

npx prisma migrate dev
npx prisma generate
```

---

## 2️⃣ Start Redis & Postgres

```bash
docker run --name engine-redis -p 6379:6379 -d redis
docker run --name engine-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

---

## 3️⃣ Environment Variables

Create `.env`:

```env
PORT=3000

DATABASE_URL="postgresql://postgres:password@localhost:5432/solana_engine"
REDIS_URL="redis://localhost:6379"

SOLANA_RPC_URL="https://api.devnet-beta.solana.com"
SOLANA_PRIVATE_KEY="YOUR_PHANTOM_PRIVATE_KEY"
```

---

# 🧪 Testing With Postman (Fully Automated)

This project supports **zero-manual-copy testing** using Postman Environments + WebSockets.

---

## 1️⃣ Import Postman Files

Import everything inside:

```
/tests/postman/
```

Enable the environment:

```
Solana Project Environment
```

---

## 2️⃣ Set Base URL

In the Postman Environment:

For local:

```
baseurl = http://localhost:3000
```

For Render:

```
baseurl = https://solana-backend-2k67.onrender.com
```

---

# 🔁 Order → Live WebSocket Flow

## Step 1 — Create Order

Run:

```
POST /api/order
```

This request has a **Post-Response Script** that automatically saves:

```
{{orderId}}
```

to the Postman environment.

No manual copy needed.

---

## Step 2 — Connect WebSocket

Open a new **WebSocket Request** in Postman:

```
ws://{{baseurl}}/api/order/watch/{{orderId}}
```

Example (Render):

```
ws://solana-backend-2k67.onrender.com/api/order/watch/abc123
```

Click **Connect**.

---

## Step 3 — Watch Execution

You will receive real-time updates:

```
ROUTING → PENDING
ROUTING → SUCCESS
EXECUTION → PENDING
EXECUTION → PROCESSING
EXECUTION → SUCCESS
```

After `EXECUTION → SUCCESS`,
the socket closes automatically after **5 seconds**.

---

# 🧰 Dev Scripts

| Command                  | Purpose                |
| ------------------------ | ---------------------- |
| `npm run build`          | Compile TypeScript     |
| `npm start`              | Start API + Worker     |
| `npx prisma migrate dev` | Update DB              |
| `npx prisma generate`    | Generate Prisma client |

---

# 🧠 What This Project Demonstrates

This system shows how **real Solana trading platforms** are built:

* DEX routing engines
* Queue-based execution
* Worker-driven processing
* Redis streaming
* WebSocket trade tracking

---


