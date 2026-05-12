"use client";

import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Footer() {
  const homePageContent = useAppStore((s) => s.homePageContent);

  return (
    <footer className="mt-auto border-t bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">{homePageContent.footerBrandName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {homePageContent.footerBrandDescription}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3">{homePageContent.footerContactHeading}</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{homePageContent.footerAddressLine1}<br />{homePageContent.footerAddressLine2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{homePageContent.footerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>{homePageContent.footerEmail}</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold mb-3">{homePageContent.footerHoursHeading}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p>{homePageContent.footerHoursWeekday}</p>
                  <p>{homePageContent.footerHoursSaturday}</p>
                  <p>{homePageContent.footerHoursSunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">{homePageContent.footerLinksHeading}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink1}</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink2}</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink3}</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink4}</span></li>
              <li><span className="hover:text-primary cursor-pointer transition-colors">{homePageContent.footerLink5}</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {homePageContent.footerBrandName} Beauty Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
