import React, { useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter, X, Mail, Github } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  const developers = [
    {
      name: "Muhamme Ajmal U K",
      email: "ajmaluk.me@gmail.com",
      github: "https://github.com/ajmaluk",
      linkedin: "https://www.linkedin.com/in/ajmaluk/",
      instagram: "https://www.instagram.com/ajmaluk.me/",
    },
    {
      name: "Suneeb S",
      email: "suneebsunilkumar12@gmail.com",
      github: "https://github.com/suneebs",
      linkedin: "https://www.linkedin.com/in/suneeb-s12/",
      instagram: "https://www.instagram.com/_think_different___",
    },
    {
      name: "Muhamed Marshad",
      email: "muhamedmarshad18@gmail.com",
      github: "http://github.com/marshadn",
      linkedin: "http://linkedin.com/in/marshadn",
      instagram: "http://instagram.com/marshxadn",
    },
    {
      name: "Yadhu Krishna",
      email: "yadhukrishnx@gmail.com",
      github: "https://github.com/yadhukrishnx",
      linkedin: "https://www.linkedin.com/in/yadhukrishnx/",
      instagram: "https://www.instagram.com/yadhukrishnx/",
    },

  ];

  return (
    <>
      <footer className="bg-muted/50 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Social links */}
            <div className="flex justify-center md:order-2 gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/CollegeOfEngineeringTrivandrum/", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/cetians_/", label: "Instagram" },
                { icon: Twitter, href: "https://x.com/cet_trivandrum", label: "Twitter" },
                { icon: Linkedin, href: "https://in.linkedin.com/school/college-of-engineering-trivandrum/", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => ( // eslint-disable-line no-unused-vars
                <a
                  key={label}
                  href={href}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                >
                  <span className="sr-only">{label}</span>
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="md:order-1">
              <p className="text-center text-xs leading-5 text-muted-foreground">
                &copy; {new Date().getFullYear()} College of Engineering Trivandrum. All rights reserved.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex justify-center md:order-2 gap-6">
              <button
                onClick={() => setShowModal(true)}
                className="text-xs leading-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Developers
              </button>
            </div>
            <p className="text-center text-xs leading-5 text-muted-foreground md:order-1">
              Designed & Developed by <span className="font-medium text-foreground/80">CET MCA Department</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Developer Contact Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-background border border-border/40 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold tracking-tight">Developer Contacts</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {developers.map((dev, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <p className="font-medium text-sm mb-2">{dev.name}</p>
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${dev.email}`}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-background text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      aria-label="Email"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-background text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      aria-label="GitHub"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-background text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={dev.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-background text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
