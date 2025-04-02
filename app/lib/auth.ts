import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Username",
          type: "text",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(
            "https://demo-ynml.onrender.com/api/user/signin",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Signup failed");
          }

          const user = await response.json();

          if (!user?.token) {
            throw new Error("Invalid response from server");
          }

          return {
            id: user._id,
            name: user.email,
            backendToken: user.token,
          };
        } catch (error) {
          console.error("Signup error:", error.message);
          throw new Error(error.message || "Signup failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // token.id = user._id;
        token.backendToken = user.backendToken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.backendToken = token.backendToken;
      // session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
