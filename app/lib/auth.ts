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
      authorize: async (credentials) => {
        try {
          let response = await fetch(
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
            // If login fails, try to sign up the user
            response = await fetch(
              "https://demo-ynml.onrender.com/api/user/signup",
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
          }

          const user = await response.json();

          if (!user?.token) {
            throw new Error("Invalid response from server");
          }

          return {
            id: user.userId,
            email: user.email,
            backendToken: user.token,
          };
        } catch (error) {
          console.error("Auth error:", error.message);
          throw new Error(error.message || "Authentication failed");
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
        token.backendToken = user.backendToken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.backendToken = token.backendToken;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
