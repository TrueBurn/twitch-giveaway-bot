'use client';

import { useState, type ChangeEvent } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { PreviewOverlay } from '@/components/overlay/preview-overlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

export default function OverlayPreviewPage() {
  const [previewState, setPreviewState] = useState({
    prize: 'Gaming Chair',
    entries: 42,
    winner: '',
  });

  const [overlayUrl, setOverlayUrl] = useState('');

  // Generate overlay URL when component mounts
  useState(() => {
    const baseUrl = window.location.origin;
    setOverlayUrl(`${baseUrl}/overlay/winner`);
  });

  const copyOverlayUrl = () => {
    navigator.clipboard.writeText(overlayUrl)
      .then(() => toast.success('URL copied to clipboard'))
      .catch(() => toast.error('Failed to copy URL'));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overlay Preview</h1>
          <p className="text-muted-foreground">
            Preview and test your overlay before going live
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preview Controls */}
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Preview Controls</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prize Name
                  </label>
                  <Input
                    value={previewState.prize}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreviewState(prev => ({
                      ...prev,
                      prize: e.target.value
                    }))}
                    placeholder="Enter prize name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Entries
                  </label>
                  <Input
                    type="number"
                    value={previewState.entries}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPreviewState(prev => ({
                      ...prev,
                      entries: parseInt(e.target.value) || 0
                    }))}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Winner (optional)
                  </label>
                  <Input
                    value={previewState.winner}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPreviewState(prev => ({
                      ...prev,
                      winner: e.target.value
                    }))}
                    placeholder="Enter winner name"
                  />
                </div>

                <div className="pt-4 space-x-2">
                  <Button
                    onClick={() => setPreviewState(prev => ({
                      ...prev,
                      winner: ''
                    }))}
                  >
                    Show Entries
                  </Button>
                  <Button
                    onClick={() => setPreviewState(prev => ({
                      ...prev,
                      winner: 'TestUser123'
                    }))}
                  >
                    Test Winner
                  </Button>
                </div>
              </div>
            </div>

            {/* OBS Setup Instructions */}
            <div className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">OBS Setup</h2>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add this URL as a Browser Source in OBS:
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={overlayUrl}
                    readOnly
                    onClick={(e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.select()}
                  />
                  <Button
                    onClick={copyOverlayUrl}
                  >
                    Copy
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Recommended settings:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Width: 1920px</li>
                    <li>Height: 1080px</li>
                    <li>Custom CSS: body &#123; background-color: rgba(0, 0, 0, 0); &#125;</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Window */}
          <div>
            <PreviewOverlay
              prize={previewState.prize}
              entries={previewState.entries}
              winner={previewState.winner}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 