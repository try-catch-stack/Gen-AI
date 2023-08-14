import Stripe from 'stripe';
import { headers } from 'next/headers';

import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { STRIPE_EVENT_ENUM } from '@/constants';

export async function POST(req: Request) {
	const body = await req.text();
	const signature = headers().get('Stripe-Signature')?.toString() as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
	} catch (e: any) {
		console.log('webhook error', e);
		return new NextResponse(`Webhook error: ${e.message}`, { status: 400 });
	}

	const session = event.data.object as Stripe.Checkout.Session;

	if (event.type === STRIPE_EVENT_ENUM.CHECKOUT_SESSION_COMPLETED) {
		const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

		if (!session?.metadata?.userId) {
			return new NextResponse('No UserId found', { status: 400 });
		}

		await prismadb.subscription.create({
			data: {
				userId: session?.metadata?.userId,
				stripeSubscriptionId: subscription.id,
				stripeCustomerId: subscription.customer as string,
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
			},
		});
	}

	if (event.type === STRIPE_EVENT_ENUM.INVOICE_PAYMENT_SUCCEEDED) {
		const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

		await prismadb.subscription.update({
			where: {
				stripeSubscriptionId: subscription.id,
			},
			data: {
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
			},
		});
	}

	return new NextResponse('Success', { status: 200 });
}
