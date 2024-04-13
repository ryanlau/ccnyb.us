'use client'

import React, { useState, useEffect } from 'react';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function WelcomeDialog() {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Check local storage to see if the dialog has already been shown
    const hasShownDialog = localStorage.getItem('hasShownDialog');

    // If it hasn't been shown, display the dialog and update local storage
    if (!hasShownDialog) {
      setShowDialog(true);
      localStorage.setItem('hasShownDialog', 'true');
    }
  }, []);

  return (
    <>
      <Dialog open={true}>
        <DialogContent className="mx-6">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
