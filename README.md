# Papa CMS

<!-- prettier-ignore -->
> [!NOTE]
> Welcome to PapaCMS, this is an open-source project for building modern web with React and TypeScript.

## Tech Stack

-   **Framework**: [React Router v7](https://reactrouter.com/home/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Style**: [tailwindcss](https://tailwindcss.com/)
-   **UI LIbrary**: [shadcn/ui](https://ui.shadcn.com/)
-   **Email SDK**: [Resend](https://resend.com/)

## Why use PapaCMS?

1. Totally free and completely without branding logos.
2. You own the codebase and fully customizable.
3. Modulized, take what you want and build with _Typescript_, _HTML_,
   _TSX_/_JSX_, and _tailwindcss_.
4. Optimized for performance, start with **score 100**, tested by
   [PageSpeed](https://pagespeed.web.dev/).
5. Authenticate with **Email Magic Link**.

---

## Required documents

1. environment variable file `.env` in the root directory (`/`)

## Before you start

You should:

1. Have a useful IDE. (e.g.
   [Visual Studio Code](https://code.visualstudio.com/))
2. Have a [MongoDB Atlas](https://www.mongodb.com/docs/atlas/) (MongoDB's cloud
   service) account or your own MongoDB Database to host your database. With
   MongoDB Atlas, an account could have multiple projects, and every project has
   up to [1 free 512MB M0 cluster](https://www.mongodb.com/pricing), which equal
   to more than 17,000
   [What is PapaCMS (30kB)](https://papacms.com/blog/what-is-papa) post.
3. Have a [Resend](https://resend.com/) account to send email. Every Resend
   account has a [free 3,000 emails / mo quota](https://resend.com/pricing).

<!-- prettier-ignore -->
> [!INFO]
> You should allow all IPs, or all posible IPs, to connect to your MongoDB Atlas project when deploy, because deploying services on the market often run their server on various IPs. Go to your project in MongoDB Atlas **Network Access > Actions > EDIT > Allow access from anywhere**.

4. Have either
   [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/),
   [reCAPTCHA v3](https://www.google.com/recaptcha/about/) (upcoming...) or
   [hCaptcha](https://www.hcaptcha.com/) (upcoming...) to secure your subscribe
   form.
5. Chose where to deploy your PapaCMS application.

## Usage

### 1. Copy and configure the required environment variables

If you haven't creat a .env file:

Run this in `/` shell.

```sh
mv .env.sample .env
```

1. `SUPER_EMAIL`: Your super admin email.
2. `DATABASE_URL`: We are using MongoDB, please replace your Username, Password,
   and name your Database Name.
3. (optional) In `/app/constants/env.ts` set `TURNSTILE_SITE_KEY`: This key is
   used to
   [get Turnstile token](https://developers.cloudflare.com/turnstile/get-started/)
   in client, if you use
   [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) as
   captcha, so should be exposed in the frontend with _VITE_\_ prefix.
4. (optional) `TURNSTILE_SECRET_KEY`: Used to
   [verify Turnstile token](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
   get in the frontend in the backend
5. `AED_SECRET`: Used to encrypt your magic link for authentication flow. Run
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to
   get one.
6. `COOKIE_SECRET`: Used to make your cookies secure. Run
   `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` to
   get one
7. `RESEND_API_KEY`: Send emails via Resend.
8. `BASE_URL`: This is the domain where you're hosting your PapaCMS. e.g.
   `BASE_URL=papacms.com`
9. (optional) `GOOGLE_GENERATIVE_AI_API_KEY`, `OPENAI_API_KEY`,
   `ANTHROPIC_API_KEY`: For use of Generative AI in `/admin/api/ai`
10. `OBJECT_STORAGE_ACCESS_KEY_ID`, `OBJECT_STORAGE_SECRET_ACCESS_KEY`,
    `OBJECT_STORAGE_ACCOUNT_ID`: Where you save your objects, accept S3
    compatible services. Using in route `/admin/api/object-storage`

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

> For first time ever, you should set super admin email address in `.env` file,
> and make sure your email server has set (fill in your `RESEND_API_KEY`). Then
> run `npm run check-admin && npm run dev`, it will send a verification email to
> you. After verify, papa will create an ADMIN role user and you will see
> `role : "ADMIN"` in the database **User** table.

Run this in `/` shell to start in dev mode, press `q` to exit application, `r`
to restart.

```sh
npm run check-admin && npm run dev
```

If you sure have already created admin:

```sh
npm run dev
```

4. Sign in at route `/admin`

# Documents

## Action

### Conventional Return

Refer to: [Definitions in lib/utils](./app/lib/utils.tsx)

```ts
type ConventionalSuccess = {
    msg: string
    data?: unknown
}
type ConventionalError = {
    err: string
    data?: unknown
}

return json<ConventionalSuccess>({ msg: 'Action success 🎉' })
return json<ConventionalError>({ err: 'Something went wrong 🚨' })
```
