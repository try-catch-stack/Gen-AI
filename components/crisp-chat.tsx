'use client';

import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';

export default function CrispChat() {
	useEffect(() => {
		Crisp.configure('571516c8-ae47-47f9-a58a-944d1eec75ad');
	}, []);

	return null;
}
