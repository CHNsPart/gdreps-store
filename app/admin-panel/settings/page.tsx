// app/admin-panel/settings/page.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryManager } from '@/components/admin-panel/settings/category-manager';
import { BrandManager } from '@/components/admin-panel/settings/brand-manager';
import { SizeManager } from '@/components/admin-panel/settings/size-manager';
import { ColorManager } from '@/components/admin-panel/settings/color-manager';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/components/providers/settings-provider';

export default function SettingsPage() {
  return (
    <SettingsProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container p-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Store Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
                <TabsTrigger value="sizes">Sizes</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories">
                <CategoryManager />
              </TabsContent>
              
              <TabsContent value="brands">
                <BrandManager />
              </TabsContent>
              
              <TabsContent value="sizes">
                <SizeManager />
              </TabsContent>
              
              <TabsContent value="colors">
                <ColorManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Toaster />
      </motion.div>
    </SettingsProvider>
  );
}