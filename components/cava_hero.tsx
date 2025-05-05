import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface SuperscriptWithTooltipProps {
  children: React.ReactNode;
  content: string;
}

const SuperscriptWithTooltip: React.FC<SuperscriptWithTooltipProps> = ({
  children,
  content,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <sup className="cursor-help">{children}</sup>
    </TooltipTrigger>
    <TooltipContent>
      <p className="text-sm">{content}</p>
    </TooltipContent>
  </Tooltip>
);

interface AuthorProps {
  children: React.ReactNode;
  href?: string;
  role?: string;
  affiliation?: string;
  isLast?: boolean;
}

const Author: React.FC<AuthorProps> = ({
  children,
  href = "#",
  role,
  affiliation = "Stanford University",
  isLast = false,
}) => {
  const authorName = typeof children === "string" ? children : null;

  return (
    <span className="whitespace-nowrap inline-flex items-center">
      {href ? (
        <Link href={href} className="hover:text-primary transition-colors">
          {authorName || children}
        </Link>
      ) : (
        <span>{authorName || children}</span>
      )}

      {role && (
        <SuperscriptWithTooltip content={`${role}, ${affiliation}`}>
          {role === "Principal Investigator"
            ? "†"
            : role === "Task Lead"
              ? "‡"
              : role === "Project Lead"
                ? "*"
                : role === "Contributor"
                  ? "§"
                  : ""}
        </SuperscriptWithTooltip>
      )}

      {!isLast && <span className="mx-1">,</span>}
    </span>
  );
};

// Adding interface for TeamMember
interface TeamMember {
  name: string;
  href: string;
  role: string;
}

// Adding interface for TeamSection props
interface TeamSectionProps {
  title: string;
  members: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ title, members }) => (
  <div className="mb-6 text-center">
    <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
    <div className="flex flex-wrap justify-center gap-x-1 gap-y-2">
      {members.map((member, index) => (
        <Author
          key={member.name}
          href={member.href}
          role={member.role}
          isLast={index === members.length - 1}
        >
          {member.name}
        </Author>
      ))}
    </div>
  </div>
);

export function Hero(): JSX.Element {
  const leaders: TeamMember[] = [
    {
      name: "Will Held",
      href: "https://williamheld.com",
      role: "Project Lead",
    },
    {
      name: "Michael J. Ryan",
      href: "https://michryan.com",
      role: "Project Lead",
    },
    {
      name: "Diyi Yang",
      href: "https://cs.stanford.edu/~diyiy/",
      role: "Principal Investigator",
    },
  ];

  const teamMembers: TeamMember[] = [
    {
      name: "Aditya Shrivastava",
      href: "https://www.aditya-shrivastava.com/",
      role: "Task Lead",
    },
    {
      name: "Ali Sartaz Khan",
      href: "https://profiles.stanford.edu/ali-sartaz-khan",
      role: "Task Lead",
    },
    {
      name: "Caleb Ziems",
      href: "https://calebziems.com/",
      role: "Contributor",
    },
    {
      name: "Minzhi Ella Li",
      href: "https://yocodeyo.github.io",
      role: "Task Lead",
    },
    {
      name: "Martijn Bartelds",
      href: "https://martijnbartelds.nl/",
      role: "Contributor",
    },
    {
      name: "Michael Sun",
      href: "https://bases.stanford.edu/about-us-michael",
      role: "Task Lead",
    },
    { name: "Tan Li", href: "https://tanli.dev/", role: "Task Lead" },
    {
      name: "Woody Gan",
      href: "https://realai.usc.edu/pages/curve.html#:~:text=for%20social%20good.-,Woody%20Gan,-Woody%20Gan%20is",
      role: "Task Lead",
    },
  ];

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto">
        {/* Logo and Title */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 text-primary font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-center p-4 mt-8 mb-6">
          {/* For medium screens and larger - horizontal layout (original) */}
          <div className="hidden md:block">
            <img
              src="/CAVA-logo.svg"
              alt="CAVA Logo"
              style={{ width: "min(20vh, 500px)" }}
            />
          </div>

          {/* For small screens - images in the same row */}
          <div className="flex md:hidden flex-row justify-center gap-4 w-full">
            <img
              src="/CAVA-logo.svg"
              alt="CAVA Logo"
              style={{ height: "min(15vh, 200px)" }}
              className="object-contain"
            />
            <img
              src="/SALT-logo.svg"
              style={{ height: "min(15vh, 200px)" }}
              alt="SALT Logo"
              className="object-contain"
            />
          </div>

          <span className="text-center md:flex-grow">
            Comprehensive Assessment for Voice Assistants
          </span>

          {/* For medium screens and larger - horizontal layout (original) */}
          <div
            className="hidden md:block"
            style={{
              width: "min(30vh, 500px)",
              marginLeft: "-5vh",
              marginRight: "-5vh",
            }}
          >
            <img src="/SALT-logo.svg" alt="SALT Logo" />
          </div>
        </div>

        {/* Team Information */}
        <div>
          <TeamSection title="Leads" members={leaders} />
          <TeamSection title="Team Members" members={teamMembers} />
          {/* Legend */}
          <div className="text-sm mt-6 text-center">
            <span className="inline-flex items-center mr-4">
              <SuperscriptWithTooltip content="Stanford University">
                †
              </SuperscriptWithTooltip>
              <span className="ml-1">Principal Investigator</span>
            </span>
            <span className="inline-flex items-center mr-4">
              <SuperscriptWithTooltip content="Project Lead">
                *
              </SuperscriptWithTooltip>
              <span className="ml-1">Project Lead</span>
            </span>
            <span className="inline-flex items-center mr-4">
              <SuperscriptWithTooltip content="Task Lead">
                ‡
              </SuperscriptWithTooltip>
              <span className="ml-1">Task Lead</span>
            </span>
            <span className="inline-flex items-center">
              <SuperscriptWithTooltip content="Contributor">
                §
              </SuperscriptWithTooltip>
              <span className="ml-1">Contributor</span>
            </span>
          </div>
          {/* GitHub Link */}
          <div className="mt-6 text-center">
            <a
              href="https://github.com/SALT-NLP/CAVA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary border border-primary hover:bg-primary/10 px-4 py-2 rounded-md font-medium transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              Data & Code
            </a>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
