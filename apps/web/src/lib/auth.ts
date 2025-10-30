import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, schema } from "@odontox/db";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

// Full auth config with database (for API routes only)
export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db as any) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      // Attach role/tenantId when available
      if (user && (user as any).tenantId) token.tenantId = (user as any).tenantId;
      if (user && (user as any).role) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      (session as any).tenantId = (token as any).tenantId;
      (session as any).role = (token as any).role;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Keep same-origin redirects only
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    }
  },
  providers: [
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        // Look up user
        const userRows = await db
          .select({ id: schema.users.id, email: schema.users.email, passwordHash: schema.users.passwordHash })
          .from(schema.users)
          .where(eq(schema.users.email, email))
          .limit(1);
        const user = userRows[0];
        if (!user || !user.passwordHash) return null;
        const ok = await argon2.verify(user.passwordHash, password);
        if (!ok) return null;

        // Resolve tenant and role via org membership (first membership for now)
        const memberships = await db
          .select({ tenantId: schema.orgMembers.tenantId, role: schema.orgMembers.role })
          .from(schema.orgMembers)
          .where(eq(schema.orgMembers.userId, user.id))
          .limit(1);
        const membership = memberships[0];
        if (!membership) return null;
        return { id: user.id, email: user.email, tenantId: membership.tenantId, role: membership.role } as any;
      }
    })
  ],
  trustHost: true
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

