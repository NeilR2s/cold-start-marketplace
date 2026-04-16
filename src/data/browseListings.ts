export const MOCK_PRODUCTS = [
    {
        id: 1,
        conversationId: "swap-chat-sarah",
        tag: "sakura-tumbler",
        title: "Limited Starbucks Sakura Tumbler 2024",
        description: "Japan Exclusive 2024 Spring Collection. Double-walled stainless steel. Keeps drinks hot/cold for 6 hours. Includes box and shop bag.",
        swapHeadline: "Need 3 more pastry bundles or cafe GCs to close the pool.",
        whatOffering: "Sakura 2024 tumbler + reusable tote straight from Starbucks Shibuya.",
        whatWant: "Pastry bundles, service hours, or local merch worth ₱250 each.",
        openToBundles: true,
        acceptsGroup: true,
        price: 1250,
        originalPrice: 1800,
        image: "https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&q=80&w=600",
        location: "Quezon City",
        distance: 2.5,
        type: "Home",
        swapType: "Group Order",
        deadline: "2024-03-10",
        pooling: { target: 15, current: 12, minFee: 50, baseFee: 150 },
        user: { name: "Sarah J.", verified: true, rating: 4.9, image: "https://i.pravatar.cc/150?u=1" },
        hostView: {
            type: "group",
            announcement: "Pooling closes once 15 slots are filled. Handling fee drops to ₱50.",
            swappers: [
                { id: "sw1", name: "Andrea C.", avatar: "https://i.pravatar.cc/150?u=21", offer: "₱250 + Brownie Box", status: "Paid" },
                { id: "sw2", name: "Kultura Hub", avatar: "https://i.pravatar.cc/150?u=22", offer: "Crochet Keychains bundle", status: "Confirmed" },
                { id: "sw3", name: "Jam P.", avatar: "https://i.pravatar.cc/150?u=23", offer: "2hrs piano lessons", status: "Pending" }
            ],
            totalSlots: 15,
            filledSlots: 12
        },
        comments: [
            { id: "cm1", user: "Paolo V.", avatar: "https://i.pravatar.cc/150?u=31", message: "Can swap 2 hrs drum lessons + Benguet coffee beans.", timestamp: "2m ago", status: "pending" },
            { id: "cm2", user: "Faye D.", avatar: "https://i.pravatar.cc/150?u=32", message: "Offering matcha cookies + tote bag. Keen to join!", timestamp: "18m ago", status: "accepted" }
        ]
    },
    {
        id: 2,
        conversationId: "swap-chat-mike",
        tag: "gentle-monster",
        title: "Gentle Monster Sunglasses (Rick 01)",
        description: "Buying strictly from the flagship store in Haus Dosan. Comes with official warranty card and white packaging.",
        swapHeadline: "Looking for film stock + service hours for styling.",
        whatOffering: "Legit Gentle Monster Rick 01 frame with travel receipt + box.",
        whatWant: "Kodak Gold film packs or styling / content services of equal value.",
        openToBundles: true,
        acceptsGroup: false,
        price: 15400,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600",
        location: "Makati",
        distance: 8.1,
        type: "Fashion",
        swapType: "Pasabuy",
        deadline: "2024-03-14",
        pooling: null,
        user: { name: "Mike T.", verified: true, rating: 5.0, image: "https://i.pravatar.cc/150?u=2" },
        hostView: {
            type: "single",
            swapper: {
                name: "Luna Park",
                avatar: "https://i.pravatar.cc/150?u=41",
                offer: "Custom crochet bag + ₱500 courier credits",
                status: "Negotiating",
                timeline: [
                    { label: "Offer Sent", state: "done" },
                    { label: "Host Review", state: "active" },
                    { label: "Drop-off", state: "pending" },
                    { label: "Swap Complete", state: "pending" }
                ]
            },
            meetupNote: "Preferred meetup at Greenbelt weekends."
        },
        comments: [
            { id: "cm3", user: "Noah Film", avatar: "https://i.pravatar.cc/150?u=33", message: "Can trade 5 rolls Kodak Portra + lookbook shoot.", timestamp: "1h ago", status: "pending" }
        ]
    },
    {
        id: 3,
        tag: "hokkaido-cookies",
        title: "Hokkaido Butter Cookies (24pc)",
        description: "Extra boxes from my recent trip. Expiry date: Sept 2024. Sealed and kept in cool storage.",
        swapHeadline: "Wants craft supplies or hand-poured candles.",
        whatOffering: "Factory-sealed 24pc cookie tins, hand-carried from Sapporo.",
        whatWant: "Handmade candles, crochet services, or grocery GCs.",
        openToBundles: false,
        acceptsGroup: false,
        price: 850,
        originalPrice: 1100,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR7t0BaVwnqTJze2hhwNNH1VWzzVcuktKeVg&s",
        location: "BGC, Taguig",
        distance: 4.2,
        type: "Food",
        swapType: "On Hand",
        deadline: null,
        pooling: null,
        user: { name: "Japan Goodies PH", verified: false, rating: 4.8, image: "https://i.pravatar.cc/150?u=3" },
        hostView: null,
        comments: [
            { id: "cm4", user: "Iris Crafts", avatar: "https://i.pravatar.cc/150?u=34", message: "Offering 2 soy candles + delivery coverage.", timestamp: "3h ago", status: "declined" }
        ]
    },
    {
        id: 4,
        conversationId: "swap-chat-lex",
        tag: "mirrorless-camera-kit",
        title: "Mirrorless Camera Kit",
        description: "Fujifilm X-S20 travel-ready pack with kit lens, extra batteries, and SD card — mirrored from Explore.",
        swapHeadline: "Open to bundle of K-pop albums + handmade crafts.",
        whatOffering: "Body + kit lens + 2 batteries + 128GB SD, same as the Explore listing.",
        whatWant: "Creative bundles, collectibles, or services of similar value.",
        openToBundles: true,
        acceptsGroup: false,
        price: 15400,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1508898578281-774ac4893c0c?auto=format&fit=crop&w=800&q=60",
        location: "Makati",
        distance: 8.1,
        type: "Gadgets",
        swapType: "On Hand",
        deadline: null,
        pooling: null,
        user: { name: "Ken of BGC", verified: true, rating: 5.0, image: "https://i.pravatar.cc/150?u=2" },
        hostView: null,
        comments: [
            { id: "cm5", user: "Studio Nine", avatar: "https://i.pravatar.cc/150?u=35", message: "Offering product shots + promo clips.", timestamp: "45m ago", status: "pending" }
        ]
    }
];