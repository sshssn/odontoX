import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";

// Edge-compatible auth config (no database, no Node.js modules)
export const authConfig: NextAuthConfig = {
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
    }
  },
  providers: []
};

export const { auth } = NextAuth(authConfig);


