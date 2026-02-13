import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const stories = [
    {
        title: "THE BEGINNING",
        description: "ကံကြမ္မာဆိုတာ တခါတလေ အသံမရှိဘဲ လူနှစ်ယောက်ကို နီးကပ်စေတတ်တယ်။ သူတို့တွေ့ဆုံခဲ့တဲ့နေ့က သာမန်နေ့တစ်နေ့သာ ဖြစ်ခဲ့ပေမယ့် မျက်လုံးချင်း ဆုံတဲ့အချိန်မှာတော့ နှလုံးသားနှစ်ခု တပြိုင်နက် တုန်လှုပ်သွားခဲ့တယ်။",
        side: "left",
        image: "/eye.png",
        icon: "/heart_pixel.png"
    },
    {
        title: "THE FIRST DATE",
        description: "အချိန်တွေက ဖြည်းဖြည်းလှုပ်ရှားလာသလို စာကြည့်တိုက်ထဲမှာ အတူတူလေ့လာခဲ့တဲ့ နေ့ရက်တွေ၊ ကော်ဖီဆိုင်ထဲမှာ တစ်ယောက်နဲ့တစ်ယောက် မျက်လုံးချင်းဆုံပြီး ပြုံးမိခဲ့တဲ့ အချိန်တွေက အချစ်ကို ပိုပြီး အမြစ်ချစေခဲ့ပါတယ်။",
        side: "right",
        image: "/li.png",
        icon: "/flower_pixel.png"
    },
    {
        title: "THE PROPOSAL",
        description: "ပင်လယ်ကမ်းခြေမှာ နေဝင်ချိန်အလင်းရောင်အောက်မှာ နှလုံးသားထဲက အချစ်ကို စကားတစ်ခွန်းအဖြစ် ပြောထုတ်ခဲ့တဲ့ အခိုက်အတန့်မှာ ဘဝတစ်လျှောက် လက်တွဲသွားမယ်ဆိုတဲ့ ကတိတစ်ခု မွေးဖွားခဲ့ပါတယ်။",
        side: "left",
        image: "/pp.png",
        icon: "/ring_pixel.png"
    }
];

export default function CoupleStory() {
    // We need to know the balloon position or scroll position to determine entry direction.
    // Ideally, the parent passes the balloon state, OR we infer it from scroll position similar to the balloon.
    // Balloon logic: sway = Math.sin(scrollTop / 350) * 45 * swayIntensity.
    // Positive Sway = Right. Negative Sway = Left.
    // If Balloon is Left (Negative Sway), Box comes from Right.
    // If Balloon is Right (Positive Sway), Box comes from Left.

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div style={{
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px 10px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            marginTop: "30px",
            marginBottom: "30px" // Space before garden
        }}>
            <div style={{
                backgroundColor: "#f1c40f", // Gold/Yellow color
                border: "4px solid #d35400",
                boxShadow: "6px 6px 0 #c0392b",
                padding: "15px 30px",
                borderRadius: "10px",
                display: "inline-block", // Make it fit the text
                marginBottom: "30px",
                position: "relative"
            }}>
                {/* Decorative Corner Pixels */}
                <div style={{ position: "absolute", top: "-4px", left: "-4px", width: "8px", height: "8px", backgroundColor: "#d35400" }} />
                <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "8px", height: "8px", backgroundColor: "#d35400" }} />
                <div style={{ position: "absolute", bottom: "-4px", left: "-4px", width: "8px", height: "8px", backgroundColor: "#d35400" }} />
                <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "8px", height: "8px", backgroundColor: "#d35400" }} />

                <h2 style={{
                    fontFamily: "'Press Start 2P', system-ui",
                    textAlign: "center",
                    color: "#2c3e50",
                    fontSize: "1.2rem",
                    margin: 0,
                    textShadow: "2px 2px 0 #ecf0f1"
                }}>OUR STORY</h2>
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "30px", alignItems: "center" }}>
                {stories.map((story, index) => {
                    return (
                        <StoryItem key={index} story={story} index={index} />
                    );
                })}
            </div>
        </div>
    );
}

function StoryItem({ story, index }: { story: any, index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Use the side property from the story object
    const isFromLeft = story.side === "left";

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, []);

    return (
        <div
            ref={ref}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#fff",
                border: "4px solid #2c3e50",
                boxShadow: "8px 8px 0 #e84393", // Pixel Pink Shadow
                padding: "20px",
                position: "relative", // For absolute icon
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                    ? "translateX(0)"
                    : `translateX(${isFromLeft ? "-100px" : "100px"})`,
                transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                maxWidth: "500px",
                marginLeft: isFromLeft ? "0" : "auto",
                alignSelf: isFromLeft ? "flex-start" : "flex-end",
            }}
        >


            {story.image && (
                <div style={{ marginBottom: "20px", width: "100%", borderBottom: "4px solid #2c3e50", paddingBottom: "10px" }}>
                    <Image
                        src={story.image}
                        alt={story.title}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{
                            width: "100%",
                            height: "auto",
                            imageRendering: "pixelated",
                            // No border radius for harder pixel look
                        }}
                    />
                </div>
            )}

            <div style={{
                backgroundColor: "#ffeaa7", // Highlight Title Background
                padding: "5px 15px",
                border: "2px solid #2c3e50",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.1)",
                marginBottom: "15px",
                transform: "rotate(-2deg)" // Jaunty angle
            }}>
                <h3 style={{
                    fontFamily: "'VT323', monospace", // Use Pixel Font if avail, else monospace
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "#2c3e50",
                    margin: 0,
                    letterSpacing: "2px"
                }}>
                    {story.title}
                </h3>
            </div>

            <p style={{
                fontFamily: "'VT323', monospace",
                fontSize: "1.4rem", // Larger for pixel font readability
                lineHeight: "1.4",
                textAlign: "center",
                color: "#2c3e50"
            }}>
                {story.description}
            </p>
        </div>
    );
}
