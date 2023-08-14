import { UserButton } from '@clerk/nextjs';

import MobileSideBar from '@/components/mobile-sidebar';
import { getAPIUsage } from '@/lib/api-limit';
import { checkIsSubscribed } from '@/lib/user-subscription';

const NavBar = async () => {
	const currentAPIUsage = await getAPIUsage();
	const isSubscribed = await checkIsSubscribed();

	return (
		<div className='flex items-center'>
			<MobileSideBar isSubscribed={isSubscribed} currentAPIUsage={currentAPIUsage} />
			<div className='w-full flex justify-end  p-2'>
				<UserButton afterSignOutUrl='/' />
			</div>
		</div>
	);
};

export default NavBar;
