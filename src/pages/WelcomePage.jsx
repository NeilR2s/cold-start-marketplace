import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Globe, ArrowDown } from 'lucide-react';
import bitbitImage from '../assets/sarapmo-sarapko.png';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center bg-[#0b3b2d] text-white font-[Figtree] overflow-x-hidden overflow-y-scroll min-h-screen w-full py-6">


            <section className="flex flex-col items-center justify-center px-6 py-12 text-center">

                <div className="flex-1 flex items-center justify-center w-full">
                    <img src={bitbitImage} alt="" className='h-60' />
                </div>

                <div className="mb-8 max-w-sm mx-auto space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bitbit mo, bitbit ko
                    </h1>
                    <p className="text-emerald-100/80 text-sm leading-relaxed font-medium">
                        Connect with trusted travelers to access exclusive items from anywhere in the world. Secure payments, verified sellers, and community-driven shipping.
                    </p>
                </div>

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