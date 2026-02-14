"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

import { supabase } from "@/lib/supabaseClient";
import PixelGallery from "@/components/PixelGallery";
import RPGDialog from "@/components/RPGDialog";
// import FlowerSelector from "@/components/FlowerSelector";
// import PixelGarden from "@/components/PixelGarden";
import CoupleStory from "@/components/CoupleStory";
import LocationModal from "@/components/LocationModal";
import GiftModal from "@/components/GiftModal";



export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const balloonRef = useRef<HTMLDivElement>(null);
  const weddingCardRef = useRef<HTMLDivElement>(null);
  const weddingGiftRef = useRef<HTMLDivElement>(null);
  const thankYouRef = useRef<HTMLDivElement>(null);
  const [showCircles, setShowCircles] = useState(false);
  const [showWeddingCard, setShowWeddingCard] = useState(false);
  const [showWeddingGift, setShowWeddingGift] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);



  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showLocationIcon, setShowLocationIcon] = useState(false);
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Guestbook State
  const [flyingMessages, setFlyingMessages] = useState<{ id: number, name: string, message: string, left: number, color: string }[]>([]);
  const [showCupids, setShowCupids] = useState(false);
  // const [newName, setNewName] = useState("");
  // const [newMessage, setNewMessage] = useState("");
  // const [selectedFlower, setSelectedFlower] = useState("rose");
  // const [isSubmitted, setIsSubmitted] = useState(false);


  // Subscribe to Realtime Wishes
  useEffect(() => {
    const channel = supabase
      .channel('realtime-wishes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
        const newWish = payload.new as { id: number, name: string, message: string };
        triggerFlyingMessage(newWish.name, newWish.message);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const triggerFlyingMessage = (name: string, message: string) => {
    const id = Date.now();
    const colors = ["#FF69B4", "#FF1493", "#FF0000", "#FF4500", "#FFA500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomLeft = Math.random() * 80 + 10; // Random position between 10% and 90%

    setFlyingMessages(prev => [...prev, {
      id,
      name: name.toUpperCase(),
      message: message.toUpperCase(),
      left: randomLeft,
      color: randomColor
    }]);

    // Cleanup after animation (10s)
    setTimeout(() => {
      setFlyingMessages(prev => prev.filter(msg => msg.id !== id));
    }, 10000);
  };

  const handleSendLove = () => {
    const messages = ["Success!", "Happy Wedding!", "Congrats!", "Cheers!", "Best Wishes!", "So Happy!", "Good Luck!"];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    triggerFlyingMessage("Friend", randomMsg);
  };

  /*
    const handleMessageSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    };
    */



  useEffect(() => {
    // Set target date
    const targetDate = new Date("2026-02-22T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const balloon = balloonRef.current;
    if (!container || !balloon) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = container.scrollTop;

          // Show Location Icon when scrolled down > 100px
          if (scrollTop > 100) {
            setShowLocationIcon(true);
          } else {
            setShowLocationIcon(false);
          }

          // Animate circles when scrolling down a bit (e.g., > 100px)
          if (scrollTop > 100) {
            setShowCircles(true);
          } else {
            setShowCircles(false);
          }

          // Show cupids when balloon arrives near wishes (approx > 500px scroll)
          if (scrollTop > 500) {
            setShowCupids(true);
          } else {
            setShowCupids(false);
          }

          // Show tooltip only when near bottom (footer)
          // Threshold: document height - window height - 200px (approx footer height trigger)
          const isNearBottom = scrollTop + window.innerHeight >= container.scrollHeight - 400;
          if (isNearBottom) {
            setShowLocationTooltip(true);
          } else {
            setShowLocationTooltip(false);
          }

          // Calculate movement:
          // 1. Move Y down with scroll (parallax effect).
          // Cap it so it doesn't fly off the bottom.
          // Cap the movement so it lands nicely
          // We want it to stop say 300px from the bottom (approx balloon size + footer)
          // Calculate movement moved down
          // 2. Move X - Swaying logic
          // Swings left/right but should return to center upon reaching bottom
          const maxScroll = container.scrollHeight - container.clientHeight;
          const scrollProgress = scrollTop / maxScroll; // 0 to 1

          // Sway intensity starts at 0, ramps up, then ramps down at end
          let swayIntensity = Math.min((scrollTop - 400) / 200, 1);
          if (swayIntensity < 0) swayIntensity = 0;

          // Calculate limit based on wedding card position
          const weddingCard = weddingCardRef.current;
          let limitY = window.innerHeight - 300; // Default fallback
          const balloonHeight = balloon.offsetHeight || 300;

          if (weddingCard) {
            const cardRect = weddingCard.getBoundingClientRect();
            // We want balloon bottom to sit on card top
            // Balloon Top (viewport) = -10vh + moveY
            // Balloon Bottom (viewport) = -10vh + moveY + balloonHeight
            // Card Top (viewport) = cardRect.top

            // So: -10vh + moveY + balloonHeight <= cardRect.top
            // moveY <= cardRect.top - balloonHeight + 10vh
            // Note: 10vh is approx window.innerHeight * 0.1
            const vhOffset = window.innerHeight * 0.1;
            limitY = cardRect.top - balloonHeight + vhOffset - 20; // -20 for slight overlap/padding

            // Animate card in when it comes into view
            if (cardRect.top < window.innerHeight * 0.85) {
              setShowWeddingCard(true);
            }
          }

          // Wedding Gift Animation
          const weddingGift = weddingGiftRef.current;
          if (weddingGift) {
            const giftRect = weddingGift.getBoundingClientRect();
            if (giftRect.top < window.innerHeight * 0.85) {
              setShowWeddingGift(true);
            }
          }

          // Thank You Animation
          const thankYou = thankYouRef.current;
          if (thankYou) {
            const thankRect = thankYou.getBoundingClientRect();
            if (thankRect.top < window.innerHeight * 0.85) {
              setShowThankYou(true);
            }
          }

          // Sway decay when close to landing
          // We can approximate "close" using the limitY vs current expected parallax
          // But looking at scrollProgress is safer for now or just letting it land.
          const currentY = scrollTop * 0.15;
          const isLanded = currentY >= limitY;

          if (isLanded) {
            swayIntensity = 0;
          } else if (scrollProgress > 0.8) {
            const decay = (scrollProgress - 0.8) * 5; // 0 to 1
            swayIntensity *= (1 - decay);
          }

          // Apply transform
          const moveY = Math.min(scrollTop * 0.15, limitY);

          const sway = Math.sin(scrollTop / 350) * 45 * swayIntensity;
          const moveXPercent = -50 + sway;

          // 3. Scale down slightly to simulate distance
          const scale = 1 - (Math.min(scrollTop / 800, 1) * 0.3);

          balloon.style.transform = `translate(${moveXPercent}%, ${moveY}px) scale(${scale})`;
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden", // Prevent horizontal scroll
        position: "relative",
        scrollBehavior: "smooth",
        paddingBottom: "0px"
      }}
    >
      {/* Animation keyframes & Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        @keyframes balloonFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes balloonSway {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: 15px; }
        }
        @keyframes heartBeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.15); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }
        @keyframes flyUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120vh) scale(0.8); opacity: 0; }
        }
        @keyframes flyInLeft {
          0% { transform: translateX(-100px) translateY(20px); opacity: 0; }
          100% { transform: translateX(0) translateY(0); opacity: 1; }
        }
        @keyframes flyInRight {
          0% { transform: translateX(100px) translateY(20px); opacity: 0; }
          100% { transform: translateX(0) translateY(0); opacity: 1; }
        }

        /* Cupid Responsive Styles */
        .cupid-container {
          position: absolute;
          top: 0px; /* Moved up */
          width: 200px;
          height: 200px;
          /* Animation is handled by JS for entrance, but we can add float here if we want continuous movement */
          animation: balloonFloat 3s ease-in-out infinite;
        }
        .cupid-left {
          left: 5%; /* Closer to center */
          transform: rotate(-10deg);
        }
        .cupid-right {
          right: 5%; /* Closer to center */
          transform: rotate(10deg);
        }

        @media (max-width: 800px) {
          .cupid-container {
             width: 140px;
             height: 140px;
             top: 40px;
          }
          .cupid-left {
            left: -10px;
          }
          .cupid-right {
            right: -10px;
          }
        }

        .content-responsive {
          margin-top: 45vh; /* Desktop default */
        }
        @media (max-width: 768px) {
          .content-responsive {
            margin-top: 32vh; /* Reduced for mobile */
          }
        }

        .pixel-btn {
          background-color: #FF69B4;
          border: none;
          color: white;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
          margin: 10px 2px;
          cursor: pointer;
          font-family: 'Press Start 2P', cursive;
          box-shadow: 4px 4px 0px #C71585;
          transition: all 0.1s;
          position: relative;
          text-transform: uppercase;
        }
        .pixel-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #C71585;
          background-color: #FF1493;
        }
        .pixel-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px #C71585;
        }

        .kpay-card {
            transition: transform 0.3s ease;
        }
        .kpay-card:hover {
            transform: scale(1.05) rotate(2deg);
        }



        
        .location-hint {
          position: absolute;
          bottom: 75px;
          background: #fff;
          color: #000;
          padding: 8px 12px;
          border: 4px solid #000;
          font-family: 'Courier New', Courier, monospace; 
          font-weight: bold;
          font-size: 0.8rem;
          white-space: nowrap;
          box-shadow: 6px 6px 0px rgba(0,0,0,0.4);
          pointer-events: none;
          z-index: 1001;
          display: block;
        }
        /* Pixel arrow */
        .location-hint::after {
           content: "";
           position: absolute;
           bottom: -9px;
           left: 50%;
           transform: translateX(-50%);
           width: 0;
           height: 0;
           border-left: 8px solid transparent;
           border-right: 8px solid transparent;
           border-top: 8px solid #000;
           z-index: -1;
        }
        .location-hint::before {
           content: "";
           position: absolute;
           bottom: -5px;
           left: 50%;
           transform: translateX(-50%);
           width: 0; 
           height: 0; 
           border-left: 5px solid transparent;
           border-right: 5px solid transparent;
           border-top: 5px solid #fff;
           z-index: 0;
        }

        .location-icon-btn {
          width: 60px;
          height: 60px;
          background-color: #fff;
          box-shadow: 4px 4px 0px #000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: fixed;
          bottom: 20px;
          left: 20px;
          transition: all 0.1s;
          pointer-events: auto;
          border: 4px solid #000;
          z-index: 1000;
        }
        .location-icon-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #000;
            background-color: #f0f0f0;
        }
        .location-icon-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #000;
        }


        .gift-icon-btn {
          width: 60px;
          height: 60px;
          background-color: #fff;
          box-shadow: 4px 4px 0px #000;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: fixed;
          bottom: 20px;
          right: 20px;
          transition: all 0.1s;
          pointer-events: auto;
          border: 4px solid #000;
          z-index: 1000;
        }
        .gift-icon-btn:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #000;
            background-color: #f0f0f0;
        }
        .gift-icon-btn:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #000;
        }

        .gift-hint {
          position: absolute;
          bottom: 75px;
          left: -10px;
          background-color: #fff;
          color: #000;
          padding: 10px 14px;
          border: 4px solid #000;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 0.8rem;
          white-space: nowrap;
          box-shadow: 6px 6px 0px rgba(0,0,0,0.4);
          pointer-events: none;
          z-index: 1001;
          animation: floatHint 2s ease-in-out infinite;
          text-shadow: none;
        }
        .gift-hint::after {
           content: "";
           position: absolute;
           bottom: -12px;
           left: 25px;
           width: 0; 
           height: 0; 
           border-left: 10px solid transparent;
           border-right: 10px solid transparent;
           border-top: 12px solid #000;
        }
        .gift-hint::before {
           content: "";
           position: absolute;
           bottom: -6px;
           left: 27px;
           width: 0; 
           height: 0; 
           border-left: 8px solid transparent;
           border-right: 8px solid transparent;
           border-top: 10px solid #fff;
           z-index: 1;
        }

        @keyframes floatHint {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>



      {/* Fixed background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Balloon Container - moves with scroll via JS transform */}
      <div
        ref={balloonRef}
        style={{
          position: "fixed",
          top: "-10vh", // Initial position
          left: "50%",
          // Custom transform managed by JS scroll handler
          transform: "translate(-50%, 0px)",
          zIndex: 200, // Fly above
          pointerEvents: "none",
          willChange: "transform", // Hint for browser optimization
          transition: "transform 0.1s linear" // Smooth out JS updates slightly
        }}
      >
        {/* Inner div for floating animations (independent of scroll transform) */}
        <div
          style={{
            animation: "balloonFloat 3s ease-in-out infinite, balloonSway 5s ease-in-out infinite",
          }}
        >
          <Image
            src="/B2.svg"
            alt="Pixel Balloon"
            width={0}
            height={0}
            sizes="100vw"
            priority
            style={{
              width: "clamp(200px, 30vw, 400px)",
              height: "auto",
              imageRendering: "pixelated",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
            }}
          />
        </div>
      </div>

      {/* Save The Date & Details - Scrolls with page */}
      <div
        className="content-responsive"
        style={{
          position: "relative",
          // marginTop handled by css
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20, // High z-index to stay on top
          textAlign: "center",
          width: "100%",
          maxWidth: "1280px", // Limit max width for large screens
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h1
            style={{
              display: "inline-block",
              margin: "0",
              fontSize: "2.5rem",
              color: "#FF8C00", // Retro Orange
              textShadow: "3px 3px 0px #000",
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: "bold"
            }}
          >
            SAVE THE DATE
          </h1>
        </div>

        {/* Date */}
        <p style={{
          fontSize: "1.5rem",
          color: "white",
          marginTop: "10px",
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: "bold",
          textShadow: "2px 2px 0px #000"
        }}>
          22.02.2026
        </p>

        {/* Groom & Bride Image Circles - Animate In */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "60px", // Increased space between circles
            marginTop: "20px",
            pointerEvents: "auto",
            transform: showCircles ? "scale(1)" : "scale(0) translateY(50px)", // Pop in effect
            opacity: showCircles ? 1 : 0,
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out", // Bouncy pop
          }}
        >
          {/* Groom Image */}
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            border: "4px solid white", backgroundColor: "#87CEEB", // Light Pixel Blue
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "4px 4px 0px rgba(0,0,0,0.3)",
            overflow: "hidden", // Clip image to circle
            position: "relative"
          }}>
            <Image
              src="/Groom.png"
              alt="Groom"
              fill
              style={{ objectFit: "cover", imageRendering: "pixelated" }}
            />
          </div>

          {/* Pixel Hearts */}
          <div style={{ position: "relative", width: "50px", height: "40px" }}>
            {/* Big Heart */}
            <div style={{ position: "absolute", left: "-10px", bottom: "0", zIndex: 10, animation: "heartBeat 1.5s infinite" }}>
              <svg width="42" height="36" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated", filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.3))" }}>
                <path d="M1 0H3V1H1V0ZM4 0H6V1H4V0ZM0 1H7V3H0V1ZM1 3H6V4H1V3ZM2 4H5V5H2V4ZM3 5H4V6H3V5Z" fill="#FF0000" />
              </svg>
            </div>
            {/* Small Heart */}
            <div style={{ position: "absolute", right: "-10px", top: "-10px", zIndex: 5, animation: "heartBeat 1.5s infinite 0.5s" }}>
              <svg width="30" height="26" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated" }}>
                <path d="M1 0H3V1H1V0ZM4 0H6V1H4V0ZM0 1H7V3H0V1ZM1 3H6V4H1V3ZM2 4H5V5H2V4ZM3 5H4V6H3V5Z" fill="#FF69B4" />
              </svg>
            </div>
          </div>

          {/* Bride Image */}
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            border: "4px solid white", backgroundColor: "#FF69B4", // Pixel Pink
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "4px 4px 0px rgba(0,0,0,0.3)",
            overflow: "hidden", // Clip image to circle
            position: "relative"
          }}>
            <Image
              src="/bridge.png"
              alt="Bride"
              fill
              style={{ objectFit: "cover", imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* BIG FEATURE: COUNTDOWN TIMER */}
        <div style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}>
          <p style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "1.2rem",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 0px #000",
            margin: 0
          }}>
            THE TIME WILL START IN
          </p>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            fontFamily: "'Courier New', Courier, monospace",
          }}>
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HRS", value: timeLeft.hours },
              { label: "MINS", value: timeLeft.minutes },
              { label: "SECS", value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <div style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  border: "2px solid white",
                  color: "#FF8C00", // Retro Orange Numbers
                  padding: "10px",
                  minWidth: "60px",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  boxShadow: "4px 4px 0px rgba(0,0,0,0.3)",
                  marginBottom: "5px"
                }}>
                  {String(item.value).padStart(2, '0')}
                </div>
                <span style={{ color: "white", fontSize: "0.8rem", fontWeight: "bold", textShadow: "1px 1px 0 #000" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Down Arrow Animation */}
          <div style={{ animation: "balloonFloat 2s infinite", marginTop: "20px", fontSize: "2rem", color: "white", textShadow: "2px 2px 0px #000" }}>
            ↓
          </div>

          <PixelGallery />


          <div
            ref={weddingCardRef}
            style={{
              marginTop: "150px", // Increased spacing
              marginBottom: "80px",
              width: "90%",
              maxWidth: "600px",
              position: "relative",
              zIndex: 15,
              pointerEvents: "auto",
              transform: showWeddingCard ? "scale(1) translateY(0)" : "scale(0.8) translateY(100px)",
              opacity: showWeddingCard ? 1 : 0,
              transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out",
            }}
          >
            {/* Actual Glass Card */}
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)", // Solid background
              border: "4px solid rgba(0, 0, 0, 0.8)", // Stronger border for pixel look
              boxShadow: "8px 8px 0px rgba(0, 0, 0, 0.3)",
              padding: "30px",
              imageRendering: "pixelated",
              textAlign: "center",
              color: "#333",
              fontFamily: "'Courier New', Courier, monospace", // Monospace Font
              fontSize: "1rem",
            }}>



              {/* GROOM SECTION */}
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #333", display: "inline-block", paddingBottom: "4px", marginBottom: "16px" }}>THE GROOM</h2>

              <p style={{ fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "8px" }}>
                မန္တလေးတိုင်းဒေသကြီး၊ ချမ်းအေးသာစံမြို့နယ်၊ ပြည်ကြီးပျော်ဘွယ်အနောက်ရပ်ကွက်နေ<br />
                Dr. Kyaw Zin Lin + Dr. Thiri Hla Myint တို့၏မောင်၊ Ko Nay Min Tun + Ma Su Pann Ei တို့၏အစ်ကို၊ U Aung Khaing + Daw Hnin Hnin Oo တို့၏သား
              </p>

              <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#000", margin: "12px 0", textShadow: "2px 2px 0px rgba(255,255,255,0.5)" }}>
                Zaw Ye Chan
              </h1>

              <p style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "24px" }}>
                B.A (Economics)<br />
                (Shwe Mandalay Trading)
              </p>

              {/* BRIDE SECTION */}
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #333", display: "inline-block", paddingBottom: "4px", marginBottom: "16px" }}>THE BRIDE</h2>

              <p style={{ fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "8px" }}>
                မန္တလေးတိုင်းဒေသကြီး၊ တံတားဦးမြို့၊ ရေလည်ရပ်နေ<br />
                U Win Htike + Daw Sandar Moe တို့၏မြေး၊ Ko Pyae Phyo Aung, B.A (English) + Ma Khin Yadanar May, B.Sc (Zoology) တို့၏ညီမ၊<br />
                တံတားဦးမြို့ အိမ်သစ်တန်းရပ်နေ U Soe Min + Daw Thazin Aye တို့၏သမီး
              </p>

              <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#000", margin: "12px 0", textShadow: "2px 2px 0px rgba(255,255,255,0.5)" }}>
                Thar Nwe Yi
              </h1>

              <p style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "24px", lineHeight: "1.4" }}>
                B.A (Geography)<br />
                Founder of Golden Star Education Center<br />
                Diploma in English (MUFL)<br />
                Diploma in Child Psychology<br />
                Diploma in Early Childhood Education
              </p>

              {/* INVITATION */}
              <div style={{ borderTop: "2px dashed #999", paddingTop: "20px", marginTop: "20px" }}>
                <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#555" }}>
                  တို့၏ 'မင်္ဂလာပွဲ' သို့ ကြွရောက်ပေးပါရန်<br />
                  ခင်မင်ရင်းနှီးစွာဖြင့် ဖိတ်ကြားအပ်ပါသည်။
                </p>
              </div>

            </div>

            {/* CUPIDS (Animated) */}
            <div style={{ position: "relative", height: "0", zIndex: 20 }}>
              {/* Left Cupid */}
              <div
                className="cupid-container cupid-left"
                style={{
                  opacity: showWeddingCard ? 1 : 0,
                  transform: showWeddingCard ? "translateX(0) rotate(-10deg)" : "translateX(-100px) rotate(-10deg)",
                  transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s, opacity 1s ease-out 0.5s"
                }}
              >
                <Image
                  src="/cupid.svg"
                  alt="Cupid"
                  fill
                  style={{ objectFit: "contain", imageRendering: "pixelated", filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.2))" }}
                />
              </div>

              {/* Right Cupid */}
              <div
                className="cupid-container cupid-right"
                style={{
                  opacity: showWeddingCard ? 1 : 0,
                  transform: showWeddingCard ? "translateX(0) rotate(10deg)" : "translateX(100px) rotate(10deg)",
                  transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s, opacity 1s ease-out 0.5s"
                }}
              >
                <Image
                  src="/cupid.svg"
                  alt="Cupid"
                  fill
                  style={{ objectFit: "contain", imageRendering: "pixelated", filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.2))", transform: "scaleX(-1)" }}
                />
              </div>

              {/* Zaw And Thar Text */}
              <div
                style={{
                  position: "absolute",
                  top: "100px", // Moved further down to 100px
                  left: "50%",
                  transform: showWeddingCard ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0)",
                  opacity: showWeddingCard ? 1 : 0,
                  transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s, opacity 1s ease-out 0.7s",
                  zIndex: 25,
                  textAlign: "center",
                  width: "100%",
                  pointerEvents: "none"
                }}
              >
                <h2 style={{
                  fontFamily: "'Press Start 2P', system-ui",
                  fontSize: "1.2rem",
                  color: "#FF69B4", // Hot Pink
                  textShadow: "3px 3px 0 #fff, 0 0 10px rgba(255,105,180,0.5)",
                  lineHeight: "1.5",
                  margin: 0,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  padding: "10px",
                  borderRadius: "10px",
                  display: "inline-block",
                  border: "2px solid #333"
                }}>
                  Zaw <span style={{ color: "#FF8C00", fontSize: "0.8em" }}>&</span> Thar
                </h2>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "100px", width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 20 }}>
            <RPGDialog />
          </div>

          <CoupleStory />














          {/* THANK YOU SECTION */}
          <div
            ref={thankYouRef}
            style={{
              marginTop: "30px",
              marginBottom: "30px",
              textAlign: "center",
              padding: "20px",
              backgroundColor: "#fff",
              border: "4px solid #000",
              boxShadow: "8px 8px 0px #000",
              maxWidth: "600px",
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              position: "relative",
              imageRendering: "pixelated",
              transform: showThankYou ? "scale(1) translateY(0)" : "scale(0.8) translateY(100px)",
              opacity: showThankYou ? 1 : 0,
              transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out"
            }}>

            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "center" }}>
              <Image
                src="/great.gif"
                alt="Great"
                width={100}
                height={100}
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <h2 style={{
              fontFamily: "'Press Start 2P', system-ui",
              fontSize: "1.2rem",
              marginBottom: "15px",
              color: "#333",
              lineHeight: "1.5"
            }}>
              THANK YOU!
            </h2>
            <p style={{
              fontFamily: "'Padauk', sans-serif", // Changed font for Myanmar support
              fontSize: "1rem", // Adjusted size for readability
              fontWeight: "bold",
              color: "#FFD700", // Gold/Yellow
              lineHeight: "1.6",
              textShadow: "2px 2px 0 #000", // Black shadow for contrast
              marginTop: "10px"
            }}>
              မင်္ဂလာပွဲအားကြွရောက်ပေးတဲ့အတွက်အထူးကျေးဇူးတင်ပါသည်
            </p>

            <div style={{ marginTop: "25px" }}>
              <button onClick={handleSendLove} className="pixel-btn">
                SEND LOVE ❤️
              </button>
            </div>

          </div>




          <div style={{ height: "50px" }}></div>

          {/* Action Buttons Container */}




          {/* FOOTER IMAGE */}
          <div style={{
            width: "100%",
            marginTop: "50px",
            position: "relative",
            minHeight: "400px",
            backgroundImage: "url('/green.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderTop: "8px solid #000",
            imageRendering: "pixelated"
          }}>
          </div>
        </div>
      </div>














      {/* FLYING MESSAGES CONTAINER */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 100,
        overflow: "hidden"
      }}>
        {flyingMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              position: "absolute",
              left: `${msg.left}%`,
              bottom: "-100px", // Start below screen
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: "flyUp 8s linear forwards",
            }}
          >
            {/* Message Bubble */}
            <div style={{
              backgroundColor: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              textAlign: "center",
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "0.9rem",
              fontWeight: "bold",
              color: "#333",
              boxShadow: "2px 2px 0px rgba(0,0,0,0.2)",
              minWidth: "120px"
            }}>
              <span style={{ color: msg.color, textTransform: "uppercase" }}>{msg.name}</span>
              <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>{msg.message}</div>
            </div>

            {/* Balloon String */}
            <div style={{
              width: "2px",
              height: "40px",
              backgroundColor: "rgba(255,255,255,0.6)",
              marginTop: "-2px"
            }} />

            {/* Balloon */}
            <div style={{
              width: "40px",
              height: "50px",
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${msg.color})`,
              borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              boxShadow: "inset -5px -5px 10px rgba(0,0,0,0.1)",
              position: "relative"
            }}>
              {/* Knot */}
              <div style={{
                position: "absolute",
                bottom: "-4px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "6px",
                height: "6px",
                backgroundColor: msg.color,
                borderRadius: "50%"
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Render LocationModal and the floating button */}
      <LocationModal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} />
      <GiftModal isOpen={showGiftModal} onClose={() => setShowGiftModal(false)} />

      <div
        className="location-icon-btn"
        onClick={() => setShowLocationModal(true)}
        title="See Wedding Location"
        style={{
          opacity: showLocationIcon ? 1 : 0,
          pointerEvents: showLocationIcon ? "auto" : "none",
          transform: showLocationIcon ? "scale(1)" : "scale(0.8)",
          transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
        }}
      >
        <div
          className="location-hint"
          style={{
            bottom: "75px",
            // The icon is on the LEFT, so tooltip should align to its left, 
            // but since it's at the screen edge, maybe push it right a bit?
            // Actually let's keep it centered or stick to left edge.
            left: "-10px",
            opacity: showLocationTooltip ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            pointerEvents: "none"
          }}
        >
          မင်္ဂလာပွဲလိပ်စာကြည့်ရန်
        </div>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="#ec008c" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated" }}>
          <path d="M10 2H14V4H16V6H18V10H16V12H14V14H12V16H14V18H12V22H10V16H8V14H6V12H4V10H6V6H8V4H10V2ZM10 6H8V10H10V6ZM14 6H12V10H14V6Z" />
        </svg>
      </div>


      <div
        className="gift-icon-btn"
        onClick={() => setShowGiftModal(true)}
        title="Send Wedding Gift"
        style={{
          opacity: showLocationIcon ? 1 : 0,
          pointerEvents: showLocationIcon ? "auto" : "none",
          transform: showLocationIcon ? "scale(1)" : "scale(0.8)",
          transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
        }}
      >
        <div
          className="location-hint"
          style={{
            bottom: "75px",
            right: "-10px",
            opacity: showLocationTooltip ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            pointerEvents: "none"
          }}
        >
          မင်္ဂလာလက်ဖွဲ့ပေးရန်
        </div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#E91E63" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: "pixelated" }}>
          <path d="M4 4H10V6H4V4ZM14 4H20V6H14V4ZM4 8H20V10H4V8ZM4 12H20V20H4V12ZM11 12H13V20H11V12ZM6 12H9V14H6V12ZM15 12H18V14H15V12Z" />
          <path d="M8 2H10V4H8V2ZM14 2H16V4H14V2Z" />
        </svg>
      </div>







    </div >
  );
}
