"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

import { supabase } from "@/lib/supabaseClient";
import PixelGallery from "@/components/PixelGallery";
import RPGDialog from "@/components/RPGDialog";
import FlowerSelector from "@/components/FlowerSelector";
import PixelGarden from "@/components/PixelGarden";
import CoupleStory from "@/components/CoupleStory";
import WeddingLocation from "@/components/WeddingLocation";
import PixelFooter from "@/components/PixelFooter";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const balloonRef = useRef<HTMLDivElement>(null);
  const [showCircles, setShowCircles] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Guestbook State
  const [flyingMessages, setFlyingMessages] = useState<{ id: number, name: string, message: string, left: number, color: string }[]>([]);
  const [showCupids, setShowCupids] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedFlower, setSelectedFlower] = useState("rose");
  const [isSubmitted, setIsSubmitted] = useState(false);


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

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    // Send to Supabase
    const { error } = await supabase
      .from('wishes')
      .insert([{ name: newName, message: newMessage, avatar_id: selectedFlower }]);

    if (error) {
      console.error('Error sending wish:', error);
      // Fallback: Show locally if offline/error
      triggerFlyingMessage(newName, newMessage);
    }

    setNewName("");
    setNewMessage("");
    setIsSubmitted(true);
  };



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

          // Calculate movement:
          // 1. Move Y down with scroll (parallax effect).
          // Cap it so it doesn't fly off the bottom.
          // Cap the movement so it lands nicely
          // We want it to stop say 350px from the bottom (approx balloon size + footer)
          const endY = window.innerHeight - 350;
          const moveY = Math.min(scrollTop * 0.15, endY);

          // 2. Move X to the right to clear center text
          // Progress: 0 to 1 over 800px of scroll
          const progress = Math.min(scrollTop / 800, 1);
          // Zig-Zag Path (Left -> Right -> Left)
          // Start moving left/right only after passing the countdown (approx 400px scroll)
          // Smoothly transition from center (-50%) to swaying
          const swayStart = 400;
          const swayIntensity = Math.min(Math.max((scrollTop - swayStart) / 200, 0), 1);

          const sway = Math.sin(scrollTop / 350) * 45 * swayIntensity;
          const moveXPercent = -50 + sway;


          // 3. Scale down slightly to simulate distance
          const scale = 1 - (progress * 0.3); // 1.0 -> 0.7

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
        scrollBehavior: "smooth"
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
      `}</style>



      {/* Balloon Container - moves with scroll via JS transform */}
      <div
        ref={balloonRef}
        style={{
          position: "fixed",
          top: "0vh", // Initial position
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
            src="/8.svg"
            alt="Pixel Balloon"
            width={0}
            height={0}
            sizes="100vw"
            priority
            style={{
              width: "clamp(200px, 40vw, 450px)",
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
        style={{
          position: "relative",
          marginTop: "30vh", // Positioned below initial balloon view
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20, // High z-index to stay on top
          textAlign: "center",
          width: "100%",
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
            style={{
              marginTop: "150px", // Increased spacing
              marginBottom: "80px",
              width: "90%",
              maxWidth: "600px",
              position: "relative",
              zIndex: 15,
              pointerEvents: "auto",
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
              <div className="cupid-container cupid-left">
                <Image
                  src="/cupid.svg"
                  alt="Cupid"
                  fill
                  style={{ objectFit: "contain", imageRendering: "pixelated", filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.2))" }}
                />
              </div>

              {/* Right Cupid */}
              <div className="cupid-container cupid-right">
                <Image
                  src="/cupid.svg"
                  alt="Cupid"
                  fill
                  style={{ objectFit: "contain", imageRendering: "pixelated", filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.2))", transform: "scaleX(-1)" }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "100px", width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 20 }}>
            <RPGDialog />
          </div>

          <CoupleStory />

          <WeddingLocation />

          {/* GARDEN GUESTBOOK FORM */}
          <div style={{
            marginTop: "40px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "8px solid #27ae60", // Green border
            borderRadius: "20px",
            boxShadow: "8px 8px 0 rgba(0,0,0,0.2)",
            padding: "40px",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            position: "relative",
            zIndex: 30
          }}>
            {!isSubmitted ? (
              <>
                <h2 style={{
                  fontFamily: "'Press Start 2P', system-ui",
                  marginBottom: "20px",
                  fontSize: "1.2rem",
                  textAlign: "center",
                  lineHeight: "1.5",
                  color: "#27ae60",
                  textShadow: "2px 2px 0 #cef"
                }}>
                  PLANT A WISH
                </h2>

                <p style={{ fontFamily: "'Courier New', monospace", textAlign: "center", marginBottom: "20px", fontSize: "0.9rem" }}>
                  Leave a message and plant a flower in our garden!
                </p>

                <form onSubmit={handleMessageSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "15px" }}>
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{
                      padding: "15px",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "1rem",
                      border: "2px solid #27ae60",
                      outline: "none",
                      borderRadius: "10px"
                    }}
                  />
                  <textarea
                    placeholder="YOUR WISH..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    style={{
                      padding: "15px",
                      fontFamily: "'Courier New', monospace",
                      fontSize: "1rem",
                      border: "2px solid #27ae60",
                      outline: "none",
                      resize: "none",
                      borderRadius: "10px"
                    }}
                  />

                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <label style={{ fontFamily: "'Courier New', monospace", fontWeight: "bold", display: "block", marginBottom: "10px", color: "#27ae60" }}>PICK A FLOWER:</label>
                    <FlowerSelector selectedFlower={selectedFlower} onSelect={setSelectedFlower} />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "15px",
                      backgroundColor: "#27ae60",
                      color: "white",
                      fontFamily: "'Press Start 2P', system-ui",
                      fontSize: "1rem",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 6px 0 #1e8449",
                      borderRadius: "10px",
                      marginTop: "10px",
                      transition: "transform 0.1s"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "translateY(4px)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    PLANT FLOWER 🌻
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", animation: "flyInLeft 0.5s ease-out" }}>
                <h2 style={{
                  fontFamily: "'Press Start 2P', system-ui",
                  marginBottom: "20px",
                  fontSize: "1.5rem",
                  color: "#27ae60",
                  textShadow: "2px 2px 0 #cef"
                }}>
                  THANK YOU! 🌻
                </h2>
                <p style={{ fontFamily: "'Courier New', monospace", marginBottom: "30px", fontSize: "1.1rem" }}>
                  Your flower has been planted in the garden.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  style={{
                    padding: "15px",
                    backgroundColor: "#f1c40f",
                    color: "white",
                    fontFamily: "'Press Start 2P', system-ui",
                    fontSize: "0.9rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 6px 0 #d35400",
                    borderRadius: "10px",
                    transition: "transform 0.1s"
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = "translateY(4px)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  PLANT ANOTHER
                </button>
              </div>
            )}
          </div>

          {/* PIXEL GARDEN DISPLAY */}
          <div style={{
            pointerEvents: "auto",
            width: "90%",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "40px",
            marginBottom: "100px" // Space between garden and footer
          }}>
            {/* The PixelGarden component has its own 'grass' background so we can put it directly below or overlapping */}
            <PixelGarden />
          </div>



        </div>
      </div>












      <PixelFooter />

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
          </div>
        ))}
      </div>

    </div >
  );
}
