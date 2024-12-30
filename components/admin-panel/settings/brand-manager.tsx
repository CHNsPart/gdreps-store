// components/admin-panel/settings/brand-manager.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseManager, BaseItem } from './base-manager';
import { toast } from '@/hooks/use-toast';

interface Brand extends BaseItem {
  slug: string;
}

interface BrandFormProps {
  formData: Partial<Brand>;
  setFormData: (data: Partial<Brand>) => void;
}

function BrandForm({ formData, setFormData }: BrandFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        value={formData.name || ''}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        placeholder="Enter brand name"
        required
      />
    </div>
  );
}

export function BrandManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands');
      if (response.status === 401) {
        toast({
          variant: "destructive",
          title: "Unauthorized access"
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast({
        variant: "destructive",
        title: "Failed to load brands"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (data: Omit<Brand, 'id' | 'slug'>) => {
    const response = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    await fetchBrands();
  };

  const handleEdit = async (id: string, data: Partial<Brand>) => {
    const response = await fetch('/api/admin/brands', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    await fetchBrands();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/brands?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    await fetchBrands();
  };

  return (
    <BaseManager
      title="Brand"
      items={brands}
      isLoading={isLoading}
      columns={[
        { header: 'Name', accessor: 'name' },
        { header: 'Slug', accessor: 'slug' }
      ]}
      FormContent={BrandForm}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}