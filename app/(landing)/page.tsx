import HeroSection from '@/components/herosection';
import LandingPageNavBar from '@/components/landing-navbar';
import Testimonials from '@/components/testimonials';

const LandingPage = () => {
	return (
		<div className='text-white'>
			<LandingPageNavBar />
			<HeroSection />
			<Testimonials />
		</div>
	);
};

export default LandingPage;
