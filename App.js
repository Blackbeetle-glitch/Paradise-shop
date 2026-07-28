import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingBag, Briefcase, Backpack, Headphones, Speaker, Watch,
  BatteryCharging, Flower2, Lamp, Layers, Glasses, Mail, Check,
  ChevronLeft, ChevronRight, ShoppingCart, User, LogOut, Plus,
  Minus, Trash2, ArrowRight, Package, Truck, CheckCircle2, X,
  Sparkles, Inbox as InboxIcon
} from "lucide-react";

// ---------- Design tokens ----------
const T = {
  ink: "#14231C",
  inkSoft: "#516358",
  paper: "#FFFFFF",
  surface: "#F7F5EF",
  surface2: "#F0EDE3",
  jungle: "#1F4D3A",
  jungleDark: "#123527",
  gold: "#C9A227",
  lagoon: "#3E7CB1",
  coral: "#E2725B",
  border: "#E6E1D3",
};

const display = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'IBM Plex Mono', monospace" };
const body = { fontFamily: "'Inter', sans-serif" };

const horizonGradient = `linear-gradient(90deg, ${T.jungle} 0%, ${T.gold} 50%, ${T.lagoon} 100%)`;

// ---------- EmailJS (real email delivery) ----------
const EMAILJS_SERVICE_ID = "service_gctvpzp";
const EMAILJS_TEMPLATE_ID = "template_6dgruwf";
const EMAILJS_PUBLIC_KEY = "R_Ea85TqqInsIA9bk";

// ---------- Product data ----------
const PRODUCTS = [
  { id: 1, name: "Voyager Weekender", category: "Bags", price: 189, icon: Briefcase, from: T.jungle, to: T.jungleDark, blurb: "Full-grain canvas, room for three days away.", desc: "The Voyager Weekender is built from waxed canvas and vegetable-tanned leather trim, sized for a long weekend and reinforced for years of gate changes." },
  { id: 2, name: "Horizon Tote", category: "Bags", price: 129, icon: ShoppingBag, from: T.gold, to: "#8A6E17", blurb: "Structured tote for the daily carry.", desc: "A structured tote in brushed cotton twill with a magnetic close and an interior laptop sleeve — built for the commute and the market run alike." },
  { id: 3, name: "Lagoon Crossbody", category: "Bags", price: 89, icon: ShoppingBag, from: T.lagoon, to: "#274F68", blurb: "Featherweight, hands-free, all day.", desc: "A minimal crossbody in water-resistant ripstop, cut close to the body with an adjustable strap for hands-free days." },
  { id: 4, name: "Drift Backpack", category: "Bags", price: 149, icon: Backpack, from: T.coral, to: "#A64B36", blurb: "A pack that keeps up with the day.", desc: "Padded straps, a dedicated 14-inch laptop pocket, and a roll-top closure that expands when the day runs long." },
  { id: 5, name: "Aurora Earbuds", category: "Electronics", price: 179, icon: Headphones, from: T.jungle, to: T.lagoon, blurb: "Wireless, with active noise cancelling.", desc: "Aurora pairs adaptive noise cancelling with a 30-hour case battery, tuned for both morning commutes and quiet focus." },
  { id: 6, name: "Tidal Speaker", category: "Electronics", price: 99, icon: Speaker, from: T.lagoon, to: T.jungle, blurb: "Room-filling sound, pocket-sized.", desc: "A rugged, water-resistant speaker with a 12-hour battery — small enough for a bag, loud enough for a beach." },
  { id: 7, name: "Palm Smartwatch", category: "Electronics", price: 249, icon: Watch, from: T.gold, to: T.coral, blurb: "Track everything, wear it anywhere.", desc: "Health tracking, notifications, and a battery that lasts five days, in a case built to survive salt water and sand." },
  { id: 8, name: "Nomad Power Bank", category: "Electronics", price: 59, icon: BatteryCharging, from: T.inkSoft, to: T.ink, blurb: "20,000mAh, fits in one hand.", desc: "Two-way fast charging in a body small enough for a pocket, with enough capacity for a phone and a laptop in a pinch." },
  { id: 9, name: "Reef Headphones", category: "Electronics", price: 299, icon: Headphones, from: T.jungleDark, to: T.gold, blurb: "Studio-tuned, noise-cancelling.", desc: "Over-ear comfort with studio-grade drivers and industry-leading noise cancelling for flights, offices, and everything between." },
  { id: 10, name: "Dune Vase", category: "Home", price: 69, icon: Flower2, from: T.gold, to: T.surface2, blurb: "Hand-thrown stoneware, sand glaze.", desc: "Each Dune vase is hand-thrown in stoneware and finished in a sand-toned glaze, so no two pieces are quite alike." },
  { id: 11, name: "Cove Table Lamp", category: "Home", price: 119, icon: Lamp, from: T.lagoon, to: T.gold, blurb: "Warm light, sculpted base.", desc: "A sculpted ceramic base pairs with a linen shade for warm, even light — dimmable, and built to anchor a reading corner." },
  { id: 12, name: "Meadow Throw", category: "Home", price: 79, icon: Layers, from: T.jungle, to: T.gold, blurb: "Woven cotton, made for the couch.", desc: "Woven from brushed cotton in a soft check, generously sized to share and machine-washable for real life." },
  { id: 13, name: "Sundial Watch", category: "Accessories", price: 219, icon: Watch, from: T.gold, to: T.jungleDark, blurb: "Sapphire crystal, a face built to last.", desc: "A sapphire crystal face over a stainless case, water-resistant to 100m, with an interchangeable leather strap." },
  { id: 14, name: "Isle Sunglasses", category: "Accessories", price: 99, icon: Glasses, from: T.lagoon, to: T.coral, blurb: "Polarized, hand-finished acetate.", desc: "Hand-finished Italian acetate frames with polarized lenses, cut for a wide range of face shapes." },
];

const CATEGORIES = ["All", "Bags", "Electronics", "Home", "Accessories"];
const PAGE_SIZE = 6;

// ---------- Small building blocks ----------
function HorizonRule({ height = 3 }) {
  return <div style={{ height, background: horizonGradient, width: "100%" }} />;
}

function Logo({ size = 22 }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: size, height: size, borderRadius: "9999px",
          background: horizonGradient,
        }}
      />
      <span style={{ ...display, color: T.ink, fontSize: size * 0.95, fontWeight: 600, letterSpacing: "-0.01em" }}>
        Paradise
      </span>
    </div>
  );
}

function PrimaryButton({ children, onClick, style, ...props }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: T.jungle, color: T.paper, ...body,
        padding: "12px 22px", borderRadius: 999, fontSize: 14,
        fontWeight: 600, border: "none", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 8,
        transition: "background 0.2s ease, transform 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = T.jungleDark)}
      onMouseLeave={(e) => (e.currentTarget.style.background = style?.background || T.jungle)}
      {...props}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, style, ...props }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent", color: T.ink, ...body,
        padding: "11px 20px", borderRadius: 999, fontSize: 14,
        fontWeight: 600, border: `1.5px solid ${T.border}`, cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 8,
        transition: "border-color 0.2s ease, background 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.jungle)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
      {...props}
    >
      {children}
    </button>
  );
}

function ProductCard({ product, onOpen, index }) {
  const Icon = product.icon;
  return (
    <button
      onClick={() => onOpen(product)}
      style={{
        textAlign: "left", background: T.paper, border: `1px solid ${T.border}`,
        borderRadius: 18, overflow: "hidden", cursor: "pointer", padding: 0,
        animation: `fadeUp 0.5s ease both`, animationDelay: `${index * 60}ms`,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(20,35,28,0.10)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div
        style={{
          height: 168, background: `linear-gradient(135deg, ${product.from}, ${product.to})`,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}
      >
        <Icon color="#fff" size={46} strokeWidth={1.4} />
        <div style={{ position: "absolute", bottom: 10, left: 14, ...mono, fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
          {product.category}
        </div>
      </div>
      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ ...display, fontSize: 18, color: T.ink, fontWeight: 600 }}>{product.name}</div>
        <div style={{ ...body, fontSize: 13, color: T.inkSoft, marginTop: 4, lineHeight: 1.4 }}>{product.blurb}</div>
        <div style={{ ...mono, fontSize: 15, color: T.jungle, marginTop: 12, fontWeight: 600 }}>${product.price}</div>
      </div>
    </button>
  );
}

// ---------- Main App ----------
export default function ParadiseShop() {
  const [view, setView] = useState("intro"); // intro | login | shop | product | cart | checkout | confirmation | inbox
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ name: "", email: "" });
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]); // {id, qty}
  const [shipping, setShipping] = useState({ address: "", city: "", zip: "", country: "" });
  const [emails, setEmails] = useState([]);
  const [openEmail, setOpenEmail] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const shipTimer = useRef(null);

  useEffect(() => () => { if (shipTimer.current) clearTimeout(shipTimer.current); }, []);

  // Load the EmailJS SDK once and initialize it with the public key
  useEffect(() => {
    if (window.emailjs) { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.async = true;
    script.onload = () => window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    document.body.appendChild(script);
  }, []);

  // Fires the real order-confirmation email through EmailJS
  function sendRealConfirmationEmail(order) {
    if (!window.emailjs) { setToast("Mail service still loading — order saved to Paradise Mail"); return; }
    const templateParams = {
      email: user?.email,
      order_id: order.orderNumber,
      cost: {
        shipping: "0.00",
        tax: "0.00",
        total: order.total.toFixed(2),
      },
      orders: order.items.map((c) => ({
        name: c.product.name,
        units: c.qty,
        price: c.product.price.toFixed(2),
      })),
    };
    window.emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => setToast(`Confirmation email sent to ${user?.email}`))
      .catch((err) => {
        console.error("EmailJS error:", err);
        setToast("Real email failed to send — saved to Paradise Mail instead");
      });
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cartItems = cart.map((c) => ({ ...c, product: PRODUCTS.find((p) => p.id === c.id) }));
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cartItems.reduce((s, c) => s + c.product.price * c.qty, 0);
  const unread = emails.filter((e) => !e.read).length;

  function addToCart(product, quantity) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) return prev.map((c) => (c.id === product.id ? { ...c, qty: c.qty + quantity } : c));
      return [...prev, { id: product.id, qty: quantity }];
    });
    setToast(`Added ${product.name} to your bag`);
  }

  function updateQty(id, delta) {
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c)).filter((c) => c.qty > 0));
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  function placeOrder() {
    const orderNumber = "PDX-" + Math.floor(100000 + Math.random() * 900000);
    const items = cartItems.map((c) => `${c.product.name} × ${c.qty}`).join(", ");
    const order = { orderNumber, items: cartItems, total: cartTotal, address: shipping };
    setLastOrder(order);
    sendRealConfirmationEmail(order);

    const confirmEmail = {
      id: Date.now(),
      subject: "You've successfully purchased your order",
      preview: `Order ${orderNumber} confirmed — ${items}`,
      body: `Hi ${user?.name || "there"},\n\nYou've successfully purchased ${items} for $${cartTotal.toFixed(2)}.\n\nOrder number: ${orderNumber}\nShipping to: ${shipping.address}, ${shipping.city} ${shipping.zip}, ${shipping.country}\n\nWe'll email you again as soon as it ships.\n\n— Paradise`,
      icon: "check",
      time: "Just now",
      read: false,
    };
    setEmails((prev) => [confirmEmail, ...prev]);
    setCart([]);
    setView("confirmation");

    shipTimer.current = setTimeout(() => {
      const shipEmail = {
        id: Date.now() + 1,
        subject: "Your order is currently being shipped",
        preview: `${orderNumber} is on its way to ${shipping.city || "you"}`,
        body: `Hi ${user?.name || "there"},\n\nGood news — order ${orderNumber} is currently being shipped and is on its way to:\n\n${shipping.address}, ${shipping.city} ${shipping.zip}, ${shipping.country}\n\nThanks for shopping Paradise.\n\n— Paradise`,
        icon: "truck",
        time: "Just now",
        read: false,
      };
      setEmails((prev) => [shipEmail, ...prev]);
      setToast("New mail: your order is being shipped");
    }, 6000);
  }

  // ---------- Shared shell ----------
  const fonts = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes drift { 0% { transform: rotateY(-8deg) rotateX(2deg); } 50% { transform: rotateY(8deg) rotateX(-2deg); } 100% { transform: rotateY(-8deg) rotateX(2deg); } }
      @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
      * { box-sizing: border-box; }
      body { margin: 0; }
    `}</style>
  );

  const Toast = toast && (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: T.ink, color: T.paper, padding: "12px 20px", borderRadius: 999,
      ...body, fontSize: 13.5, zIndex: 100, display: "flex", alignItems: "center", gap: 8,
      animation: "fadeUp 0.3s ease both", boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
    }}>
      <Sparkles size={14} color={T.gold} /> {toast}
    </div>
  );

  const NavBar = view !== "intro" && view !== "login" && (
    <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => { setView("shop"); setSelected(null); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Logo />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <NavIcon onClick={() => setView("inbox")} active={view === "inbox"} badge={unread}>
            <InboxIcon size={19} />
          </NavIcon>
          <NavIcon onClick={() => setView("cart")} active={view === "cart"} badge={cartCount}>
            <ShoppingCart size={19} />
          </NavIcon>
          <div style={{ width: 1, height: 22, background: T.border, margin: "0 6px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, ...body, fontSize: 13.5, color: T.inkSoft }}>
            <User size={16} /> {user?.name?.split(" ")[0] || "Guest"}
          </div>
          <button
            onClick={() => { setUser(null); setView("intro"); setCart([]); setEmails([]); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: T.inkSoft, padding: 6 }}
            title="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
      <HorizonRule height={2} />
    </div>
  );

  function NavIcon({ children, onClick, active, badge }) {
    return (
      <button
        onClick={onClick}
        style={{
          position: "relative", background: active ? T.surface : "transparent", border: "none",
          borderRadius: 10, padding: 9, cursor: "pointer", color: T.ink, display: "flex",
        }}
      >
        {children}
        {badge > 0 && (
          <span style={{
            position: "absolute", top: -3, right: -3, background: T.coral, color: "#fff",
            fontSize: 10, fontWeight: 700, borderRadius: 999, minWidth: 16, height: 16,
            display: "flex", alignItems: "center", justifyContent: "center", ...mono,
          }}>{badge}</span>
        )}
      </button>
    );
  }

  // ---------- INTRO ----------
  if (view === "intro") {
    return (
      <div style={{ ...body, background: T.paper, minHeight: "100vh", color: T.ink }}>
        {fonts}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px 0" }}>
          <Logo size={24} />
        </div>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px 40px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ ...mono, fontSize: 12, letterSpacing: "0.08em", color: T.jungle, textTransform: "uppercase", marginBottom: 18 }}>
              Bags · Electronics · Home · Accessories
            </div>
            <h1 style={{ ...display, fontSize: "clamp(40px, 6vw, 68px)", lineHeight: 1.02, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>
              Everything you need,<br />all in one <span style={{ fontStyle: "italic", color: T.jungle }}>Paradise</span>.
            </h1>
            <p style={{ ...body, fontSize: 17, color: T.inkSoft, marginTop: 22, maxWidth: 440, lineHeight: 1.6 }}>
              A small, well-kept island of good things — carry-worthy bags, considered electronics,
              and pieces for a home you actually want to be in.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 34 }}>
              <PrimaryButton onClick={() => setView("login")}>
                Enter Paradise <ArrowRight size={16} />
              </PrimaryButton>
            </div>
            <div style={{ marginTop: 42 }}><HorizonRule /></div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", perspective: 900 }}>
            <div
              style={{
                width: 300, height: 300, borderRadius: 28,
                background: `linear-gradient(135deg, ${T.jungle}, ${T.gold} 55%, ${T.lagoon})`,
                backgroundSize: "220% 220%",
                animation: "drift 7s ease-in-out infinite, shimmer 9s ease infinite",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 40px 80px rgba(31,77,58,0.28)",
              }}
            >
              <ShoppingBag color="#fff" size={92} strokeWidth={1.1} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {["Bags", "Electronics", "Home", "Accessories"].map((c, i) => {
            const sample = PRODUCTS.find((p) => p.category === c);
            const Icon = sample.icon;
            return (
              <div key={c} style={{ animation: "fadeUp 0.6s ease both", animationDelay: `${i * 100}ms`, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 18px", background: T.surface }}>
                <Icon size={22} color={T.jungle} strokeWidth={1.5} />
                <div style={{ ...display, fontSize: 17, marginTop: 10 }}>{c}</div>
                <div style={{ ...body, fontSize: 12.5, color: T.inkSoft, marginTop: 2 }}>{PRODUCTS.filter((p) => p.category === c).length} pieces</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%", padding: "11px 13px", borderRadius: 10, border: `1.5px solid ${T.border}`,
    marginTop: 6, marginBottom: 16, ...body, fontSize: 14, color: T.ink, outline: "none",
  };

  // ---------- LOGIN ----------
  if (view === "login") {
    return (
      <div style={{ ...body, background: T.surface, minHeight: "100vh", color: T.ink, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        {fonts}
        <div style={{ width: 400, background: T.paper, border: `1px solid ${T.border}`, borderRadius: 22, padding: "36px 32px", boxShadow: "0 30px 60px rgba(20,35,28,0.08)" }}>
          <Logo size={22} />
          <h2 style={{ ...display, fontSize: 26, marginTop: 22, marginBottom: 4 }}>Welcome in.</h2>
          <p style={{ ...body, fontSize: 13.5, color: T.inkSoft, marginBottom: 24 }}>Sign in to shop and get order updates by mail.</p>

          <label style={{ ...mono, fontSize: 11, color: T.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</label>
          <input
            value={loginForm.name}
            onChange={(e) => setLoginForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jordan Rivera"
            style={inputStyle}
          />
          <label style={{ ...mono, fontSize: 11, color: T.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
          <input
            value={loginForm.email}
            onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="jordan@example.com"
            style={inputStyle}
          />
          <PrimaryButton
            style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            onClick={() => {
              if (!loginForm.name.trim() || !loginForm.email.trim()) { setToast("Enter your name and email to continue"); return; }
              setUser(loginForm);
              setView("shop");
            }}
          >
            Continue <ArrowRight size={16} />
          </PrimaryButton>
          <p style={{ ...body, fontSize: 11.5, color: T.inkSoft, marginTop: 14, textAlign: "center" }}>
            This is a demo sign-in — no password needed.
          </p>
        </div>
        {Toast}
      </div>
    );
  }

  // ---------- SHOP ----------
  if (view === "shop") {
    return (
      <div style={{ ...body, background: T.paper, minHeight: "100vh", color: T.ink }}>
        {fonts}
        {NavBar}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 24px 80px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h1 style={{ ...display, fontSize: 30, margin: 0 }}>Shop {category !== "All" ? category : "everything"}</h1>
            <div style={{ ...mono, fontSize: 12, color: T.inkSoft }}>{filtered.length} items</div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                style={{
                  padding: "9px 16px", borderRadius: 999, border: `1.5px solid ${category === c ? T.jungle : T.border}`,
                  background: category === c ? T.jungle : "transparent", color: category === c ? "#fff" : T.ink,
                  ...body, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 28 }}>
            {pageItems.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={(prod) => { setSelected(prod); setQty(1); setView("product"); }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 44 }}>
            <GhostButton onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ opacity: page === 1 ? 0.4 : 1, pointerEvents: page === 1 ? "none" : "auto" }}>
              <ChevronLeft size={16} /> Previous
            </GhostButton>
            <div style={{ ...mono, fontSize: 12.5, color: T.inkSoft }}>Page {page} of {totalPages}</div>
            <GhostButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={{ opacity: page === totalPages ? 0.4 : 1, pointerEvents: page === totalPages ? "none" : "auto" }}>
              Next <ChevronRight size={16} />
            </GhostButton>
          </div>
        </div>
        {Toast}
      </div>
    );
  }

  // ---------- PRODUCT ----------
  if (view === "product" && selected) {
    const Icon = selected.icon;
    return (
      <div style={{ ...body, background: T.paper, minHeight: "100vh", color: T.ink }}>
        {fonts}
        {NavBar}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 24px 80px" }}>
          <GhostButton onClick={() => setView("shop")} style={{ marginBottom: 26 }}><ChevronLeft size={15} /> Back to shop</GhostButton>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div style={{
              height: 380, borderRadius: 24, background: `linear-gradient(135deg, ${selected.from}, ${selected.to})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "drift 8s ease-in-out infinite", transformStyle: "preserve-3d",
            }}>
              <Icon color="#fff" size={100} strokeWidth={1.1} />
            </div>
            <div>
              <div style={{ ...mono, fontSize: 12, color: T.jungle, textTransform: "uppercase", letterSpacing: "0.06em" }}>{selected.category}</div>
              <h1 style={{ ...display, fontSize: 34, margin: "8px 0 6px" }}>{selected.name}</h1>
              <div style={{ ...mono, fontSize: 22, color: T.ink, fontWeight: 600, marginBottom: 18 }}>${selected.price}</div>
              <p style={{ ...body, fontSize: 15, color: T.inkSoft, lineHeight: 1.7 }}>{selected.desc}</p>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26 }}>
                <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${T.border}`, borderRadius: 999 }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ border: "none", background: "none", padding: "8px 12px", cursor: "pointer" }}><Minus size={14} /></button>
                  <span style={{ ...mono, fontSize: 14, minWidth: 20, textAlign: "center" }}>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} style={{ border: "none", background: "none", padding: "8px 12px", cursor: "pointer" }}><Plus size={14} /></button>
                </div>
                <GhostButton onClick={() => addToCart(selected, qty)}>Add to bag</GhostButton>
                <PrimaryButton onClick={() => { addToCart(selected, qty); setView("cart"); }}>Buy now <ArrowRight size={16} /></PrimaryButton>
              </div>
            </div>
          </div>
        </div>
        {Toast}
      </div>
    );
  }

  // ---------- CART ----------
  if (view === "cart") {
    return (
      <div style={{ ...body, background: T.paper, minHeight: "100vh", color: T.ink }}>
        {fonts}
        {NavBar}
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 24px 80px" }}>
          <h1 style={{ ...display, fontSize: 30, marginBottom: 24 }}>Your bag</h1>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: T.inkSoft }}>
              <ShoppingCart size={30} style={{ marginBottom: 12 }} />
              <div style={{ ...body, fontSize: 14 }}>Your bag is empty.</div>
              <GhostButton style={{ marginTop: 18 }} onClick={() => setView("shop")}>Browse the shop</GhostButton>
            </div>
          ) : (
            <>
              {cartItems.map((c) => {
                const Icon = c.product.icon;
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ width: 64, height: 64, borderRadius: 14, background: `linear-gradient(135deg, ${c.product.from}, ${c.product.to})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon color="#fff" size={26} strokeWidth={1.3} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...display, fontSize: 17 }}>{c.product.name}</div>
                      <div style={{ ...mono, fontSize: 13, color: T.inkSoft, marginTop: 2 }}>${c.product.price} each</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${T.border}`, borderRadius: 999 }}>
                      <button onClick={() => updateQty(c.id, -1)} style={{ border: "none", background: "none", padding: "6px 10px", cursor: "pointer" }}><Minus size={13} /></button>
                      <span style={{ ...mono, fontSize: 13, minWidth: 18, textAlign: "center" }}>{c.qty}</span>
                      <button onClick={() => updateQty(c.id, 1)} style={{ border: "none", background: "none", padding: "6px 10px", cursor: "pointer" }}><Plus size={13} /></button>
                    </div>
                    <div style={{ ...mono, fontSize: 15, width: 70, textAlign: "right" }}>${(c.product.price * c.qty).toFixed(0)}</div>
                    <button onClick={() => removeFromCart(c.id)} style={{ border: "none", background: "none", cursor: "pointer", color: T.coral, padding: 6 }}><Trash2 size={16} /></button>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "24px 0 6px", ...display, fontSize: 20 }}>
                <span>Total</span><span>${cartTotal.toFixed(2)}</span>
              </div>
              <PrimaryButton style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={() => setView("checkout")}>
                Checkout <ArrowRight size={16} />
              </PrimaryButton>
            </>
          )}
        </div>
        {Toast}
      </div>
    );
  }

  // ---------- CHECKOUT ----------
  if (view === "checkout") {
    const ready = shipping.address.trim() && shipping.city.trim() && shipping.zip.trim() && shipping.country.trim();
    return (
      <div style={{ ...body, background: T.paper, minHeight: "100vh", color: T.ink }}>
        {fonts}
        {NavBar}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 80px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40 }}>
          <div>
            <h1 style={{ ...display, fontSize: 28, marginBottom: 20 }}>Shipping details</h1>
            {[
              ["address", "Street address"],
              ["city", "City"],
              ["zip", "ZIP / Postal code"],
              ["country", "Country"],
            ].map(([key, label]) => (
              <div key={key}>
                <label style={{ ...mono, fontSize: 11, color: T.inkSoft, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                <input
                  value={shipping[key]}
                  onChange={(e) => setShipping((s) => ({ ...s, [key]: e.target.value }))}
                  style={inputStyle}
                  placeholder={label}
                />
              </div>
            ))}
            <div style={{ ...body, fontSize: 12.5, color: T.inkSoft, marginTop: 4 }}>
              Order and shipping updates will be sent to <strong>{user?.email}</strong>.
            </div>
          </div>
          <div style={{ background: T.surface, borderRadius: 18, padding: 24, height: "fit-content" }}>
            <div style={{ ...display, fontSize: 18, marginBottom: 14 }}>Order summary</div>
            {cartItems.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 8, ...body, color: T.inkSoft }}>
                <span>{c.product.name} × {c.qty}</span><span>${(c.product.price * c.qty).toFixed(0)}</span>
              </div>
            ))}
            <div style={{ height: 1, background: T.border, margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", ...display, fontSize: 18 }}>
              <span>Total</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <PrimaryButton
              style={{ width: "100%", justifyContent: "center", marginTop: 18, opacity: ready ? 1 : 0.5, pointerEvents: ready ? "auto" : "none" }}
              onClick={placeOrder}
            >
              Place order <Check size={16} />
            </PrimaryButton>
          </div>
        </div>
        {Toast}
      </div>
    );
  }

  // ---------- CONFIRMATION ----------
  if (view === "confirmation" && lastOrder) {
    return (
      <div style={{ ...body, background: T.paper, minHeight: "100vh", color: T.ink }}>
        {fonts}
        {NavBar}
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px 90px", textAlign: "center" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: T.jungle, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", animation: "fadeUp 0.5s ease both" }}>
            <CheckCircle2 color="#fff" size={34} />
          </div>
          <h1 style={{ ...display, fontSize: 28, marginBottom: 8 }}>You've successfully purchased this order.</h1>
          <p style={{ ...body, fontSize: 14.5, color: T.inkSoft }}>Order <strong style={mono}>{lastOrder.orderNumber}</strong> is confirmed — a receipt just landed in your Paradise mail.</p>

          <div style={{ background: T.surface, borderRadius: 16, padding: 20, marginTop: 26, textAlign: "left" }}>
            {lastOrder.items.map((c) => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6, ...body, color: T.inkSoft }}>
                <span>{c.product.name} × {c.qty}</span><span>${(c.product.price * c.qty).toFixed(0)}</span>
              </div>
            ))}
            <div style={{ height: 1, background: T.border, margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", ...display, fontSize: 16 }}>
              <span>Total paid</span><span>${lastOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ ...body, fontSize: 12.5, color: T.inkSoft, marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Truck size={14} /> A "your order is being shipped" email will arrive shortly.
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
            <GhostButton onClick={() => setView("inbox")}><Mail size={15} /> Open mail</GhostButton>
            <PrimaryButton onClick={() => setView("shop")}>Keep shopping <ArrowRight size={16} /></PrimaryButton>
          </div>
        </div>
        {Toast}
      </div>
    );
  }

  // ---------- INBOX ----------
  if (view === "inbox") {
    return (
      <div style={{ ...body, background: T.paper, minHeight: "100vh", color: T.ink }}>
        {fonts}
        {NavBar}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 24px 80px" }}>
          <h1 style={{ ...display, fontSize: 28, marginBottom: 4 }}>Paradise Mail</h1>
          <p style={{ ...body, fontSize: 13, color: T.inkSoft, marginBottom: 24 }}>Simulated inbox for {user?.email} — order and shipping updates land here.</p>

          {emails.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: T.inkSoft }}>
              <Mail size={28} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 14 }}>No mail yet — place an order and you'll see it here.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {emails.map((e) => (
                <div key={e.id} style={{ animation: "slideIn 0.35s ease both" }}>
                  <button
                    onClick={() => { setOpenEmail(openEmail === e.id ? null : e.id); setEmails((prev) => prev.map((m) => (m.id === e.id ? { ...m, read: true } : m))); }}
                    style={{
                      width: "100%", textAlign: "left", background: e.read ? T.paper : T.surface,
                      border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: e.icon === "truck" ? T.lagoon : T.jungle, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {e.icon === "truck" ? <Truck color="#fff" size={17} /> : <Package color="#fff" size={17} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ ...body, fontSize: 14, fontWeight: e.read ? 500 : 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.subject}</div>
                        <div style={{ ...mono, fontSize: 11, color: T.inkSoft, flexShrink: 0 }}>{e.time}</div>
                      </div>
                      <div style={{ ...body, fontSize: 12.5, color: T.inkSoft, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.preview}</div>
                    </div>
                    {!e.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.coral, flexShrink: 0 }} />}
                  </button>
                  {openEmail === e.id && (
                    <div style={{ border: `1px solid ${T.border}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "16px 18px", ...body, fontSize: 13.5, color: T.ink, whiteSpace: "pre-line", lineHeight: 1.6, background: T.paper }}>
                      {e.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {Toast}
      </div>
    );
  }

  return null;
}