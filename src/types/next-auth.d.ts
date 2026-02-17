import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            linkedinUrl?: string | null
        } & DefaultSession["user"]
    }

    interface User {
        linkedinUrl?: string | null
    }
}
