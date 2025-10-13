import { createAuthClient } from "better-auth/react";

const FE_URL = process.env.NEXT_PUBLIC_FE_URL || "http://ec2-13-61-14-231.eu-north-1.compute.amazonaws.com:3001";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL || "http://ec2-13-61-14-231.eu-north-1.compute.amazonaws.com:3002";

export const authClient = createAuthClient({
    baseURL: `${FE_URL}/api/auth/`, // the base url of your auth server
});
export const { signIn, signUp, useSession, signOut } = authClient;