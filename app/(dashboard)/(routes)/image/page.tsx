'use client';

import { Download, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import PageHeader from '@/components/page-header';
import { formSchema } from './constants';
import Empty from '@/components/empty';
import { useProModal } from '@/hooks/useProModal';
import { useToast } from '@/components/ui/use-toast';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function ImageGeneration() {
	const [images, setImages] = useState<{ url: string }[]>([]);

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
			setImages([]);
			const response = await axios.post('/api/image', {
				prompt: values.prompt,
				imageCount: values.imageCount,
				resolution: values.resolution,
			});
			setImages(response.data);
			form.reset();
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
				title='Image Generation'
				description='Turn your imagination into reality'
				icon={MessageSquare}
				iconBgColor='bg-red-400/10'
				iconColor='text-red-400'
			/>
			<div className='my-4 px-2 py-2 border-slate-100 border rounded-md'>
				<Form {...form}>
					<form className='w-full grid grid-cols-12 p-2 ' onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name='prompt'
							render={({ field }) => (
								<FormItem className='col-span-12 md:col-span-8 lg:col-span-6'>
									<FormControl>
										<Input
											placeholder='A futuristic cityscape at night with neon lights'
											{...field}
											className='border-transparent focus-visible:ring-transparent placeholder:text-gray-300'
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='imageCount'
							render={({ field }) => (
								<FormItem className='col-span-6 md:col-span-2 mx-1'>
									<FormControl>
										<Select disabled={isLoading} value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger className='focus-visible:ring-transparent'>
												<SelectValue placeholder='Image count' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='1'>1 Photo</SelectItem>
												<SelectItem value='2'>2 Photos</SelectItem>
												<SelectItem value='3'>3 Photos</SelectItem>
												<SelectItem value='4'>4 Photos</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='resolution'
							render={({ field }) => (
								<FormItem className='col-span-6 md:col-span-2'>
									<FormControl>
										<Select disabled={isLoading} value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
											<SelectTrigger className='focus-visible:ring-transparent'>
												<SelectValue placeholder='Resolution' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='256x256'>256x256</SelectItem>
												<SelectItem value='512x512'>512x512</SelectItem>
												<SelectItem value='1024x1024'>1024x1024</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button className='col-span-12 lg:col-span-2 rounded-lg mx-0 mt-2 md:mt-4 lg:mx-2 lg:mt-0' disabled={isLoading} type='submit'>
							Generate
						</Button>
					</form>
				</Form>
			</div>
			<div className={cn('m-4 text-black', montserrat.className)}>
				{!images.length && !isLoading ? <Empty label={'No images generated yet'} /> : null}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
					{images.map((image) => (
						<div key={image.url} className='relative items-center overflow-hidden flex flex-col justify-center border px-4 pt-4 rounded-lg'>
							<Image src={image.url} height={300} width={300} alt='generated-image' className='rounded-sm' />
							<Button variant='secondary' className='my-2' onClick={() => window.open(image.url)}>
								<Download className='mx-1' />
								Download
							</Button>
						</div>
					))}
					{isLoading &&
						[1, 2, 3, 4].map((_, i) => (
							<div key={i} className='relative items-center flex flex-col justify-center border p-4 rounded-lg'>
								<Skeleton className='h-60 w-60 bg-slate-200' />
								<Skeleton className='h-8 w-32 mt-2' />
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
