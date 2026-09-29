import React from 'react';
import { useNavigate } from 'react-router-dom';
import bitbitImage from '@/assets/sarapmo-sarapko.png';
import { Button } from '@/components/ui';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0b3b2d] px-6 py-12 text-white selection:bg-emerald-400 selection:text-[#0b3b2d]">
      <section className="flex w-full max-w-md flex-col items-center justify-center text-center">
        <div className="flex w-full items-center justify-center pb-6">
          <img
            src={bitbitImage}
            alt="Bitbit community swap"
            className="h-56 sm:h-64 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Bitbit mo, bitbit ko
          </h1>
          <p className="text-sm leading-relaxed font-medium text-emerald-100/80">
            Connect with trusted travelers to access exclusive items from anywhere in the world. Secure payments, verified sellers, and community-driven shipping.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <Button
            variant="secondary"
            pill
            size="lg"
            onClick={() => navigate('/home')}
            className="w-full bg-white text-[#0b3b2d] font-bold text-sm hover:bg-emerald-50 active:scale-95 shadow-xl transition-all h-14"
          >
            Continue
          </Button>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
