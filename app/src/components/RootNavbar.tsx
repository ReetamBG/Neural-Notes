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
  useUser,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { syncClerkUserToDB } from "@/actions/user.actions";
import Link from "next/link";

export default function NavbarDemo() {
  const { isLoaded, user } = useUser();
  
  useEffect(() => {
    syncClerkUserToDB();
  }, [isLoaded, user]);

  let navItems;

  if (isLoaded && user) {
    navItems = [
      {
        name: "My Notes",
        link: "/dashboard",
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
            {/* <ThemeToggle /> */}
            {isLoaded && user ? (
              <>
                <div className=" grid place-content-center border-2 border-primary rounded-full p-0.5">
                  <Avatar>
                    <AvatarImage
                      src={user.imageUrl}
                      alt="avatar"
                    />
                    <AvatarFallback>{user.firstName?.charAt(1)}{user.lastName?.charAt(1)}</AvatarFallback>
                  </Avatar>
                </div>
                <SignOutButton>
                  <Button className="z-10" variant="outline">
                    Sign Out
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal" forceRedirectUrl={"/dashboard"}>
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
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              {isLoaded && user ? (
                <>
                  <div className="flex items-center gap-3 p-2">
                    <div className="grid place-content-center border-2 border-primary rounded-full p-0.5">
                      <Avatar>
                        <AvatarImage
                          src={user.imageUrl}
                          alt="avatar"
                        />
                        <AvatarFallback>{user.firstName?.charAt(1)}{user.lastName?.charAt(1)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                      <span className="text-xs text-neutral-500">{user.primaryEmailAddress?.emailAddress}</span>
                    </div>
                  </div>
                  <SignOutButton>
                    <Button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      variant="outline"
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl={"/dashboard"}>
                  <NavbarButton
                    variant="primary"
                    className="w-full cursor-pointer"
                  >
                    Sign In
                  </NavbarButton>
                </SignInButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}
