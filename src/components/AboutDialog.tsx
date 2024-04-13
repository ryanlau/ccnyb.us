'use client'

import React from 'react';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function AboutDialog() {
  return (
    <>
      <Dialog>
        <DialogTrigger>about</DialogTrigger>
        <DialogContent className="rounded-lg max-w-[80svw] md:max-w-prose">
          <DialogHeader>
            <DialogTitle className='text-start'>about ccnyb.us</DialogTitle>
            <DialogDescription className='text-start text-pretty'>
              this site is powered by an ai model that detects the shuttle bus on public camera feeds. <br /> <br /> the model is fairly accurate, but not perfect, so we encourage you to verify that the bus was correctly detected. we are continuously making improvements and hope that this won&apos;t be necessary in the near future.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
