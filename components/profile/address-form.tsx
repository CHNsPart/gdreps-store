'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MapPin } from 'lucide-react';
import { AddressFormData } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface AddressFormProps {
  initialAddress?: string | null;
  onSubmit: (data: AddressFormData) => Promise<void>;
}

export function AddressForm({ initialAddress, onSubmit }: AddressFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(initialAddress || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({ shippingAddress: address });
      toast({
        title: "Success",
        description: "Shipping address updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update shipping address",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MapPin className="size-4" />
        <h2>Shipping Address</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your shipping address..."
          className="min-h-[100px]"
          required
        />
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Address...
            </>
          ) : (
            'Update Address'
          )}
        </Button>
      </form>
    </motion.div>
  );
}