'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Montserrat } from 'next/font/google';
import { cn } from '@/lib/utils';

const montserrat = Montserrat({ subsets: ['latin'] });

const testimonials = [
	{
		name: 'John Doe',
		title: 'Software Engineer',
		quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing  elit. Sed neque velit.',
	},
	{
		name: 'Jane Doe',
		title: 'Data Analyst',

		quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing  elit. Sed neque velit.',
	},
	{
		name: 'John Smith',
		title: 'UX Designer',
		quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing  elit. Sed neque velit.',
	},
	{
		name: 'Jane Smith',
		title: 'Technical Writer',
		quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing  elit. Sed neque velit.',
	},
];

export default function Testimonials() {
	return (
		<div className='w-full px-16 my-4 py-4'>
			<div className={cn('w-full text-center my-8 font-bold text-3xl', montserrat.className)}>Testimonials</div>
			<div className={cn(' grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4', montserrat.className)}>
				{testimonials.map((testimonial) => (
					<Card key={testimonial.name} className='bg-slate-700 border-0 text-white shadow-lg'>
						<div className='flex flex-col p-2'>
							<div className='flex space-x-2 mb-2'>
								<Avatar>
									<AvatarImage src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${testimonial.name}`} />
									<AvatarFallback>{testimonial.name[0]}</AvatarFallback>
								</Avatar>
								<div className='flex flex-col'>
									<p className='font-bold text-slate-200'>{testimonial.name}</p>
									<p className='text-muted-foreground text-slate-400 text-sm'>{testimonial.title}</p>
								</div>
							</div>
							<p>{testimonial.quote}</p>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
