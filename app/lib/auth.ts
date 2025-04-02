import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
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
            "https://demo-ynml.onrender.com/api/user/signup",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials?.username,
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

          // Return the user data along with the backend token
          return {
            id: user.userName, // Assuming userName is unique
            name: user.userName,
            backendToken: user.token, // Store JWT token
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
        token.backendToken = user.backendToken; // Store backend JWT in token
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.backendToken = token.backendToken; // Include JWT in session
      return session;
    },
  },
  // session: {
  //   strategy: "jwt",
  //   maxAge: 30 * 24 * 60 * 60,
  // },
  pages: {
    signIn: "/signin", // Customize sign-in page if needed
  },
};
