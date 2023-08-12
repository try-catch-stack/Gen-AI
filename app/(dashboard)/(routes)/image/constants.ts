import * as z from 'zod';

export const formSchema = z.object({
	prompt: z.string().min(1, { message: 'Prompt is required' }),
	imageCount: z.string().min(1, { message: 'Amount is required' }).default('1'),
	resolution: z.string().min(1, { message: 'Resolution is required' }).default('512x512'),
});
