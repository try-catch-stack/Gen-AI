import { authMiddleware } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export default authMiddleware({
	publicRoutes: ['/'],
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
