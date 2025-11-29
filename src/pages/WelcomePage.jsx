import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Globe, ArrowDown } from 'lucide-react';
import bitbitImage from '../assets/sarapmo-sarapko.png';
// import { BitbitDrawing } from '@/components/CustomComponents';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    // Main Container - Dark Green Background matching the screenshot
    <div className="flex flex-col items-center justify-center bg-[#0b3b2d] text-white font-[Figtree] overflow-x-hidden overflow-y-scroll min-h-screen w-fit px-0.5 py-6">
      

      {/* --- FRAME 2: Shop Globally --- */}
      <section className="flex flex-col items-center justify-center px-6 py-12 text-center">
        
        {/* Illustration Placeholder */}
        <div className="flex-1 flex items-center justify-center w-full">
             {/* <Globe 
                size={180} 
                strokeWidth={1} 
                className="text-white opacity-90 drop-shadow-2xl" 
             /> */}
             {/* <BitbitDrawing /> */}
             <img src={bitbitImage} alt="" className='h-60' />
        </div>

        {/* Text Content */}
        <div className="mb-8 max-w-sm mx-auto space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
                Bitbit mo, bitbit ko
            </h1>
            <p className="text-emerald-100/80 text-sm leading-relaxed font-medium">
                Connect with trusted travelers to access exclusive items from anywhere in the world. Secure payments, verified sellers, and community-driven shipping.
            </p>
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-xs mb-8">
            <button
                onClick={() => navigate('/home')}
                className="w-full py-4 bg-white text-[#0b3b2d] font-bold rounded-full text-sm hover:bg-emerald-50 active:scale-95 transition-all shadow-xl"
            >
                Continue
            </button>
        </div>
      </section>

    </div>
  );
};

export default WelcomePage;