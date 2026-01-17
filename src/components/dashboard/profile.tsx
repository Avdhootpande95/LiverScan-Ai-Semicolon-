'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

const ProfileField = ({ label, value, soon }: { label: string; value: string, soon?: boolean }) => (
  <div className="grid grid-cols-3 items-center gap-4 text-sm">
    <Label className="text-right font-normal text-muted-foreground">{label}</Label>
    <div className="col-span-2 flex items-center gap-2">
      <p className="font-medium">{value}</p>
      {soon && <span className="text-xs text-muted-foreground/70">(soon)</span>}
    </div>
  </div>
);

export function ProfileOption() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DropdownMenuItem onSelect={(e) => {
        e.preventDefault();
        setIsOpen(true);
      }}>
        Profile
      </DropdownMenuItem>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>My Profile</DialogTitle>
            <DialogDescription>
              This information is for display only. Editing will be available soon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <ProfileField label="Name" value="Alex Ray" />
            <ProfileField label="Date of Birth" value="01/15/1985" />
            <ProfileField label="Phone Number" value="(555) 123-4567" />
            <ProfileField label="Age" value="39" />
            <ProfileField label="Email" value="alex.ray@example.com" />
            <ProfileField label="Location" value="San Francisco, CA" />
            <ProfileField label="History" value="View Medical History" soon />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
