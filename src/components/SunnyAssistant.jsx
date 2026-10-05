import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiSun, FiX, FiSend } from "react-icons/fi";
import { suggestedPrompts } from "../data/sunnyPrompts";

const WELCOME = {
  role: "assistant",
  text: "Hi, I'm Sunny. I can help you find your way around this portfolio preview. Are you exploring homes, looking for an adviser, or planning your next move?",
};

/**
 * Placeholder reply generator — swap this for a real API call
 * (e.g. `await fetch('/api/sunny', { method: 'POST', body: ... })`)
 * once a backend is connected. Keep the async signature so the
 * calling code doesn't need to change.
 */
async function getAssistantReply(userText) {
  await new Promise((resolve) =>
    setTimeout(resolve, 700 + Math.random() * 500),
  );

  const text = userText.toLowerCase();
  if (
    text.includes("worth") ||
    text.includes("value") ||
    text.includes("estimate")
  ) {
    return "For a home valuation, start a conversation in the contact section. This preview doesn't calculate live market valuations.";
  }
  if (
    text.includes("listing") ||
    text.includes("home") ||
    text.includes("propert")
  ) {
    return "Explore the New Listings section to browse homes in Single or Grid view. You can save your favorites or select Arrange a private showing to draft an inquiry.";
  }
  if (
    text.includes("agent") ||
    text.includes("realtor") ||
    text.includes("expert")
  ) {
    return "Find your adviser in the Local Knowledge section. Use the portrait cards or navigation buttons to browse, then select Let’s connect to draft your message.";
  }
  if (text.includes("quick buy") || text.includes("quickbuy")) {
    return "For advice about selling, use the contact section to tell us about your move. This is an illustrative preview, so I can’t provide a real cash offer.";
  }
  return "You can explore homes, meet our illustrative advisers, or draft a message in the contact section. This preview doesn't send messages or access live listings.";
}

function TypingBubble() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce bg-dark/40"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

export default function SunnyAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useGSAP(() => {
    if (!modalRef.current) return;
    if (open) {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      inputRef.current?.focus();
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: reduced ? 0 : 24, scale: reduced ? 1 : 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: reduced ? 0.01 : 0.4,
          ease: "power3.out",
        },
      );
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    const reply = await getAssistantReply(trimmed);
    setTyping(false);
    setMessages((m) => [...m, { role: "assistant", text: reply }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <div className="sunny-launcher fixed bottom-10 right-12 z-[70]">
        <div className="group relative">
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap bg-[#141721] px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            How can I help you today?
          </span>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={
              open ? "Close Sunny AI assistant" : "Open Sunny AI assistant"
            }
            className="flex h-14 w-14 rounded-full items-center justify-center bg-yellow text-dark shadow-xl transition-transform duration-300 hover:scale-105"
          >
            {open ? <FiX size={24} /> : <FiSun size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="false"
          aria-label="Sunny AI assistant chat"
          className="sunny-dialog fixed bottom-[104px] right-6 z-[70] flex h-[520px] w-[92vw] max-w-[380px] flex-col border border-dark/10 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-dark/10 bg-[#141721] px-5 py-4 text-white">
            <div className="flex items-center gap-2">
              <FiSun className="text-yellow" />
              <div>
                <p className="text-sm font-semibold leading-none">Sunny</p>
                <p className="text-[11px] text-white/50">
                  Your guide to this preview
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center text-white/70 hover:text-yellow"
            >
              <FiX size={18} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-5 py-5"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-dark text-white"
                    : "bg-light text-dark"
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="w-fit bg-light">
                <TypingBubble />
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-dark/10 px-5 py-4">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="border border-dark/15 px-3 py-2 text-xs text-dark/70 transition-colors hover:border-dark hover:text-dark"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-dark/10 p-4"
          >
            <label htmlFor="sunny-input" className="sr-only">
              Message Sunny
            </label>
            <input
              ref={inputRef}
              id="sunny-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sunny anything…"
              className="flex-1 border border-dark/15 px-4 py-3 text-sm focus:border-yellow focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim() || typing}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-yellow text-dark transition-opacity disabled:opacity-40"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
