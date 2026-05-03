🚀 Steps to Create & Run
Prerequisites

Node.js v18+
MongoDB running locally (or a MongoDB Atlas URI)


Step 1 — Unzip & open the project
bashunzip taskflow-pro.zip
cd taskflow-pro

Step 2 — Configure the backend
bashcd server
cp .env.example .env
Then open .env and set:
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=any_long_random_string_here

Step 3 — Install dependencies
bash# In /server
npm install

# In /client (new terminal)
cd ../client
npm install

Step 4 — Run both servers
Terminal 1 (backend):
bashcd server
npm run dev
# → http://localhost:5000
Terminal 2 (frontend):
bashcd client
npm run dev
# → http://localhost:5173

Step 5 — Seed test data
bashcd server
node seed.js
Step 6 — Open the app
Visit http://localhost:5173 and log in with:
Email                       Password         Role
admin@test.com              password123     Admin
manager@test.com            password123     Manager
employee@test.com           password123     Employee
