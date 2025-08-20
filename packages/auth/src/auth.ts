import dotenv from "dotenv";
dotenv.config();

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { schema } from "@kshitij_npm/sell_db";
import { jwt } from "better-auth/plugins";
import { sendEmail } from "./mailer.js";
import { getDb } from "@kshitij_npm/sell_db";

const FE_URL = process.env.FE_URL;
const BE_URL = process.env.BE_URL;
const JWT_SECRET = process.env.JWT_SECRET!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const db = getDb();

export const auth = betterAuth({
  plugins: [jwt()],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  usersTable: "user",
  baseUrl: `${BE_URL}/api/auth/`,
  jwtSecret: JWT_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri: `${BE_URL}/api/auth/callback/google`,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const callbackURL = `${FE_URL}/dashboard`;
      const updatedURL = `${BE_URL}/api/auth/verify-email?token=${token}&callbackURL=${encodeURIComponent(
        callbackURL
      )}`;

      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        url: updatedURL,
      });
    },
  },
  trustedOrigins: [BE_URL, FE_URL].filter(
    (url): url is string => typeof url === "string"
  ),
});
