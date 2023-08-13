'use client';

import { Music } from 'lucide-react';
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

export default function MusicGeneration() {
	const [music, setMusic] = useState('');

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
			setMusic('');
			const response = await axios.post('/api/music', {
				prompt: values.prompt,
			});
			setMusic(response.data.audio);
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
				title='Music Generation'
				description='Create music using text'
				icon={Music}
				iconBgColor='bg-purple-400/10'
				iconColor='text-purple-400'
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
											placeholder='Soothing Piano Chords'
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
				{!music && !isLoading ? <Empty label={'No music generated yet'} /> : null}
				{music && (
					<audio controls className='w-full my-16'>
						<source src={music} />
					</audio>
				)}

				{isLoading && (
					<div className='flex flex-col space-y-2'>
						<div className='space-y-2 flex-grow'>
							<Skeleton className='h-12 rounded-2xl' />
						</div>
						<div className='w-full text-center animate-pulse'>Generating music...</div>
						<div className='w-full text-center'>It might take a few minutes to complete</div>
					</div>
				)}
			</div>
		</div>
	);
}
