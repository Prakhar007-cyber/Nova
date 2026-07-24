"use client";

import { Logo } from "@/components/ui/Logo";
import { XIcon, GithubIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/BrandIcons";

const cols = [
  { title: "Product", links: ["Overview", "Features", "Automations", "Integrations", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Blog", "Press", "Contact"] },
  { title: "Resources", links: ["Docs", "Guides", "API", "Community", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
];

const socials = [
  { icon: XIcon, label: "X" },
  { icon: GithubIcon, label: "GitHub" },
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: YoutubeIcon, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-mist-100/8 px-6 pb-10 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-mist-400">
              The intelligent workspace for turning ideas into action.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  data-cursor="hover"
                  className="grid h-9 w-9 place-items-center rounded-full border border-mist-100/10 text-mist-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-iris-400/40 hover:text-mist-100"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-[13px] font-medium text-mist-100">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      data-cursor="hover"
                      className="group inline-flex text-[13px] text-mist-400 transition-colors hover:text-mist-100"
                    >
                      <span className="relative">
                        {l}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-iris-400 transition-all duration-300 group-hover:w-full" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-mist-100/8 pt-8 text-[13px] text-mist-500 sm:flex-row">
          <p>© {new Date().getFullYear()} NOVA Labs, Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
            All systems operational
          </p>
        </div>
      </div>

      {/* oversized wordmark watermark */}
      <div className="pointer-events-none mt-10 select-none overflow-hidden">
        <div className="mask-fade-b text-center text-[clamp(4rem,22vw,18rem)] font-semibold leading-none tracking-tighter text-mist-100/[0.03]">
          NOVA
        </div>
      </div>
    </footer>
  );
}
