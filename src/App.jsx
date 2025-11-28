import React, { useState, useEffect } from 'react';
import { 
  Package, Plane, Users, ShieldCheck, MapPin, 
  Plus, Search, Bell, X, Camera, ChevronRight, 
  TrendingDown, Globe, User, CheckCircle, AlertTriangle,
  Info, Filter, Wallet, ArrowRight
} from 'lucide-react';

/**
 * MOCK DATA
 */
const CURRENT_USER = {
  uid: "u123",
  displayName: "Clara the Collector",
  roles: ["buyer", "traveler"],
  verificationStatus: "verified",
  reputationScore: 4.8,
  walletBalance: 2450.00
};

const MOCK_TRIPS = [
  {
    id: "t1",
    traveler: { name: "Miguel Travels", verified: true, rating: 4.9 },
    origin: "Tokyo, Japan",
    destination: "Manila, PH",
    date: "2023-12-15T10:00:00",
    capacity: { total: 20, available: 12, pricePerKg: 800 },
    shops: ["Don Quijote", "Nintendo Store", "IKEA Shibuya"],
    status: "scheduled"
  },
  {
    id: "t2",
    traveler: { name: "Sarah FA", verified: true, rating: 5.0 },
    origin: "Seoul, South Korea",
    destination: "Cebu, PH",
    date: "2023-11-28T14:00:00",
    capacity: { total: 15, available: 2, pricePerKg: 650 },
    shops: ["Olive Young", "K-Pop Popups"],
    status: "closing_soon"
  }
];

const MOCK_GOS = [
  {
    id: "go1",
    title: "Seventeen 'FML' Album GO",
    manager: { name: "HoshiCart_PH", verified: true },
    region: "South Korea",
    status: "open",
    deadline: "2023-12-01",
    category: "K-Pop",
    items: [
      { name: "Carat Version", price: 650 },
      { name: "Photobook Ver", price: 950 }
    ],
    pooling: {
      current: 45,
      target: 100,
      baseFee: 150,
      minFee: 50
    },
    biases: ["S.Coups", "Jeonghan", "Joshua", "Jun", "Hoshi", "Wonwoo", "Woozi", "The8", "Mingyu", "DK", "Seungkwan", "Vernon", "Dino"]
  },
  {
    id: "go2",
    title: "IKEA Pasabuy (Batch 24)",
    manager: { name: "NordicHome_MNL", verified: true },
    region: "Pasay (Local)",
    status: "packing",
    category: "Home",
    deadline: "2023-11-20",
    items: [
        { name: "Nordic Spirit", price: 135 },
        { name: "Stroogenstrub (Chair)", price: 1950 }
    ],
    pooling: {
      current: 12,
      target: 20,
      baseFee: 200,
      minFee: 100
    },
    biases: [] 
  }
];

/**
 * UTILITY COMPONENTS
 */
const formatPHP = (amount) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};

// Card Component (Light Mode)
const Card = ({ children, className = "", onClick, noHover = false }) => (
  <div 
    onClick={onClick}
    className={`
      bg-white border border-slate-200 rounded-xl overflow-hidden
      shadow-sm relative transition-all duration-200
      ${!noHover && onClick ? 'hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-900/5 cursor-pointer active:scale-[0.99]' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

const Badge = ({ children, type = "neutral" }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    accent: "bg-emerald-100 text-emerald-800 border-emerald-200"
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide rounded-md border ${styles[type]}`}>
      {children}
    </span>
  );
};

const Avatar = ({ name, verified, size = "md" }) => {
  const sizeClass = size === "lg" ? "w-14 h-14 text-xl" : size === "sm" ? "w-6 h-6 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div className="relative inline-block">
      <div className={`${sizeClass} rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-sm border-2 border-white`}>
        {name.substring(0, 2).toUpperCase()}
      </div>
      {verified && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px] shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
        </div>
      )}
    </div>
  );
};

const BitbitLogo = ({ className, ...props }) => {
    return (
        <svg 
            className={className} 
            viewBox="0 0 126 187" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path 
                d="M30 163.422C30 164.813 29.7344 166.117 29.2031 167.336C28.6719 168.555 27.9453 169.625 27.0234 170.547C26.1172 171.453 25.0547 172.172 23.8359 172.703C22.6172 173.234 21.3125 173.5 19.9219 173.5H3.11719V139.891H19.9219C21.3125 139.891 22.6172 140.156 23.8359 140.688C25.0547 141.219 26.1172 141.945 27.0234 142.867C27.9453 143.774 28.6719 144.836 29.2031 146.055C29.7344 147.274 30 148.578 30 149.969C30 150.594 29.9141 151.234 29.7422 151.891C29.5703 152.547 29.3281 153.18 29.0156 153.789C28.7031 154.399 28.3281 154.953 27.8906 155.453C27.4531 155.953 26.9688 156.367 26.4375 156.695C26.9844 156.992 27.4766 157.399 27.9141 157.914C28.3516 158.414 28.7266 158.969 29.0391 159.578C29.3516 160.188 29.5859 160.828 29.7422 161.5C29.9141 162.156 30 162.797 30 163.422ZM9.84375 166.774H19.9219C20.3906 166.774 20.8281 166.688 21.2344 166.516C21.6406 166.344 21.9922 166.109 22.2891 165.813C22.6016 165.5 22.8438 165.141 23.0156 164.734C23.1875 164.328 23.2734 163.891 23.2734 163.422C23.2734 162.953 23.1875 162.516 23.0156 162.109C22.8438 161.703 22.6016 161.352 22.2891 161.055C21.9922 160.742 21.6406 160.5 21.2344 160.328C20.8281 160.156 20.3906 160.07 19.9219 160.07H9.84375V166.774ZM9.84375 153.344H19.9219C20.3906 153.344 20.8281 153.258 21.2344 153.086C21.6406 152.914 21.9922 152.68 22.2891 152.383C22.6016 152.07 22.8438 151.711 23.0156 151.305C23.1875 150.883 23.2734 150.438 23.2734 149.969C23.2734 149.5 23.1875 149.063 23.0156 148.656C22.8438 148.25 22.6016 147.899 22.2891 147.602C21.9922 147.289 21.6406 147.047 21.2344 146.875C20.8281 146.703 20.3906 146.617 19.9219 146.617H9.84375V153.344ZM41.9531 141.578C41.9531 142.172 41.8359 142.727 41.6016 143.242C41.3828 143.758 41.0781 144.211 40.6875 144.602C40.2969 144.977 39.8359 145.281 39.3047 145.516C38.7891 145.734 38.2344 145.844 37.6406 145.844C37.0469 145.844 36.4844 145.734 35.9531 145.516C35.4375 145.281 34.9844 144.977 34.5938 144.602C34.2188 144.211 33.9141 143.758 33.6797 143.242C33.4609 142.727 33.3516 142.172 33.3516 141.578C33.3516 141 33.4609 140.453 33.6797 139.938C33.9141 139.406 34.2188 138.953 34.5938 138.578C34.9844 138.188 35.4375 137.883 35.9531 137.664C36.4844 137.43 37.0469 137.313 37.6406 137.313C38.2344 137.313 38.7891 137.43 39.3047 137.664C39.8359 137.883 40.2969 138.188 40.6875 138.578C41.0781 138.953 41.3828 139.406 41.6016 139.938C41.8359 140.453 41.9531 141 41.9531 141.578ZM40.8516 173.5H34.4062V148.399H40.8516V173.5ZM58.3359 173.5C56.7891 173.5 55.3359 173.211 53.9766 172.633C52.6172 172.039 51.4219 171.234 50.3906 170.219C49.375 169.188 48.5703 167.992 47.9766 166.633C47.3984 165.274 47.1094 163.82 47.1094 162.274V154.82H43.9922V148.445H47.1094V138.414H53.4844V148.445H63.1875V154.82H53.4844V162.274C53.4844 162.945 53.6094 163.578 53.8594 164.172C54.1094 164.75 54.4531 165.258 54.8906 165.695C55.3281 166.133 55.8438 166.484 56.4375 166.75C57.0312 167 57.6641 167.125 58.3359 167.125H63.1875V173.5H58.3359ZM91.9219 160.727C91.9219 162.695 91.5859 164.492 90.9141 166.117C90.2422 167.742 89.3281 169.141 88.1719 170.313C87.0156 171.469 85.6562 172.367 84.0938 173.008C82.5469 173.649 80.8828 173.969 79.1016 173.969C77.3359 173.969 75.6719 173.641 74.1094 172.984C72.5625 172.328 71.2031 171.414 70.0312 170.242C68.875 169.07 67.9609 167.68 67.2891 166.07C66.6172 164.445 66.2812 162.664 66.2812 160.727V138.414H72.7031V150.133C73.0469 149.695 73.4609 149.305 73.9453 148.961C74.4453 148.617 74.9766 148.336 75.5391 148.117C76.1172 147.899 76.7109 147.734 77.3203 147.625C77.9297 147.5 78.5234 147.438 79.1016 147.438C80.8828 147.438 82.5469 147.774 84.0938 148.445C85.6562 149.102 87.0156 150.024 88.1719 151.211C89.3281 152.399 90.2422 153.805 90.9141 155.43C91.5859 157.039 91.9219 158.805 91.9219 160.727ZM85.4766 160.727C85.4766 159.758 85.3047 158.859 84.9609 158.031C84.6328 157.188 84.1797 156.461 83.6016 155.852C83.0234 155.242 82.3438 154.766 81.5625 154.422C80.7969 154.078 79.9766 153.906 79.1016 153.906C78.2266 153.906 77.3984 154.102 76.6172 154.492C75.8516 154.867 75.1797 155.375 74.6016 156.016C74.0234 156.641 73.5703 157.367 73.2422 158.195C72.9141 159.008 72.75 159.852 72.75 160.727C72.75 161.695 72.9141 162.594 73.2422 163.422C73.5703 164.25 74.0234 164.969 74.6016 165.578C75.1797 166.188 75.8516 166.672 76.6172 167.031C77.3984 167.375 78.2266 167.547 79.1016 167.547C79.9766 167.547 80.7969 167.375 81.5625 167.031C82.3438 166.672 83.0234 166.188 83.6016 165.578C84.1797 164.969 84.6328 164.25 84.9609 163.422C85.3047 162.594 85.4766 161.695 85.4766 160.727ZM103.031 141.578C103.031 142.172 102.914 142.727 102.68 143.242C102.461 143.758 102.156 144.211 101.766 144.602C101.375 144.977 100.914 145.281 100.383 145.516C99.8672 145.734 99.3125 145.844 98.7188 145.844C98.125 145.844 97.5625 145.734 97.0312 145.516C96.5156 145.281 96.0625 144.977 95.6719 144.602C95.2969 144.211 94.9922 143.758 94.7578 143.242C94.5391 142.727 94.4297 142.172 94.4297 141.578C94.4297 141 94.5391 140.453 94.7578 139.938C94.9922 139.406 95.2969 138.953 95.6719 138.578C96.0625 138.188 96.5156 137.883 97.0312 137.664C97.5625 137.43 98.125 137.313 98.7188 137.313C99.3125 137.313 99.8672 137.43 100.383 137.664C100.914 137.883 101.375 138.188 101.766 138.578C102.156 138.953 102.461 139.406 102.68 139.938C102.914 140.453 103.031 141 103.031 141.578ZM101.93 173.5H95.4844V148.399H101.93V173.5ZM119.414 173.5C117.867 173.5 116.414 173.211 115.055 172.633C113.695 172.039 112.5 171.234 111.469 170.219C110.453 169.188 109.648 167.992 109.055 166.633C108.477 165.274 108.188 163.82 108.188 162.274V154.82H105.07V148.445H108.188V138.414H114.562V148.445H124.266V154.82H114.562V162.274C114.562 162.945 114.688 163.578 114.938 164.172C115.188 164.75 115.531 165.258 115.969 165.695C116.406 166.133 116.922 166.484 117.516 166.75C118.109 167 118.742 167.125 119.414 167.125H124.266V173.5H119.414Z" 
                fill="white"
            />
            <path 
                d="M9.90748 100.757L15.1725 63.0471C16.5521 53.1658 25.0032 45.8126 34.9804 45.8126H82.0928C83.8905 45.8126 85.6776 46.0864 87.3928 46.6245C94.1114 48.7325 98.9421 54.6215 99.6956 61.6226L103.915 100.828V52.5338C103.915 51.0268 104.726 49.6364 106.037 48.8941L106.764 48.4827C107.813 47.8892 109.117 47.9936 110.058 48.7462C110.662 49.2294 111.051 49.9305 111.143 50.6984L117.416 103.202C118.656 113.575 111.703 123.154 101.456 125.191L87.6182 127.941C85.7523 128.312 83.843 128.415 81.9481 128.246L27.944 123.444C16.5504 122.431 8.3258 112.086 9.90748 100.757Z" 
                stroke="white" 
                strokeWidth="5" 
                strokeLinecap="round"
            />
            <path 
                d="M34.5625 44.2376C36.4127 27.1574 43.4979 -3.55922 57.3997 3.54952C58.8925 4.31287 60.3809 5.24992 61.4066 6.5762C64.3655 10.402 68.64 21.0206 70.7875 44.2376" 
                stroke="white" 
                strokeWidth="5" 
                strokeLinecap="round"
            />
            <path 
                d="M55.825 43.8694C57.6311 26.9636 64.5402 -3.42052 78.092 3.51089C79.595 4.27963 81.0222 5.30662 82.0317 6.65966C85.7528 11.6466 92.634 26.725 94.8062 50.5376" 
                stroke="white" 
                strokeWidth="5" 
                strokeLinecap="round"
            />
            <path 
                d="M110.599 50.5415L112.43 53.8384L117.91 113.33L105.618 124.085L87.0726 126.356L91.6996 49.6099L96.7758 54.0093L101.852 62.9898L102.406 63.9693L102.762 62.9019L107.319 49.229L110.599 50.5415Z" 
                fill="white" 
                stroke="white"
            />
            <path 
                d="M50.0225 104.905L57.3416 93.0083C58.2165 91.5863 57.0668 89.7816 55.4083 89.9735L48.5019 90.7726C48.277 90.7986 48.0492 90.7863 47.8284 90.736L42.2313 89.4627C40.5666 89.084 39.2233 90.8307 40.0167 92.3424L46.5482 104.786C47.2688 106.159 49.21 106.225 50.0225 104.905Z" 
                fill="white"
            />
            <path 
                d="M35 77.0001H31V73.0001H35V69.5001H42.5V73.0001H45.5V77.0001H41.5V74.0001H35V77.0001Z" 
                fill="white" 
                stroke="white"
            />
            <path 
                d="M60 77.0001H56V73.0001H60V69.5001H67.5V73.0001H70.5V77.0001H66.5V74.0001H60V77.0001Z" 
                fill="white" 
                stroke="white"
            />
        </svg>
    );
};

/**
 * MAIN APP
 */
export default function BitbitApp() {
  const [mode, setMode] = useState('buyer'); // 'buyer' | 'traveler'
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedGO, setSelectedGO] = useState(null);
  const [isPostTripOpen, setIsPostTripOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * MODAL: Group Order (Ambagan)
   */
  const GroupOrderModal = () => {
    if (!selectedGO) return null;

    const [participants, setParticipants] = useState(selectedGO.pooling.current);
    const [selectedBias, setSelectedBias] = useState(null);
    const [joined, setJoined] = useState(false);

    // Ambag Algorithm
    const calculateFee = (count) => {
      const { baseFee, minFee, target } = selectedGO.pooling;
      if (count >= target) return minFee;
      const discount = ((baseFee - minFee) / target) * count;
      return Math.round(baseFee - discount);
    };

    const currentFee = calculateFee(participants);
    const potentialNextFee = calculateFee(participants + 5);

    const handleJoin = () => {
      if (!selectedBias && selectedGO.biases.length > 0) {
        showToast("Please select a Bias first!", "error");
        return;
      }
      setJoined(true);
      setParticipants(p => p + 1);
      showToast("Successfully joined Group Order!");
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="font-bold text-lg text-slate-800">Group Order Details</h2>
            <button onClick={() => setSelectedGO(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto p-5 space-y-6 bg-slate-50/50">
            {/* Header Info */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <Badge type="accent">{selectedGO.category}</Badge>
                <span className="text-xs text-slate-500 font-medium">Ends {new Date(selectedGO.deadline).toLocaleDateString()}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{selectedGO.title}</h1>
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Avatar name={selectedGO.manager.name} verified={selectedGO.manager.verified} size="sm" />
                <span>Hosted by <span className="text-slate-900 font-medium">{selectedGO.manager.name}</span></span>
              </div>
            </div>

            {/* Ambag Visualizer */}
            <Card className="p-5 border-emerald-100 bg-gradient-to-b from-white to-emerald-50/30" noHover>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                    <TrendingDown size={18} />
                  </div>
                  <span className="font-semibold text-slate-800">Smart Ambag Rate</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{formatPHP(currentFee)}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Service Fee / Item</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div 
                  className="absolute left-0 top-0 h-full bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${(participants / selectedGO.pooling.target) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mb-4 font-medium">
                <span>{participants} neighbors joined</span>
                <span>Target: {selectedGO.pooling.target}</span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-emerald-100 text-sm text-slate-600 flex justify-between shadow-sm">
                <span>Price drops at {participants + 5} pax:</span>
                <span className="font-bold text-emerald-600">{formatPHP(potentialNextFee)}</span>
              </div>
            </Card>

            {/* Bias Selector */}
            {selectedGO.biases.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Select Member (Bias)</label>
                <div className="grid grid-cols-3 gap-2">
                  {selectedGO.biases.map(bias => (
                    <button
                      key={bias}
                      onClick={() => !joined && setSelectedBias(bias)}
                      disabled={joined}
                      className={`
                        text-xs py-2.5 px-1 rounded-lg border transition-all font-medium
                        ${selectedBias === bias 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'}
                        ${joined ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {bias}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Escrow Note */}
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
               <ShieldCheck className="text-blue-600 flex-shrink-0" size={20} />
               <div>
                 <h4 className="text-xs font-bold text-blue-800">Protected by Bitbit Escrow</h4>
                 <p className="text-[10px] text-blue-600 leading-relaxed mt-0.5">
                   Your payment is held neutrally. The host only receives funds after items arrive in PH and are ready to ship to you.
                 </p>
               </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-slate-500">Total Estimate</span>
                <span className="font-bold text-slate-900">{formatPHP(selectedGO.items[0].price + currentFee)}</span>
            </div>
            {joined ? (
              <button disabled className="w-full py-3 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl font-bold flex justify-center items-center gap-2">
                <CheckCircle size={18} />
                Joined Successfully
              </button>
            ) : (
              <button 
                onClick={handleJoin}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                Join & Pay via Escrow
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  /**
   * MODAL: Post Trip (Traveler)
   */
  const PostTripModal = () => {
    if (!isPostTripOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-10 duration-200">
        <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 h-[85vh] sm:h-auto flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Post a Trip</h2>
            <button onClick={() => setIsPostTripOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-5 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold">Origin</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                  <MapPin size={16} className="text-slate-400" />
                  <input type="text" className="bg-transparent text-sm text-slate-900 focus:outline-none w-full font-medium" defaultValue="Tokyo" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold">Destination</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                  <MapPin size={16} className="text-slate-400" />
                  <input type="text" className="bg-transparent text-sm text-slate-900 focus:outline-none w-full font-medium" defaultValue="Manila" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase font-bold">Capacity & Pricing</label>
              <Card className="p-4 bg-slate-50 border-slate-200" noHover>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-slate-900">20 <span className="text-sm font-normal text-slate-500">kg</span></span>
                  <div className="text-right">
                     <span className="block text-xs text-slate-500">Potential Earnings</span>
                     <span className="text-emerald-600 font-bold">₱15,000</span>
                  </div>
                </div>
                <input type="range" min="5" max="50" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </Card>
            </div>

            {/* De Minimis Warning (New Feature) */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
               <AlertTriangle className="text-amber-500 shrink-0" size={18} />
               <div>
                  <h4 className="text-xs font-bold text-amber-800">Customs Warning (De Minimis)</h4>
                  <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                    Values under ₱10,000 are tax-free. If you accept commercial quantities, please declare them properly to avoid airport seizure.
                  </p>
               </div>
            </div>
          </div>

          <button 
            onClick={() => {
              showToast("Trip posted! Waiting for buyers.");
              setIsPostTripOpen(false);
            }}
            className="mt-6 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            Publish Trip
          </button>
        </div>
      </div>
    );
  };

  /**
   * PAGE: Browse (Home)
   */
  const BrowsePage = () => (
    <div className="space-y-8 pb-28">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 sm:p-10 shadow-lg shadow-emerald-900/20">
        <div className="absolute top-0 right-0 p-32 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 text-white">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wide mb-3 backdrop-blur-md">
            <Globe size={10} /> Pasabuy & Group Orders
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Local flavor, <br/> global reach.
          </h1>
          <p className="text-emerald-100 max-w-xs text-sm mb-6 leading-relaxed">
            Verified travelers and community group buys. Save on shipping, safe on payments.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setMode('buyer')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${mode === 'buyer' ? 'bg-white text-emerald-700 shadow-md' : 'bg-emerald-800/40 text-emerald-100 hover:bg-emerald-800/60'}`}>
              I'm a Buyer
            </button>
            <button onClick={() => setMode('traveler')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${mode === 'traveler' ? 'bg-white text-emerald-700 shadow-md' : 'bg-emerald-800/40 text-emerald-100 hover:bg-emerald-800/60'}`}>
              I'm a Traveler
            </button>
          </div>
        </div>
      </div>

      {mode === 'buyer' ? (
        <>
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All", "K-Pop", "Food", "Fashion", "Gadgets", "Home"].map((cat, i) => (
              <button key={cat} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${i === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Group Orders Section */}
          <section>
            <div className="flex justify-between items-end mb-4 px-1">
              <div>
                 <h2 className="text-lg font-bold text-slate-900">Trending Group Orders</h2>
                 <p className="text-xs text-slate-500">Join neighbors to lower shipping fees</p>
              </div>
              <button className="text-xs text-emerald-600 font-bold hover:underline">See All</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {MOCK_GOS.map(go => (
                <Card key={go.id} onClick={() => setSelectedGO(go)} className="p-0 flex flex-col">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Badge type={go.status === 'open' ? 'success' : 'warning'}>{go.status.replace('_', ' ').toUpperCase()}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{go.pooling.current}/{go.pooling.target} Joined</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{go.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                      <MapPin size={12} /> {go.region} • Ends {new Date(go.deadline).toLocaleDateString()}
                    </p>
                    
                    {/* Mini Ambag Viz */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(go.pooling.current / go.pooling.target) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Base Fee: {formatPHP(go.pooling.baseFee)}</span>
                      <span className="text-emerald-600 font-bold">Current: {formatPHP(go.pooling.baseFee - (((go.pooling.baseFee - go.pooling.minFee) / go.pooling.target) * go.pooling.current))}</span>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar name={go.manager.name} verified={go.manager.verified} size="sm" />
                      <span className="text-xs font-semibold text-slate-600">{go.manager.name}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                       <ChevronRight size={14} className="text-slate-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Traveler Feed Section */}
          <section>
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Travelers</h2>
              <button className="text-xs text-emerald-600 font-bold hover:underline">See All</button>
            </div>
            <div className="space-y-4">
              {MOCK_TRIPS.map(trip => (
                <Card key={trip.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar name={trip.traveler.name} verified={trip.traveler.verified} />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{trip.traveler.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 font-medium">
                          <span>{trip.origin}</span>
                          <Plane size={10} className="text-slate-400" />
                          <span>{trip.destination}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600">{trip.capacity.available}kg Left</div>
                      <div className="text-[10px] text-slate-400 font-medium">{formatPHP(trip.capacity.pricePerKg)}/kg</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {trip.shops.map(shop => (
                      <span key={shop} className="whitespace-nowrap px-2 py-1 bg-slate-100 rounded text-[10px] font-semibold text-slate-600 border border-slate-200">
                        {shop}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* TRAVELER DASHBOARD */
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setIsPostTripOpen(true)} className="group p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-emerald-100 transition-all text-center flex flex-col items-center justify-center gap-3 h-32">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-sm font-bold text-slate-700">Post New Trip</span>
            </button>
            <button className="group p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-blue-100 transition-all text-center flex flex-col items-center justify-center gap-3 h-32">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package size={20} />
              </div>
              <span className="text-sm font-bold text-slate-700">Manage Orders</span>
            </button>
          </div>

          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Requests</h3>
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center bg-slate-50/50">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100">
                <Bell size={20} className="text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No new requests for your trips yet.</p>
              <button className="mt-3 text-xs text-emerald-600 font-bold">Promote your trip</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );

  /**
   * PAGE: Orders
   */
  const OrdersPage = () => (
    <div className="pb-24 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>
      
      {/* Active Order Card */}
      <Card className="p-0 border-l-4 border-l-emerald-500">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-slate-500">#ORD-9281</span>
          <div className="flex gap-2">
             <Badge type="warning">En Route</Badge>
             {/* FETA/NETA Feature */}
             <Badge type="neutral">NETA (Sea)</Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
              <Package size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Seventeen 'FML' Album</h3>
              <p className="text-xs text-slate-500 mt-1">Carat Ver • Wonwoo Bias</p>
              <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
                 <MapPin size={10} /> Arriving at PH Hub: Dec 5
              </div>
            </div>
          </div>
          
          {/* Packaging Cam */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Camera size={12} /> Packaging Proof
              </span>
              <span className="text-[10px] text-slate-400">2h ago</span>
            </div>
            <div className="h-24 w-full bg-slate-200 rounded flex items-center justify-center relative group cursor-pointer overflow-hidden">
               <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
               <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center z-10 scale-100 group-hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-emerald-500 border-b-[5px] border-b-transparent ml-1" />
               </div>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white border-t border-slate-100 text-center">
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center justify-center gap-1">
            Track Delivery <ArrowRight size={12} />
          </button>
        </div>
      </Card>
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] max-w-sm">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-semibold
            ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}
          `}>
            {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-slate-200 bg-white/80">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BitbitLogo className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm p-1"/>
            <span className="font-bold text-lg tracking-wide text-slate-900">Bitbit</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <Avatar name={CURRENT_USER.displayName} verified={true} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'browse' && <BrowsePage />}
        {activeTab === 'orders' && <OrdersPage />}
        {activeTab === 'profile' && (
          <div className="text-center animate-in fade-in">
            <div className="mt-4 mb-6">
               <Avatar name={CURRENT_USER.displayName} verified={true} size="lg" />
               <h2 className="text-xl font-bold text-slate-900 mt-3">{CURRENT_USER.displayName}</h2>
               <div className="flex justify-center gap-2 mt-2">
                  <Badge type="neutral">Trust Score: {CURRENT_USER.reputationScore}</Badge>
                  <Badge type="success">Verified ID</Badge>
               </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-left">
               <Card className="p-4 flex items-center justify-between border-emerald-200 bg-emerald-50/50">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                        <Wallet size={18} />
                    </div>
                    <div>
                        <div className="text-xs text-emerald-700 font-bold uppercase">Escrow Balance</div>
                        <div className="text-lg font-bold text-emerald-900">₱2,450.00</div>
                    </div>
                 </div>
                 <button className="text-xs font-bold bg-white text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">Top Up</button>
               </Card>
               <Card className="p-4 flex items-center justify-between">
                 <span className="text-sm font-medium text-slate-700">Saved Routes</span>
                 <ChevronRight size={16} className="text-slate-400" />
               </Card>
               <Card className="p-4 flex items-center justify-between">
                 <span className="text-sm font-medium text-slate-700">Transaction History</span>
                 <ChevronRight size={16} className="text-slate-400" />
               </Card>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 safe-area-bottom pb-1">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`flex flex-col items-center gap-1 w-16 p-1 rounded-lg transition-colors ${activeTab === 'browse' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Search size={22} strokeWidth={activeTab === 'browse' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Explore</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 w-16 p-1 rounded-lg transition-colors ${activeTab === 'orders' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Package size={22} strokeWidth={activeTab === 'orders' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Orders</span>
          </button>

          {/* Floating Action Button */}
          <div className="relative -top-6">
             <button 
               onClick={() => mode === 'traveler' ? setIsPostTripOpen(true) : setActiveTab('browse')}
               className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/40 flex items-center justify-center border-4 border-slate-50 active:scale-95 transition-transform"
             >
               {mode === 'traveler' ? <Plus size={26} /> : <Globe size={26} />}
             </button>
          </div>

          <button 
            onClick={() => showToast("Messages feature coming soon!", "neutral")}
            className="flex flex-col items-center gap-1 w-16 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Users size={22} strokeWidth={2} />
            <span className="text-[10px] font-bold">Comm</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 w-16 p-1 rounded-lg transition-colors ${activeTab === 'profile' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <GroupOrderModal />
      <PostTripModal />
      
      <style>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}