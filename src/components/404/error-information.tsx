import HomeIcon from '@components/icons/home-icon';
import NotFoundIcon from '@components/icons/not-found';
import { ROUTES } from '@utils/routes';
import Link from 'next/link';

const ErrorInformation: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-12 py-16 text-center sm:py-20 lg:py-24 xl:py-32">
      <div className="max-w-md xl:max-w-lg">
        <NotFoundIcon className="w-full h-[410px]" />
        <p className="text-15px md:text-base 2xl:text-[18px] leading-7 md:leading-8 pt-4 font-medium pb-7">
          We&apos;re sorry! This page is currently unavailable. We request you
          to please try again later.
        </p>
        <Link
          href={ROUTES.HOME}
          className='class="text-[13px] md:text-sm lg:text-[15px] leading-4 inline-flex items-center font-medium cursor-pointer transition ease-in-out duration-300 bg-brand-dark text-white px-4 md:px-6 py-2.5 lg:py-3 hover:text-white bg-opacity-90 hover:bg-opacity-100 rounded-md'
        >
          <HomeIcon width="14" />
          <span className="ps-2 mt-0.5"> Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default ErrorInformation;
