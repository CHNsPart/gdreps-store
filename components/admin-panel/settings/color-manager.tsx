// components/admin-panel/settings/color-manager.tsx
'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseManager } from "./base-manager";
import { useColors, Color } from '@/hooks/use-colors';
import { formatHexColor } from "@/lib/utils";

interface ColorFormProps {
  formData: Partial<Color>;
  setFormData: (data: Partial<Color>) => void;
}

function ColorForm({ formData, setFormData }: ColorFormProps) {
  const handleHexChange = (value: string) => {
    // Remove any spaces and ensure the value starts with #
    let formattedHex = value.trim();
    formattedHex = formatHexColor(formattedHex);
    setFormData({ ...formData, hex: formattedHex });
  };

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
          placeholder="Enter color name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hex">Color</Label>
        <div className="flex gap-3">
          <Input
            id="hex"
            type="color"
            value={formData.hex || '#000000'}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-24 p-1 h-9"
            required
          />
          <Input
            value={formData.hex || ''}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            required
          />
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ hex }: { hex: string }) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-6 h-6 rounded-full border"
        style={{ backgroundColor: hex }}
      />
      <span>{hex.toUpperCase()}</span>
    </div>
  );
}

export function ColorManager() {
  const { data: colors = [], isLoading, refetch } = useColors();

  const handleAdd = async (data: Omit<Color, 'id'>) => {
    const response = await fetch('/api/admin/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    refetch();
  };

  const handleEdit = async (id: string, data: Partial<Color>) => {
    const response = await fetch('/api/admin/colors', {
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
    const response = await fetch(`/api/admin/colors?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    refetch();
  };

  return (
    <BaseManager
      title="Color"
      items={colors}
      isLoading={isLoading}
      columns={[
        { header: 'Name', accessor: 'name' },
        { 
          header: 'Color Code', 
          accessor: 'hex',
          render: (value) => <ColorSwatch hex={value} />
        },
      ]}
      FormContent={ColorForm}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}