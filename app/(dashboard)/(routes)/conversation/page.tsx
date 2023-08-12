'use client';

import { MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChatCompletionRequestMessage } from 'openai';
import { Montserrat } from 'next/font/google';

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

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Conversation() {
	const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

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

			const response = await axios.post('/api/conversation', {
				messages: newMessages,
			});

			setMessages((current) => [...current, userMessage, response.data]);
		} catch (e) {
			console.log(e);
		} finally {
			router.refresh();
		}
	};

	return (
		<div className='p-4'>
			<PageHeader
				title='Conversation'
				description='Talk to your AI assistant'
				icon={MessageSquare}
				iconBgColor='bg-green-300/10'
				iconColor='text-green-300'
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
											placeholder='Which is the largest continent on Earth?'
											{...field}
											className='border-transparent focus-visible:ring-transparent'
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
					<Empty label={'No messages to display'} />
				) : (
					messages.map((message) => (
						<div
							key={message.content}
							className={cn('my-2 flex items-center space-x-2 p-4 rounded-md', message.role === 'user' ? 'bg-slate-300' : 'white')}
						>
							{message.role === 'user' ? <UserAvatar /> : <AssistantAvatar />}
							<div>{message.content}</div>
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
