import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to account page after sign in
      return `${baseUrl}/account`;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
};

// Export the NextAuth handler as the default export
export default NextAuth(authOptions); 