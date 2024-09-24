# Webie.dev

<!-- prettier-ignore -->
> [!NOTE]
> Welcome to webie.dev, this is a open-source project for building modern web.

## Tech Stack

-   **Framework**: [REMIX](https://remix.run/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Style**: [tailwindcss](https://tailwindcss.com/)
-   **UI LIbrary**: [shadcn/ui](https://ui.shadcn.com/)
-   **Email SDK**: [Resend](https://resend.com/)

## Why use Webie?

1. Totally free without branding logos.
2. You own the codebase.
3. Fully modulized, take what you want and build with _Typescript_, _HTML_, _JSX_, and _inline class_ (tailwindcss)
4. Built-in blog system with WYSIWYG text editor.
5. Optimized for performance, start with **score 100**, tested by [PageSpeed](https://pagespeed.web.dev/).
6. Authenticate with **Email Magic Link**.

---

## Required documents

1. environment variable file `.env` in the root directory (`/`)

## Before you start

You should:

1. Have a useful IDE. (e.g. [Visual Studio Code](https://code.visualstudio.com/))
2. Have a [MongoDB Atlas](https://www.mongodb.com/docs/atlas/) (MongoDB's cloud service) account to host your database,
   every project has up to 1 free 512MB M0 cluster.
3. Have a [Resend](https://resend.com/) account to send email.

<!-- prettier-ignore -->
> [!INFO]
> You should allow all IPs, or all posible IPs, to connect to your MongoDB Atlas project when deploy, because deploying services often run various IPs. Go to your project in MongoDB Atlas **Network Access > Actions > EDIT > Allow access from anywhere**.

4. Have either Cloudflare Turnstile, [reCAPTCHA v3](https://www.google.com/recaptcha/about/) (upcoming...) or
   [hCaptcha](https://www.hcaptcha.com/) (upcoming...) to secure your subscribe form.
5. Chose where to deploy your Webie application.

## Usage

### 1. Copy and configure the required environment variables

If you haven't creat a .env file:

Run this in `/` shell.

```sh
mv .env.sample .env
```

1. `DATABASE_URL`: We are using MongoDB, please replace your Username, Password, and name your Database Name.
2. (optional) `VITE_TURNSTILE_SITE_KEY`: This key is used to
   [get Turnstile token](https://developers.cloudflare.com/turnstile/get-started/) in client, if you use
   [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) as captcha, so should be exposed in the
   frontend with _VITE_\_ prefix.
3. (optional) `TURNSTILE_SECRET_KEY`: Used to
   [verify Turnstile token](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) get in the
   frontend in the backend
4. `AED_SECRET`: Used to encrypt your magic link for authentication flow. Run
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to get one.
5. `COOKIE_SECRET`: Used to make your cookies secure. Run
   `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` to get one
6. `RESEND_API_KEY`: Send emails via Resend.
7. `BASE_URL`: This is the domain where you're hosting your Webie. e.g. `BASE_URL=webie.dev`

<!-- prettier-ignore -->
> [!WARNING]
> VITE will expose any environment variable with _VITE_\_ prefix, please use it carefully.

### 2. Install and generate prisma schema, then start

Run this in `/` shell to install packages and
[generate prisma schema for database](https://www.prisma.io/docs/orm/overview/databases/mongodb#how-to-use-prisma-orm-with-mongodb).

```sh
npm i && npx prisma generate && npx prisma db push
```

### 3. Start in dev mode

Run this in `/` shell to start in dev mode, press `q` to exit application, `r` to restart.

> For first time ever, you should pass in your email to set as admin, after verify, you will see `role : "ADMIN"` in the
> database **User** table.

```sh
npm run dev --email=your@ema.il
```

If you have already created admin:

```sh
npm run dev
```

4. Sign in at route `/admin`

# Documents

## Action

### Conventional Return

```ts
interface ActionResponse {
	data?: {}
	msg?: string
	err?: string
}

return json<ActionResponse>({ msg: 'Action success 🎉' })
```
