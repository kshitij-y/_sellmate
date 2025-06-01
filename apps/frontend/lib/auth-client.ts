import { createAuthClient } from "better-auth/react";

const FE_URL = process.env.NEXT_PUBLIC_FE_URL || "http://localhost:3001";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: `${BE_URL}/api/auth/`, // the base url of your auth server
});
export const { signIn, signUp, useSession, signOut } = authClient;