# Mouser.com MERN Clone Backend

This directory contains the Node/Express/MongoDB backend API for the Mouser clone.

## Environment Variables

Copy `.env.example` to `.env` and fill in the following values:

```bash
MONGO_URI=mongodb://localhost:27017/mouser_clone   # connection string for MongoDB
JWT_SECRET=your_jwt_secret_key                    # a random string used to sign JWTs
NODE_ENV=development                               # or production
PORT=5000                                          # port for the server
```

- `MONGO_URI` should point to your MongoDB instance. You can use a local MongoDB, Atlas connection string, or any compatible URI.
- `JWT_SECRET` can be any long random string; keep it secret in production.

## Running the Server

```bash
npm install
npm run dev        # starts with nodemon for development
npm start          # starts with node for production
```

## API Endpoints

Authentication, product, category, seller/admin, order routes follow the structure defined in `routes/`.

Use tools like Postman or the frontend to interact with the API.
