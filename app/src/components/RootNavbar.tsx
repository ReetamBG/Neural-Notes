"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "./ui/button";

export default function NavbarDemo() {
  const { isLoaded, user } = useUser();

  let navItems;

  if (isLoaded && user) {
    navItems = [
      {
        name: "My Notes",
        link: "/notes",
      },
      {
        name: "Features",
        link: "#features",
      },
      {
        name: "Pricing",
        link: "#pricing",
      },
      {
        name: "Contact",
        link: "#contact",
      },
    ];
  } else {
    navItems = [
      {
        name: "Features",
        link: "#features",
      },
      {
        name: "Pricing",
        link: "#pricing",
      },
      {
        name: "Contact",
        link: "#contact",
      },
    ];
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {isLoaded && user ? (
              <>
                <div className=" grid place-content-center border-2 border-primary rounded-full p-0.5">
                  <UserButton />
                </div>
                <SignOutButton>
                  <Button className="z-10" variant="outline">
                    Sign Out
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <NavbarButton variant="primary" className="cursor-pointer">
                  Sign In
                </NavbarButton>
              </SignInButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}
