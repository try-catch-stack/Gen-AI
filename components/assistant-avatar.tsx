import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

export default function AssistantAvatar() {
	return (
		<Avatar className='h-8 w-8 md:h-10 md:w-10 flex justify-center items-center bg-blue-200'>
			<Bot size={24} className='bg-slate' />
		</Avatar>
	);
}
