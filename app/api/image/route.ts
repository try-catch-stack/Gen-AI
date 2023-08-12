import { auth } from '@clerk/nextjs';
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

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

		if (!prompt) {
			return new NextResponse('Prompt is required', {
				status: 400,
			});
		}

		const response = await openai.createImage({
			prompt,
			n: parseInt(imageCount),
			size: resolution,
		});

		const { data } = response.data;

		return NextResponse.json(data);
	} catch (e) {
		console.log('Error in Conversation API: ', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
