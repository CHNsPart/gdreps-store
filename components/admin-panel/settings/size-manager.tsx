// components/admin-panel/settings/size-manager.tsx
'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BaseManager } from "./base-manager";
import { useSizes, Size } from '@/hooks/use-sizes';
import { capitalize } from "@/lib/utils";

const SIZE_TYPES = ['clothing', 'shoes'] as const;
type SizeType = typeof SIZE_TYPES[number];

interface SizeFormProps {
  formData: Partial<Size>;
  setFormData: (data: Partial<Size>) => void;
}

function SizeForm({ formData, setFormData }: SizeFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Enter size name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData({ ...formData, type: value as SizeType })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size type" />
          </SelectTrigger>
          <SelectContent>
            {SIZE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {capitalize(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function SizeManager() {
  const { data: sizes = [], isLoading, refetch } = useSizes();

  const handleAdd = async (data: Omit<Size, 'id'>) => {
    const response = await fetch('/api/admin/sizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    refetch();
  };

  const handleEdit = async (id: string, data: Partial<Size>) => {
    const response = await fetch('/api/admin/sizes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    refetch();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/sizes?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    refetch();
  };

  return (
    <BaseManager
      title="Size"
      items={sizes}
      isLoading={isLoading}
      columns={[
        { header: 'Name', accessor: 'name' },
        { 
          header: 'Type', 
          accessor: 'type',
          render: (value) => capitalize(value) 
        },
      ]}
      FormContent={SizeForm}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}