'use client';

import { MAX_FREE_TIER_USAGE } from '@/constants';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CloudLightning, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function APIUsageCounter({ APIUsageCount }: { APIUsageCount: number }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className='w-full rounded-lg bg-zinc-300 p-4 shadow shadow-slate-200 flex flex-col items-center'>
			{APIUsageCount}/{MAX_FREE_TIER_USAGE} Free Generations
			<Progress className='w-full my-1' value={(APIUsageCount / MAX_FREE_TIER_USAGE) * 100} />
			<Button className='w-full mt-2' variant='upgrade'>
				Upgrade
				<Zap className='ml-2' size='22' />
			</Button>
		</div>
	);
}
