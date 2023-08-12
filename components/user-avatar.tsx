import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/nextjs';
import { AvatarFallback } from '@radix-ui/react-avatar';

export default function UserAvatar() {
	const { user } = useUser();
	console.log('User: ', user);
	return (
		<Avatar className='h-8 w-8 md:h-10 md:w-10'>
			<AvatarImage src={user?.imageUrl} />
			<AvatarFallback>
				{user?.firstName} {user?.lastName}
			</AvatarFallback>
		</Avatar>
	);
}
