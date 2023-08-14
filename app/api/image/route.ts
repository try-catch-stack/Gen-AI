import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

import { canUseFreeTier, increaseApiUsage, isSubscriptionValid } from '@/lib/api-limit';
import { checkIsSubscribed } from '@/lib/user-subscription';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', {
				status: 401,
			});
		}

		const body = await req.json();
		const { prompt, imageCount, resolution } = body;

		const count = parseInt(imageCount);

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

		const response = await openai.createImage({
			prompt,
			n: count,
			size: resolution,
		});

		await increaseApiUsage(count);

		const { data } = response.data;

		return NextResponse.json(data);
	} catch (e) {
		console.log('Error in Conversation API: ', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
