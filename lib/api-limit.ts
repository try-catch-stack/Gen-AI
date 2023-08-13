import { auth } from '@clerk/nextjs';

import prismadb from './prismadb';
import { MAX_FREE_TIER_USAGE } from '@/constants';

export const increaseApiUsage = async (increaseCount = 1) => {
	const { userId } = auth();

	if (!userId) {
		return;
	}

	const currentAPIUsage = await prismadb.userAPILimit.findUnique({
		where: {
			userId,
		},
	});

	if (!currentAPIUsage) {
		await prismadb.userAPILimit.create({
			data: {
				userId,
				count: 1,
			},
		});
	} else {
		await prismadb.userAPILimit.update({
			where: {
				userId,
			},
			data: {
				count: currentAPIUsage.count + increaseCount,
			},
		});
	}
};

export const canUseFreeTier = async (increaseCount = 1) => {
	const { userId } = auth();

	if (!userId) {
		return false;
	}

	const currentAPIUsage = await prismadb.userAPILimit.findUnique({
		where: {
			userId,
		},
	});

	if (!currentAPIUsage) {
		return true;
	}

	return currentAPIUsage.count + increaseCount <= MAX_FREE_TIER_USAGE;
};

export const getAPIUsage = async () => {
	const { userId } = auth();

	if (!userId) {
		return 0;
	}

	const currentAPIUsage = await prismadb.userAPILimit.findUnique({
		where: {
			userId,
		},
	});

	if (!currentAPIUsage) {
		return 0;
	}

	return currentAPIUsage.count;
};
