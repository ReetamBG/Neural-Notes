import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const Pricing = () => {
  const features = [
    "Full access to every AI feature",
    "Bring your own API keys",
    "Self-host with just a few commands",
    "100% open source on GitHub",
  ];

  return (
    <section id="pricing" className="w-full min-h-screen flex flex-col items-center justify-center py-8 sm:py-16 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl font-bold sm:text-7xl text-primary mb-2 sm:mb-4">
            Pricing
          </h2>
          <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto">
            Simple, transparent, and refreshingly honest pricing
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-sm sm:max-w-md bg-neutral-900 border-neutral-800 hover:border-primary/50 transition-colors duration-300">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="flex justify-center mb-2 sm:mb-4">
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary border-primary/30 text-xs"
                >
                  Most Popular
                </Badge>
              </div>
              <CardTitle className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                Open Source
              </CardTitle>
              <div className="mb-2 sm:mb-4">
                <span className="text-xl sm:text-3xl font-bold text-accent-foreground">₹0</span>
                <span className="text-neutral-400 ml-2 text-sm sm:text-base">/ forever</span>
              </div>
              <CardDescription className="text-xs sm:text-base text-neutral-300">
                Host it yourself. No paywalls, no BS.
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-4 sm:pb-6">
              <ul className="space-y-2 sm:space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <span className="text-neutral-300 text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-neutral-800">
              <Button
                className="w-full bg-neutral-300 hover:bg-primary/90 text-black font-semibold"
                size="default"
                asChild
              >
                <a
                  href="https://github.com/ReetamBG/Neural-Notes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FaGithub />
                  View on GitHub
                </a>
              </Button>

              <p className="text-xs sm:text-sm text-muted-foreground text-center italic">
                I&apos;d host it for you… but broke student wallet says no. 😅
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
