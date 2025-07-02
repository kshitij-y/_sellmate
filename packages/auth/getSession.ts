import { auth } from "./auth";

export async function getSession(req: Request) {
  const session = await auth.api.getSession(req);

  if (!session) {
    throw new Error("No session found");
  }

  return session;
}
