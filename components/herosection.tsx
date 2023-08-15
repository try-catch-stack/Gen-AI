'use client';

import { cn } from '@/lib/utils';
import { Montserrat, Unbounded } from 'next/font/google';
import TypeWriterEffect from 'typewriter-effect';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const montserratBold = Montserrat({ subsets: ['latin'], weight: '900' });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function HeroSection() {
	const router = useRouter();

	return (
		<div className='w-full flex flex-col items-center mt-28'>
			<div className={cn('text-3xl md:text-5xl lg:text-6xl text-center', montserratBold.className)}>AI tools for content creation</div>

			<div
				className={cn(
					'text-3xl md:text-5xl lg:text-6xl my-10 text-white gradient bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent',
					montserratBold.className,
				)}
			>
				<TypeWriterEffect
					options={{
						strings: ['Conversation', 'Image Generation', 'Code Generation', 'Video Generation', 'Music Generation'],
						autoStart: true,
						loop: true,
					}}
				/>
			</div>
			<Button onClick={() => router.push('/dashboard')} variant='upgrade' className='mt-8 rounded-xl'>
				Start Generating for free
			</Button>
			<div className={cn('my-2 text-xs text-zinc-200', montserrat.className)}>No credit card required</div>
		</div>
	);
}
