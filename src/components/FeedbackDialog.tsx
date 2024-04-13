'use client'

import React from 'react';

import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { submitFeedback } from '@/app/actions';
import { Textarea } from './ui/textarea';

export const feedbackFormSchema = z.object({
  feedback: z.string().min(1, { message: "feedback is required" }),
  email: z.union([z.string().email({ message: "invalid email" }), z.literal("")]),
});

export default function FeedbackDialog() {

  const [isOpen, setIsOpen] = React.useState(false)


  const form = useForm<z.infer<typeof feedbackFormSchema>>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedback: '',
      email: '',
    }
  })

  function onSubmit(values: z.infer<typeof feedbackFormSchema>) {
    submitFeedback(values)
    setIsOpen(false)
    form.reset()
    toast("feedback submitted <3")
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>leave feedback</DialogTrigger>
        <DialogContent className="rounded-lg max-w-[80svw] w-96">
          <DialogHeader>
            <DialogTitle className='text-start'>leave feedback</DialogTitle>
            <DialogDescription className='text-left'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-black dark:text-white text-base'>email</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>
                          optional
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-black dark:text-white text-base' >feedback</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder=""
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          your feedback is important to us!
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">submit</Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};


