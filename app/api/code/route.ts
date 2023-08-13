import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

import { canUseFreeTier, increaseApiUsage } from '@/lib/api-limit';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
	role: 'system',
	content: 'You are a code generator. Return only in markdown code snippets',
};

export async function POST(req: Request) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthorized', {
				status: 401,
			});
		}

		const body = await req.json();
		const { messages } = body;

		if (!messages) {
			return new NextResponse('Messages are required', {
				status: 400,
			});
		}
		if (!configuration.apiKey) {
			return new NextResponse('OpenAI API key is required', {
				status: 500,
			});
		}

		const freeTierAvailable = await canUseFreeTier();

		if (!freeTierAvailable) {
			return new NextResponse('Free tier limit reached', {
				status: 403,
			});
		}

		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [instructionMessage, ...messages],
			max_tokens: 100,
		});

		await increaseApiUsage();

		return NextResponse.json(response.data.choices[0].message);
	} catch (e) {
		console.log('Error in Conversation API: ', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
