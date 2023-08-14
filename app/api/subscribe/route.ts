import { absoluteURL } from '@/lib/utils';
import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

const dashboardURL = absoluteURL('/dashboard');

export async function GET(req: Request) {
	try {
		const { userId } = auth();
		const user = await currentUser();
		if (!userId || !user) {
			return new NextResponse('Unauthorized', {
				status: 401,
			});
		}

		const subscription = await prismadb.subscription.findUnique({
			where: {
				userId,
			},
		});

		if (subscription && subscription.stripeCustomerId) {
			const stripeSession = await stripe.billingPortal.sessions.create({
				customer: subscription.stripeCustomerId,
				return_url: dashboardURL,
			});

			return new NextResponse(JSON.stringify({ url: stripeSession.url }));
		}

		const stripeSession = await stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'USD',
						product_data: {
							name: 'Gen AI Pro',
							description: 'Get 20 Generations per month',
						},
						recurring: {
							interval: 'month',
						},
						unit_amount: 1000,
					},
					quantity: 1,
				},
			],
			metadata: {
				userId,
			},
			success_url: dashboardURL,
			cancel_url: dashboardURL,
			customer_email: user.emailAddresses[0].emailAddress,
		});

		return new NextResponse(JSON.stringify({ url: stripeSession.url }));
	} catch (e) {
		console.log('Error in Stripe API: ', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
