🚀 Solana Execution Engine
==========================

> **NOTE:** This project uses **fully simulated routing and execution**.You can test the entire trading lifecycle without spending real SOL.

The **Solana Execution Engine** is the “brain” of a trading system.It receives a raw trade request (for example, _Swap 1 SOL for USDC_) and manages the complete lifecycle until the trade reaches a final state.

This system demonstrates how **real Solana trading engines work internally** — order intake, routing, execution, queuing, and live WebSocket updates — without actually touching the blockchain.

🔁 What is Simulated?
---------------------

Two critical parts are simulated:

### 🧭 Simulated Routing

Here, the engine:

*   Uses mock price curves
    
*   Calculates best paths
    
*   Chooses the optimal simulated route
    

### ⚡ Simulated Execution

This mimics:

*   Transaction signing
    
*   Network latency
    
*   Solana confirmations
    

States go through:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PENDING → PROCESSING → SUCCESS   `

All of this is streamed live to the client via WebSockets.

🏗 System Architecture
======================

The engine uses a **high-performance producer-consumer design**:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Client    ↓  Fastify API (Producer)    ↓  BullMQ + Redis (Queue)    ↓  Execution Worker (Consumer)    ↓  Redis Pub/Sub    ↓  WebSocket → Client  🔩 Components  Component                   Role  **Fastify API**           Accepts incoming trade orders  **BullMQ + Redis**        Buffers requests and prevents Solana rate-limit overload  **Worker**                Runs simulated routing and execution lifecycle  **Redis   Pub/Sub**       Broadcasts live state changes from worker  **WebSocket**             Streams real-time updates to UI / Postman   `

🌍 Live Deployment
==================

This project is deployed on **Render**:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   https://solana-backend-2k67.onrender.com   `

⚠️ **Important:**Render spins down inactive services.First request may take **30–60 seconds** to wake up.

🚦 Getting Started (Local)
==========================

1️⃣ Install
-----------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone   cd sol-execution-engine  npm install  # Setup database  npx prisma migrate dev  npx prisma generate   `

2️⃣ Start Redis & Postgres
--------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   docker run --name engine-redis -p 6379:6379 -d redis  docker run --name engine-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres   `

3️⃣ Environment Variables
-------------------------

Create .env:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PORT=3000  DATABASE_URL="postgresql://postgres:password@localhost:5432/solana_engine"  REDIS_URL="redis://localhost:6379"  SOLANA_RPC_URL="https://api.devnet-beta.solana.com"  SOLANA_PRIVATE_KEY="YOUR_PHANTOM_PRIVATE_KEY"   `

🧪 Testing With Postman (Fully Automated)
=========================================

This project is designed to be tested using **Postman Environments + WebSockets**.

1️⃣ Import Postman Files
------------------------

Go to:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /tests/postman/   `

Import both:

*   Collection
    
*   Environment
    

Enable the environment named:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Solana Project Environment   `

2️⃣ Set Base URL
----------------

In the Postman Environment:

For **local**:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   baseurl = http://localhost:3000   `

For **Render (Live)**:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   baseurl = https://solana-backend-2k67.onrender.com   `

🔁 Order → WebSocket Live Flow
==============================

Step 1 — Create Order
---------------------

Run:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/order   `

This request includes a **Post-Response Script** that automatically saves:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {{orderId}}   `

into the Postman environment.

You do NOT need to copy anything manually.

Step 2 — Connect WebSocket
--------------------------

Open a new **WebSocket Request** in Postman:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ws://{{baseurl}}/api/order/watch/{{orderId}}   `

Example (Render):

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ws://solana-backend-2k67.onrender.com/api/order/watch/abc123   `

Click **Connect**.

Step 3 — Watch Live Execution
-----------------------------

You will see messages like:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ROUTING → PENDING  ROUTING → SUCCESS  EXECUTION → PENDING  EXECUTION → PROCESSING  EXECUTION → SUCCESS   `

After the final state:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   EXECUTION → SUCCESS   `

The socket will automatically close after **5 seconds**.

🧰 Dev Scripts
==============

Command Purpose

npm run build Compile TypeScript

npm start Start API + Worker

npx prisma migrate dev Update DB

npx prisma generate Generate client

🚀 Production Deployment (Render)
---------------------------------

This project is deployed on **Render** using a **Blueprint** created from render.yaml.

The render.yaml file automatically creates: Web service and Redis Instance on render.