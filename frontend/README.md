# Mouser.com MERN Clone Frontend

This repository contains the React/Vite frontend for a full-stack Mouser.com clone.

## Overview

- Built with React (Vite), Tailwind CSS, Redux Toolkit, React Router v6, Axios, and Framer Motion.
- Modular folder structure with components, pages, store slices, services, and routes.
- Includes authentication, product listing, seller/admin panels, offline cache, and animated UI.

## Environment Variables

Create a `.env` file in this directory (copy `.env.example` if present) and set:

```bash
VITE_API_URL=http://localhost:5000/api    # backend base URL
```

You can also configure other VITE_ prefixed values here.

## Running the App

```bash
npm install
npm run dev
```

## Things to Update After Cloning

1. Ensure backend is running and `VITE_API_URL` points to it.
2. Visit `/login` or `/register` to create users.
3. Access admin panel at `/admin/dashboard` after logging in as an admin.
4. Use admin screen to add sponsors, products, categories, etc.

## Development Notes

- Frontend state persists authentication in `localStorage`.
- Axios interceptors handle token and logout.
- Navigation animations use Framer Motion.

Refer to the workspace structure for details on components and pages.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
