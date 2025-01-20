'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toast';

interface CreateGiveawayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface GiveawayFormData {
  title: string;
  description: string;
  prize: string;
  requirements: string;
  duration?: number; // in minutes
}

export function CreateGiveawayModal({ isOpen, onClose, onSuccess }: CreateGiveawayModalProps) {
  const [formData, setFormData] = useState<GiveawayFormData>({
    title: '',
    description: '',
    prize: '',
    requirements: '',
    duration: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('giveaways')
        .insert({
          title: formData.title,
          description: formData.description,
          prize: formData.prize,
          requirements: formData.requirements,
          duration_minutes: formData.duration,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Giveaway created successfully');
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating giveaway:', error);
      toast.error('Failed to create giveaway');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      prize: '',
      requirements: '',
      duration: undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Giveaway</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Title
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Prize
              <input
                type="text"
                value={formData.prize}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  prize: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                required
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Description
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                rows={3}
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Requirements
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  requirements: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                rows={2}
                placeholder="Follow channel, subscriber only, etc."
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Duration (minutes)
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  duration: e.target.value ? parseInt(e.target.value) : undefined
                }))}
                className="mt-1 block w-full rounded-md border px-3 py-2"
                min="1"
                placeholder="Optional"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Giveaway'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 