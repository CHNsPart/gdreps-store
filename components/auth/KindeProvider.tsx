'use client';

import { KindeProvider as BaseKindeProvider } from "@kinde-oss/kinde-auth-nextjs";

export default function KindeProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseKindeProvider>{children}</BaseKindeProvider>
  );
}