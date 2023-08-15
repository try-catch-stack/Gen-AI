'use client';

import { cn } from '@/lib/utils';
import { Montserrat, Orbitron } from 'next/font/google';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const spaceGrotesk = Orbitron({ subsets: ['latin'], weight: '700' });
const montserrat = Montserrat({ subsets: ['latin'], weight: '700' });

export default function NavBar() {
	const router = useRouter();

	return (
		<nav className='p-4 flex justify-between'>
			<div className='flex space-x-2'>
				<Image src='/logo.png' width={50} height={50} alt='Gen-AI' />
				<div className={cn('text-2xl', spaceGrotesk.className)}>Gen AI</div>
			</div>
			<Button
				className={cn('rounded-2xl font-sans bg-white text-black hover:bg-slate-200', montserrat.className)}
				onClick={() => router.push('/dashboard')}
			>
				Get Started
			</Button>
		</nav>
	);
}
