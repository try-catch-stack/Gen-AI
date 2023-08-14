'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import SideBar from '@/components/sidebar';
import { getAPIUsage } from '@/lib/api-limit';

export default function MobileSideBar({ currentAPIUsage, isSubscribed }: { currentAPIUsage: number; isSubscribed: boolean }) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) {
		return null;
	}

	return (
		<Sheet>
			<SheetTrigger>
				<Button variant='ghost' size='icon' className='md:hidden'>
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='bg-slate-700'>
				<SideBar isSubscribed={isSubscribed} currentAPIUsage={currentAPIUsage} />
			</SheetContent>
		</Sheet>
	);
}
