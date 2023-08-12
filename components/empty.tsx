import Image from 'next/image';

interface EmptyProps {
	label: string;
}

export default function Empty({ label }: EmptyProps) {
	return (
		<div className='h-full w-full flex flex-col items-center my-20'>
			<div className='w-60 h-60 md:w-80 md:h-80 relative'>
				<Image src='/empty.png' alt='Empty' fill />
			</div>
			<div className='text-muted-foreground my-4'>{label}</div>
		</div>
	);
}
