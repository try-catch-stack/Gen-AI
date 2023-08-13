import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

import { canUseFreeTier, increaseApiUsage } from '@/lib/api-limit';

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

		const freeTierAvailable = await canUseFreeTier();

		if (!freeTierAvailable) {
			return new NextResponse('Free tier limit reached', {
				status: 403,
			});
		}

		const response = await replicate.run('anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351', {
			input: {
				prompt,
			},
		});

		await increaseApiUsage();

		return NextResponse.json(response);
	} catch (e) {
		console.log('Error in Conversation API: ', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
