import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

// Get URL from environment or generate a default one
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.RAILWAY_STATIC_URL) {
    return `https://${process.env.RAILWAY_STATIC_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  baseUrl: getBaseUrl(),
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