import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      tenantId?: string;
      email?: string | null;
      name?: string | null;
    };
  }
}
