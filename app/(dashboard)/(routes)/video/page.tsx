'use client';

import { Video } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Montserrat } from 'next/font/google';

import PageHeader from '@/components/page-header';
import { formSchema } from './constants';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Empty from '@/components/empty';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function VideoGeneration() {
	const [video, setVideo] = useState('');

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
			setVideo('');
			const response = await axios.post('/api/video', {
				prompt: values.prompt,
			});
			setVideo(response.data[0]);
			form.reset();
		} catch (e) {
			console.log(e);
		} finally {
			router.refresh();
		}
	};

	return (
		<div className='p-4'>
			<PageHeader
				title='Video Generation'
				description='Generate videos using text'
				icon={Video}
				iconBgColor='bg-yellow-300/10'
				iconColor='text-yellow-300'
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
											placeholder='Cat dancing on a table'
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
				{!video && !isLoading ? <Empty label={'No video generated yet'} /> : null}
				{video && (
					<video controls className='w-full my-16 aspect-video rounded-lg'>
						<source src={video} />
					</video>
				)}

				{isLoading && (
					<div className='flex flex-col space-y-2'>
						<div className='space-y-2 flex-grow'>
							<Skeleton className='h-80 rounded-2xl bg-slate-200' />
						</div>
						<div className='w-full text-center animate-pulse'>Generating video...</div>
						<div className='w-full text-center'>It might take a few minutes to complete</div>
					</div>
				)}
			</div>
		</div>
	);
}
