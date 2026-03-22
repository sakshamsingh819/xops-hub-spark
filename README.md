
# X-Ops Hub Spark

## About

This is a web project built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS.

## How to run the project

1. Make sure you have Node.js and npm installed. You can get them from [nodejs.org](https://nodejs.org/).
2. Download or clone this repository to your computer.
3. Open a terminal and go to the project folder.
4. Install the project dependencies:

	```sh
	npm install
	```

5. Create a `.env` file from `.env.example` and set your local values.

6. Run database migrations:

	```sh
	npm run migrate
	```

7. Start the development server:

	```sh
	npm run dev
	```

8. Open your browser and go to the address shown in the terminal (usually http://localhost:8080/).

## How to edit the code

You can open the project folder in any code editor, like VS Code. Change the files in the `src` folder to update the website.

## CMS Editing Workflow

1. Log in as an admin user.
2. Open `/admin`.
3. Go to `Website Content`.
4. Edit home hero text, announcement, about text, event list JSON, links, and logos.
5. Click `Save CMS Changes`.
6. Public pages update from database-backed content.

## Production Deployment (Vercel + Render/Railway + Supabase)

### 1) Push to GitHub

```sh
git add .
git commit -m "Deploy-ready CMS with Postgres"
git push origin main
```

### 2) Create Supabase Postgres database

1. Create a Supabase project.
2. Copy connection string from `Project Settings -> Database`.
3. Set this as `DATABASE_URL` in API host.

### 3) Deploy API to Render or Railway

Use these settings:

- Build command: `npm install`
- Start command: `npm run server`
- Required env vars:
	- `DATABASE_URL`
	- `DB_SSL=true`
	- `JWT_SECRET`
	- `FRONTEND_ORIGIN=https://<your-vercel-domain>`
	- `ADMIN_EMAIL` (optional)

After first deploy, run migration command once:

```sh
npm run migrate
```

If needed, promote an existing user to admin:

```sh
npm run promote-admin -- admin@example.com
```

### 4) Deploy frontend to Vercel

Use these settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Env var:
	- `VITE_API_BASE_URL=https://<your-api-domain>`

### 5) Verify end-to-end

1. Open deployed website.
2. Sign up / log in.
3. Open `/admin` as admin.
4. Edit content and save.
5. Confirm public site reflects updates.

## Technologies used

- Vite
- React
- TypeScript
- shadcn-ui
- Tailwind CSS
