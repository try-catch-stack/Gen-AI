import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

import { canUseFreeTier, increaseApiUsage, isSubscriptionValid } from '@/lib/api-limit';
import { checkIsSubscribed } from '@/lib/user-subscription';

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_KEY!,
});

export async function POST(req: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', {
				status: 401,
			});
		}

		const body = await req.json();
		const { prompt } = body;

		if (!prompt) {
			return new NextResponse('Prompt is required', {
				status: 400,
			});
		}

		const isSubscribed = await checkIsSubscribed();

		if (!isSubscribed) {
			const freeTierAvailable = await canUseFreeTier();

			if (!freeTierAvailable) {
				return new NextResponse('Free tier limit reached', {
					status: 403,
				});
			}
		} else {
			const usageWithinProLimits = await isSubscriptionValid();
			if (!usageWithinProLimits) {
				return new NextResponse('Pro tier limit reached', {
					status: 403,
				});
			}
		}

		const response = await replicate.run('riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05', {
			input: {
				prompt_a: prompt,
			},
		});

		await increaseApiUsage();

		return NextResponse.json(response);
	} catch (e) {
		console.log('Error in Conversation API: ', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
