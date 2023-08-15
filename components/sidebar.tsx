'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

import { Montserrat, Orbitron, Teko } from 'next/font/google';
import { Bot, Code, Image, LayoutDashboard, MessageSquare, Music, Settings, Video } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import NextImage from 'next/image';

import APIUsageCounter from '@/components/apiusage-counter';

const spaceGrotesk = Orbitron({ subsets: ['latin'], weight: '700' });
const teko = Teko({ subsets: ['latin'], weight: '300' });
const montserrat = Montserrat({ subsets: ['latin'], weight: '500' });

interface SideBarProps {
	currentAPIUsage: number;
	isSubscribed: boolean;
}

const routes = [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
		color: 'text-blue-400',
	},
	{
		label: 'Conversation',
		href: '/conversation',
		icon: MessageSquare,
		color: 'text-green-200',
	},
	{
		label: 'Image',
		href: '/image',
		icon: Image,
		color: 'text-red-400',
	},
	{
		label: 'Video',
		href: '/video',
		icon: Video,
		color: 'text-yellow-400',
	},
	{
		label: 'Music',
		href: '/music',
		icon: Music,
		color: 'text-purple-400',
	},
	{
		label: 'Code',
		href: '/code',
		icon: Code,
		color: 'text-gray-400',
	},
];

export default function SideBar({ currentAPIUsage, isSubscribed }: SideBarProps) {
	const pathname = usePathname();

	return (
		<div className='space-y-4 py-4 flex flex-col h-full'>
			<div className='px-4 flex'>
				<Link href='/dashboard' className='flex'>
					<NextImage src={'/logo.png'} height='40' width='40' alt='Gen-AI' />
					<p className={cn('text-2xl font-bold text-white mx-1', spaceGrotesk.className)}>Gen AI</p>

					{isSubscribed && (
						<div className='mx-3 flex py-1'>
							<Badge variant='pro' className='border-0'>
								PRO
							</Badge>
						</div>
					)}
				</Link>
			</div>
			<div className='py-8 space-y-4 flex flex-col'>
				{routes.map((route) => (
					<Link
						href={route.href}
						key={route.href}
						className={cn(
							'mx-2 px-4 py-1 hover:shadow-md text-white hover:bg-slate-700 flex items-center rounded-md',
							pathname === route.href && 'bg-slate-700',
						)}
					>
						<route.icon className={cn('mx-2', route.color)} />
						<p className={cn('text-2xl', teko.className)}>{route.label}</p>
					</Link>
				))}
			</div>
			<div className={cn('h-full flex flex-col justify-end p-4', montserrat.className)}>
				<APIUsageCounter isSubscribed={isSubscribed} APIUsageCount={currentAPIUsage} />
			</div>
		</div>
	);
}
