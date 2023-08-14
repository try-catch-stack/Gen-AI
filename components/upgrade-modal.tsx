'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProModal } from '@/hooks/useProModal';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Code, Image, MessageSquare, Music, Video, Zap } from 'lucide-react';
import axios from 'axios';

const montserrat = Montserrat({ subsets: ['latin'] });

const cards = [
	{
		label: 'Conversation',
		icon: MessageSquare,
		color: 'text-green-300',
		bg: 'bg-green-300/10',
	},
	{
		label: 'Image',
		icon: Image,
		color: 'text-red-400',
		bg: 'bg-red-400/10',
	},
	{
		label: 'Video',
		icon: Video,
		color: 'text-yellow-400',
		bg: 'bg-yellow-400/10',
	},
	{
		label: 'Music',
		icon: Music,
		color: 'text-purple-400',
		bg: 'bg-purple-400/10',
	},
	{
		label: 'Code',
		icon: Code,
		color: 'text-gray-400',
		bg: 'bg-gray-400/10',
	},
];

export default function UpgradeToProModal() {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(false);

	const { isOpen, closeModal } = useProModal();

	useEffect(() => {
		setMounted(true);
	}, []);

	const onClickUpgrade = async () => {
		setLoading(true);
		try {
			const response = await axios.get('/api/subscribe');
			window.location.href = response.data.url;
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	if (!mounted) return null;

	return (
		<Dialog open={isOpen} onOpenChange={closeModal}>
			<DialogContent>
				<DialogTitle className={cn('text-center', montserrat.className)}>Upgrade to Pro</DialogTitle>
				<div className={cn('flex flex-col items-center', montserrat.className)}>
					Get 100 generation per month with Pro
					<div className='my-4 grid grid-cols-5'>
						{cards.map((card, i) => (
							<div key={i} className='mx-2 flex flex-col items-center'>
								<card.icon className={card.color} size='40' />
								<div className={card.color}>{card.label}</div>
							</div>
						))}
					</div>
				</div>
				<Button variant='upgrade' onClick={onClickUpgrade} disabled={loading}>
					Upgrade <Zap className='mx-1' size='22' />
				</Button>
			</DialogContent>
		</Dialog>
	);
}
