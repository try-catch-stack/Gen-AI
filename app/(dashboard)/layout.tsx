import NavBar from '@/components/navbar';
import SideBar from '@/components/sidebar';
import { getAPIUsage } from '@/lib/api-limit';
import { checkIsSubscribed } from '@/lib/user-subscription';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
	const currentAPIUsage = await getAPIUsage();
	const isSubscribed = await checkIsSubscribed();

	return (
		<div className='h-full relative'>
			<div className='hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-slate-800'>
				<SideBar isSubscribed={isSubscribed} currentAPIUsage={currentAPIUsage} />
			</div>
			<main className='md:pl-72'>
				<NavBar />
				{children}
			</main>
		</div>
	);
};

export default DashboardLayout;
