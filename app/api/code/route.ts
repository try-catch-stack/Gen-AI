import { auth } from '@clerk/nextjs';
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

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

		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [instructionMessage, ...messages],
			max_tokens: 100,
		});

		console.log('/api/code', response.data.choices[0].message);

		return NextResponse.json(response.data.choices[0].message);
	} catch (e) {
		console.log('Error in Conversation API: ', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
