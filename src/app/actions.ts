'use server'

import { feedbackFormSchema } from "@/components/FeedbackDialog"
import supabase from "@/utils/supabase"
import { z } from "zod"

export async function submitFeedback(data: z.infer<typeof feedbackFormSchema>) {

  const { email, feedback } = data

  const { error } = await supabase
    .from('feedback')
    .insert({ email: email, feedback: feedback })

  return (error === null)
}
