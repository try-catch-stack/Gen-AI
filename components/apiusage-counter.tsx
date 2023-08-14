'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { MAX_FREE_TIER_USAGE, MAX_PRO_TIER_USAGE } from '@/constants';
import { useProModal } from '@/hooks/useProModal';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

export default function APIUsageCounter({ APIUsageCount, isSubscribed }: { APIUsageCount: number; isSubscribed: boolean }) {
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();

	const { openModal } = useProModal();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const onClickManageSubscription = async () => {
		try {
			setLoading(true);
			const response = await axios.get('/api/subscribe');
			window.location.href = response.data.url;
		} catch (e: any) {
			console.log(e);
			toast({
				title: 'Ops! An unexpected error occurred',
				description: e?.message || 'Please try again later',
				className: 'bg-red-500 text-white',
			});
		} finally {
			setLoading(false);
		}
	};

	if (isSubscribed) {
		return (
			<div className='w-full rounded-lg bg-zinc-300 p-4 shadow shadow-slate-200 flex flex-col items-center'>
				{APIUsageCount}/{MAX_PRO_TIER_USAGE} Generations
				<Progress className='w-full my-1' value={(APIUsageCount / MAX_PRO_TIER_USAGE) * 100} />
				<Button className='w-full mt-2' onClick={onClickManageSubscription} disabled={loading}>
					Manage Subscription
				</Button>
			</div>
		);
	}

	return (
		<div className='w-full rounded-lg bg-zinc-300 p-4 shadow shadow-slate-200 flex flex-col items-center'>
			{APIUsageCount}/{MAX_FREE_TIER_USAGE} Free Generations
			<Progress className='w-full my-1' value={(APIUsageCount / MAX_FREE_TIER_USAGE) * 100} />
			<Button className='w-full mt-2' variant='upgrade' onClick={openModal}>
				Upgrade
				<Zap className='ml-2' size='22' />
			</Button>
		</div>
	);
}
