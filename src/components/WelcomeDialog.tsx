'use client'

import React, { useState, useEffect } from 'react';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="rounded-lg max-w-[80svw] md:max-w-prose">
          <DialogHeader>
            <DialogTitle className='text-start'>thank you for using ccnyb.us!</DialogTitle>
            <DialogDescription className='text-start text-pretty'>
              this site is powered by an ai model that detects the shuttle bus on public camera feeds. <br /> <br /> the model is fairly accurate, but not perfect, so we encourage you to verify that the bus was correctly detected. we are continuously making improvements and hope that this won&apos;t be necessary in the near future.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
