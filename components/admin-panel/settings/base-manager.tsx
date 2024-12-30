// components/admin-panel/settings/base-manager.tsx
'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from '@/hooks/use-toast';

export interface BaseItem {
  id: string;
  name: string;
  [key: string]: any;
}

interface BaseManagerProps<T extends BaseItem> {
  title: string;
  items: T[];
  isLoading: boolean;
  columns: {
    header: string;
    accessor: keyof T;
    render?: (value: any) => React.ReactNode;
  }[];
  FormContent: React.ComponentType<{
    formData: Partial<T>;
    setFormData: (data: Partial<T>) => void;
  }>;
  onAdd: (data: Omit<T, 'id'>) => Promise<void>;
  onEdit: (id: string, data: Partial<T>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function BaseManager<T extends BaseItem>({
  title,
  items,
  isLoading,
  columns,
  FormContent,
  onAdd,
  onEdit,
  onDelete,
}: BaseManagerProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Partial<T>>({});
  const [processing, setProcessing] = useState(false);

  const getItemLink = (item: T) => {
    // Determine the correct base path based on the title
    const basePath = title.toLowerCase() === 'category' ? 'categories' : 'brands';
    return `/${basePath}/${item.slug}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (selectedItem) {
        await onEdit(selectedItem.id, formData);
        toast({ title: `${title} updated successfully` });
      } else {
        await onAdd(formData as Omit<T, 'id'>);
        toast({ title: `${title} added successfully` });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: `Failed to ${selectedItem ? 'update' : 'add'} ${title.toLowerCase()}`,
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setProcessing(true);

    try {
      await onDelete(selectedItem.id);
      toast({ title: `${title} deleted successfully` });
      setIsDeleteDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: `Failed to delete ${title.toLowerCase()}`,
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedItem(null);
    setFormData({});
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title} Management</h2>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {title}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.accessor)}>{column.header}</TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No {title.toLowerCase()}s found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={String(column.accessor)}>
                      {column.render
                        ? column.render(item[column.accessor])
                        : item[column.accessor]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setFormData(item);
                          setIsDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? `Edit ${title}` : `Add ${title}`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <FormContent formData={formData} setFormData={setFormData} />
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : selectedItem ? (
                  `Update ${title}`
                ) : (
                  `Create ${title}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {title}</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{' '}
            <span className="font-semibold">{selectedItem?.name}</span>? This
            action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={processing}
              onClick={handleDelete}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Delete ${title}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}