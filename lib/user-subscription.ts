import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

const BUFFER_TIME = 1000 * 60 * 60 * 24; // 1 day

export const checkIsSubscribed = async () => {
	try {
		const { userId } = auth();
		if (!userId) {
			return false;
		}

		const userSubscription = await prismadb.subscription.findUnique({
			where: {
				userId,
			},
			select: {
				stripeCustomerId: true,
				stripeCurrentPeriodEnd: true,
				stripePriceId: true,
				stripeSubscriptionId: true,
			},
		});

		if (!userSubscription || !userSubscription.stripeSubscriptionId) {
			return false;
		}

		if (userSubscription.stripeCurrentPeriodEnd?.getTime()! + BUFFER_TIME < new Date().getTime()) {
			return false;
		}

		return true;
	} catch (e) {
		console.log('Error in checkIsSubscribed: ', e);
		return false;
	}
};
