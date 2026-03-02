import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Info — Jan Hellwich",
  description: "About Jan Hellwich — director, art director, and filmmaker.",
};

export default function InfoPage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10 animate-fade-in">
      {/* Navigation */}
      <nav className="flex justify-between items-start mb-24 md:mb-32">
        <Link
          href="/"
          className="text-[11px] tracking-[0.15em] uppercase text-fg hover:opacity-60 transition-opacity duration-300"
        >
          Work
        </Link>
        <span className="text-[11px] tracking-[0.15em] uppercase text-fg">
          Info
        </span>
      </nav>

      {/* Bio */}
      <div className="max-w-2xl">
        <div className="flex flex-col gap-6 text-[clamp(0.9rem,1.4vw,1.05rem)] leading-[1.7] text-fg/85 uppercase tracking-[0.01em]">
          <p>
            As a son of a photographer, Jan grew up with a passion for the arts.
            After studying film in Cologne, Germany, he quickly rose to the role
            of lead art director at the esteemed production company BWGTBLD GmbH.
            Seeking to further refine his distinct visual style, he continued
            honing his craft at the prestigious Filmakademie, Germany.
          </p>
          <p>
            As creative assistant to the illustrious Gordon von Steiner, Jan
            collaborates closely with von Steiner on projects for iconic brands
            like Chanel, Calvin Klein, Louis Vuitton, and musician Troye Sivan.
          </p>
          <p>
            Drawn to strong visual narratives, Jan&apos;s work explores culturally
            significant themes. Recently, he has contributed to high-profile
            projects with Dua Lipa for Chanel, as well as a cinematic exploration
            of Turkish oil wrestling, bringing his distinctive aesthetic to each.
            The latter winning Gold at the 2025 Young Director Award in Cannes.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-16 md:mt-24 flex flex-col gap-2">
          <a
            href="mailto:janlucahellwich@gmail.com"
            className="text-[11px] tracking-[0.15em] uppercase text-fg hover:opacity-60 transition-opacity duration-300"
          >
            janlucahellwich@gmail.com
          </a>
          <a
            href="tel:+4917680826844"
            className="text-[11px] tracking-[0.15em] uppercase text-fg hover:opacity-60 transition-opacity duration-300"
          >
            +49 176 808 268 44
          </a>
        </div>
      </div>
    </main>
  );
}
