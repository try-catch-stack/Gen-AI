'use client';

import { Code } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChatCompletionRequestMessage } from 'openai';
import { Montserrat } from 'next/font/google';
import ReactMarkdown from 'react-markdown';

import PageHeader from '@/components/page-header';
import { formSchema } from './constants';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Empty from '@/components/empty';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

import UserAvatar from '@/components/user-avatar';
import AssistantAvatar from '@/components/assistant-avatar';
import { useProModal } from '@/hooks/useProModal';
import { useToast } from '@/components/ui/use-toast';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function CodeGeneration() {
	const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

	const { openModal } = useProModal();

	const { toast } = useToast();

	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			prompt: '',
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const userMessage: ChatCompletionRequestMessage = {
				role: 'user',
				content: values.prompt,
			};

			const newMessages = [...messages, userMessage];

			const response = await axios.post('/api/code', {
				messages: newMessages,
			});

			setMessages((current) => [...current, userMessage, response.data]);
		} catch (e: any) {
			if (e?.response?.status === 403) {
				return openModal();
			}
			toast({
				title: 'Ops! An unexpected error occurred',
				description: e?.message || 'Please try again later',
				className: 'bg-red-500 text-white',
			});
		} finally {
			router.refresh();
		}
	};

	return (
		<div className='p-4'>
			<PageHeader
				title='Code Generation'
				description='Generate code using prompts'
				icon={Code}
				iconBgColor='bg-gray-400/10'
				iconColor='text-gray-400'
			/>
			<div className='my-4 px-2 py-2 border-slate-100 border rounded-md'>
				<Form {...form}>
					<form className='w-full grid grid-cols-10 p-2 ' onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name='prompt'
							render={({ field }) => (
								<FormItem className='col-span-10 md:col-span-8'>
									<FormControl>
										<Input
											placeholder='How do I read a text file in Python?'
											{...field}
											className='border-transparent focus-visible:ring-transparent placeholder:text-gray-300'
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button className='col-span-10 md:col-span-2 rounded-lg mx-0 mt-2 md:mx-2 md:mt-0' disabled={isLoading} type='submit'>
							Generate
						</Button>
					</form>
				</Form>
			</div>
			<div className={cn('m-4 text-black', montserrat.className)}>
				{!messages.length && !isLoading ? (
					<Empty label={'No code generated yet!'} />
				) : (
					messages.map((message) => (
						<div
							key={message.content}
							className={cn('my-2 flex items-center space-x-4 p-4 rounded-md border', message.role === 'user' ? 'bg-slate-300' : 'white')}
						>
							{message.role === 'user' ? (
								<>
									<UserAvatar />
									<div>{message.content}</div>
								</>
							) : (
								<>
									<AssistantAvatar />
									<ReactMarkdown
										components={{
											pre: ({ node, ...props }) => (
												<div className='w-full overflow-auto bg-slate-100 rounded-lg'>
													<pre className=' p-4 rounded-md' {...props} />,
												</div>
											),
											code: ({ node, ...props }) => <code className='text-sm text-white bg-slate-500 p-0.5 rounded-sm' {...props} />,
										}}
										className='overflow-hidden'
									>
										{message.content || ''}
									</ReactMarkdown>
								</>
							)}
						</div>
					))
				)}
				{isLoading && (
					<div className='flex flex-col space-y-2'>
						<div className='flex p-4 rounded-md items-center'>
							<Skeleton className='h-12 w-12 rounded-full' />
							<div className='space-y-2 flex-grow mx-4'>
								<Skeleton className='h-4' />
								<Skeleton className='h-4 w-4/5' />
							</div>
						</div>
						<div className='flex p-4 rounded-md items-center'>
							<Skeleton className='h-12 w-12 rounded-full' />
							<div className='space-y-2 flex-grow mx-4'>
								<Skeleton className='h-4' />
								<Skeleton className='h-4 w-4/5' />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
