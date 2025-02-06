import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from "drizzle-orm";

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        // Check if user already exists in DB
        const existingUser = await db.execute(
          sql`SELECT * FROM users WHERE email = ${user.email} LIMIT 1`
        );

        if (existingUser.rows.length === 0) {
          // Assign 'admin' role to the first user only
          const isFirstUser = await db.execute(sql`SELECT * FROM users LIMIT 1`);
          await db.execute(
            sql`
              INSERT INTO users (email, name, role) 
              VALUES (${user.email}, ${user.name},  
              ${isFirstUser.rows.length === 0 ? "admin" : "user"})
            `
          );
        }
      }
      return true;
    },

    async session({ session }) {
      if (session.user) {
        const userData = await db.execute(
          sql`SELECT role FROM users WHERE email = ${session.user.email} LIMIT 1`
        );

        if (userData.rows.length > 0) {
          session.user.role = userData.rows[0].role; // Attach role to session
        }
      }
      return session;
    },
  },
});
