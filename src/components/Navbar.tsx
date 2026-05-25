import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Activity, Menu, X, LogIn, LogOut } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useCart } from "../context/CartContext";
import { auth, signInWithGoogle, logOut } from "../lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const location = useLocation();
  const { items } = useCart();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { name: "Manuals", path: "/guides", icon: Activity },
  ];

  return (
    <nav className="fixed md:top-0 md:left-0 md:h-screen md:w-48 w-full z-50 bg-black border-r border-artistic-border flex flex-col items-center py-8 gap-12 h-16 md:h-auto">
      <div className="flex items-center md:flex-col w-full px-4 md:px-0 justify-between md:justify-start h-full">
        <Link to="/" className="text-2xl font-bold tracking-tighter accent-text md:mb-12">
          Fix Me
        </Link>

        {/* Desktop Nav - Vertical Rotated */}
        <div className="hidden md:flex flex-col gap-12 -rotate-90 origin-center whitespace-nowrap mt-28">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "nav-link",
                location.pathname.startsWith(item.path) && "accent-text"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-artistic-muted hover:text-artistic-accent"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Footer/Version in sidebar */}
        <div className="hidden md:flex flex-col items-center gap-6 mt-auto mb-8">
          {user ? (
            <button 
              onClick={logOut}
              className="text-artistic-muted hover:text-artistic-accent transition-colors"
              title={`Sign out ${user.email}`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="text-artistic-muted hover:text-artistic-accent transition-colors"
              title="Sign in with Google"
            >
              <LogIn className="w-5 h-5" />
            </button>
          )}
          <Link
            to="/cart"
            className={cn(
              "relative transition-colors",
              location.pathname === "/cart" ? "text-artistic-accent" : "text-artistic-muted hover:text-artistic-accent"
            )}
            title={`Shopping cart (${cartCount} items)`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-artistic-accent text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="font-mono text-[10px] opacity-30 -rotate-90 origin-center">
            v2.04
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-black border-b border-artistic-border z-40 p-4">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="nav-link text-lg"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="nav-link text-lg flex items-center gap-2 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              REPAIR_KIT
              {cartCount > 0 && (
                <span className="bg-artistic-accent text-black text-[9px] font-bold rounded-full px-2">
                  {cartCount}
                </span>
              )}
            </Link>
            <div className="pt-4 border-t border-artistic-border flex flex-col gap-4">
              {user ? (
                <button 
                  onClick={() => { logOut(); setIsOpen(false); }}
                  className="nav-link text-lg text-artistic-accent flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> SIGN_OUT
                </button>
              ) : (
                <button 
                  onClick={() => { signInWithGoogle(); setIsOpen(false); }}
                  className="nav-link text-lg text-artistic-accent flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" /> SIGN_IN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}


