'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Loader2 } from 'lucide-react';
import { User, UserFormData, AddressFormData } from '@/types/user';
import { UserDetails } from '@/components/profile/user-details';
import { AddressForm } from '@/components/profile/address-form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserOrderTable } from '@/components/profile/user-order-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function ProfilePage() {
  const { user: kindeUser, isLoading: authLoading } = useKindeAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!authLoading && kindeUser) {
          const response = await fetch('/api/user/profile?includeOrders=true');
          if (!response.ok) throw new Error('Failed to fetch profile');
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [authLoading, kindeUser]);

  const handleUpdateProfile = async (data: UserFormData) => {
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  const handleUpdateAddress = async (data: AddressFormData) => {
    const response = await fetch('/api/user/address', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update address');
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto py-10 space-y-8 px-4 md:px-6"
      >
        <div className=''>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and track your orders
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {user ? (
            <TabsContent value="profile" className="space-y-8">
              <UserDetails 
                user={user} 
                onSubmit={handleUpdateProfile} 
              />

              <Separator />

              <AddressForm 
                initialAddress={user.shippingAddress}
                onSubmit={handleUpdateAddress}
              />
            </TabsContent>
          ) : (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View and track all your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserOrderTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </QueryClientProvider>
  );
}