import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import UpgradeToProModal from '@/components/upgrade-modal';
import CrispChat from '@/components/crisp-chat';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Gen AI',
	description: 'All AI tools you need at one place',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<UpgradeToProModal />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
