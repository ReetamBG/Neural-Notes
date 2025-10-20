import React from 'react'
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'

const socialLinks = [
  {
    href: "https://linkedin.com/in/reetam-borgohain",
    label: "LinkedIn",
    icon: FaLinkedin,
  },
  {
    href: "https://github.com/ReetamBG",
    label: "GitHub",
    icon: FaGithub,
  },
  {
    href: "mailto:reetambg@gmail.com",
    label: "Email",
    icon: FaEnvelope,
  },
];

const Contact = () => {
  return (
    <section id="contact" className="w-full h-auto bg-neutral-950 py-20">
      <div className="mx-auto max-w-7xl px-8">
        <h2 className="text-3xl font-bold sm:text-6xl text-primary text-center mb-8">
          Get in Touch
        </h2>
        
        <p className="text-lg sm:text-xl text-foreground/80 text-center px-4">
          You can reach out through any of the socials below
        </p>

        {/* Social Icons */}
        <div className="mt-8 flex justify-center gap-6 sm:gap-8">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:scale-110 transition-transform text-foreground hover:text-primary"
            >
              <Icon className="w-8 h-8" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact