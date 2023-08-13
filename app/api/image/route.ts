import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

import { canUseFreeTier, increaseApiUsage } from '@/lib/api-limit';

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

		const freeTierAvailable = await canUseFreeTier(count);

		if (!freeTierAvailable) {
			return new NextResponse('Free tier limit reached', {
				status: 403,
			});
		}

		// const response = await openai.createImage({
		// 	prompt,
		// 	n: count,
		// 	size: resolution,
		// });

		await increaseApiUsage(count);

		// const { data } = response.data;

		// return NextResponse.json(data);
		return NextResponse.json([]);
	} catch (e) {
		console.log('Error in Conversation API: ', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
