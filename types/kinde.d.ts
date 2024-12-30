import '@kinde-oss/kinde-auth-nextjs';

declare module '@kinde-oss/kinde-auth-nextjs' {
  interface KindeUser {
    stripeCustomerId?: string;
  }
}