'use client';

import NavBar from '@/components/navbar';
import SideBar from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='h-full relative'>
			<div className='hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-800'>
				<SideBar />
			</div>
			<main className='md:pl-72'>
				<NavBar />
				{children}
			</main>
		</div>
	);
}
