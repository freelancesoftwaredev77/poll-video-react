import React from 'react';
import { Message, MetaPixel } from '@/components';
import { Link } from 'react-router-dom';

const ThankYouPage = () => (
  <>
    <div className="">
      <Message
        message="Sondajul a fost încheiat !"
        title="Felicitări !"
        imageUrl="/clap.png"
      />

      <Link
        to="/terms-conditions"
        className="block pb-10 text-center text-sm font-normal text-[blue]"
      >
        Termeni și Condiții pentru INTERSPECT
      </Link>
    </div>
    <MetaPixel />
  </>
);

export default React.memo(ThankYouPage);
