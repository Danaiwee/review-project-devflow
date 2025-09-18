import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { IAccountDoc } from "./database/account.model";
import { IUserDoc } from "./database/user.model";
import { api } from "./lib/api";
import { SignInSchema } from "./lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedField = SignInSchema.safeParse(credentials);

        if (validatedField.success) {
          const { email, password } = validatedField.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;
          if (!existingAccount) return null;

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IUserDoc>;
          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            //This return stored in user object
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }

        return null; //login fails
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true; // no profile object in case of credentials
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
        user: userInfo,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },

    async jwt({ token, account }) {
      if (account) {
        const { success, data: existingAccount } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
  },
});

//Example object
/*user object example
{
  "id": "123456789012345678901",
  "name": "Danai Weerayutwattana",
  "email": "danai@example.com",
  "image": "https://lh3.googleusercontent.com/a/AA12345"
}
*/

/*profile object example
  {
  "sub": "123456789012345678901",
  "name": "Danai Weerayutwattana",
  "given_name": "Danai",
  "family_name": "Weerayutwattana",
  "email": "danai@example.com",
  "email_verified": true,
  "picture": "https://lh3.googleusercontent.com/a/AA12345",
  "locale": "en"
  }
*/

/*account object example
  {
  "provider": "google",
  "type": "oauth",
  "providerAccountId": "123456789012345678901",
  "access_token": "ya29.a0AfH6SM...",
  "token_type": "Bearer",
  "scope": "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
  }
*/

/*token object example
  {
  name: "Danai Weerayutwattana",   // from user.name
  email: "danai@example.com",      // from user.email
  picture: "https://avatars.githubusercontent.com/u/12345?v=4", // user.image
  sub: "64f82a6d9c4d1d001234abcd", // MongoDB _id of the user, set in jwt callback
  iat: 1693550000,                 // issued-at timestamp
  exp: 1694154800,                 // expiration timestamp (based on session maxAge)
  jti: "randomJWTId123"            // JWT unique ID
  }
*/

/*session object
  {
  user: {
    id: "64f82a6d9c4d1d001234abcd",   // MongoDB user _id from token.sub
    name: "Danai Weerayutwattana",    // from OAuth provider
    email: "danai@example.com",       // from OAuth provider
    image: "https://avatars.githubusercontent.com/u/12345?v=4" // from OAuth provider
  },
  expires: "2025-09-30T12:34:56.789Z" // session expiration timestamp
}
*/
