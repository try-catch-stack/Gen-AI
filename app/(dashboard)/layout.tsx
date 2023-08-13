import NavBar from '@/components/navbar';
import SideBar from '@/components/sidebar';
import { getAPIUsage } from '@/lib/api-limit';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
	const currentAPIUsage = await getAPIUsage();

	return (
		<div className='h-full relative'>
			<div className='hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-800'>
				<SideBar currentAPIUsage={currentAPIUsage} />
			</div>
			<main className='md:pl-72'>
				<NavBar />
				{children}
			</main>
		</div>
	);
};

export default DashboardLayout;
