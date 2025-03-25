import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        username: { label: "email", type: "text", placeholder: "Email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials: any) {
        console.log(credentials);
        //validation
        return {
          id: "user1",
          name: "Surendra Singh",
          password: "surendrasinghc80@gmail.com",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // callbacks: {
  //   signIn: ({user}) => {
  //     if (user.email == randomperson@gmail.com) {
  //       return false
  //     } else {
  //       return true
  //     }
  //   }
  // }
});

export const GET = handler;
export const POST = handler;
