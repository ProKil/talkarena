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
              : role === "Project Coordinator"
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
      role: "Project Coordinator",
    },
    {
      name: "Michael Ryan",
      href: "https://michryan.com",
      role: "Project Coordinator",
    },
    {
      name: "Diyi Yang",
      href: "https://cs.stanford.edu/~diyiy/",
      role: "Principal Investigator",
    },
  ];

  const teamMembers: TeamMember[] = [
    { name: "Aditya Shrivastava", href: "#", role: "Task Lead" },
    { name: "Ali Sartaz Khan", href: "#", role: "Task Lead" },
    { name: "Caleb Ziems", href: "#", role: "Contributor" },
    { name: "Ella Li", href: "https://yocodeyo.github.io", role: "Task Lead" },
    { name: "Martijn Bartelds", href: "#", role: "Contributor" },
    { name: "Michael Sun", href: "#", role: "Task Lead" },
    { name: "Tan Li", href: "#", role: "Task Lead" },
    { name: "Woody Gan", href: "#", role: "Task Lead" },
  ];

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto">
        {/* Logo and Title */}
        <div className="text-primary font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-center p-4 mt-8 mb-6 flex items-center justify-center gap-4">
          <img
            src="/CAVA-logo.svg"
            alt="CAVA Logo"
            className="w-16 sm:w-20 lg:w-24 h-auto"
          />
          <span>Comprehensive Assessment for Voice Assistants</span>
        </div>

        {/* Team Information */}
        <div>
          <TeamSection title="Leads" members={leaders} />
          <TeamSection title="Team Members" members={teamMembers} />

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

          {/* Legend */}
          <div className="text-sm mt-6 text-center">
            <span className="inline-flex items-center mr-4">
              <SuperscriptWithTooltip content="Stanford University">
                †
              </SuperscriptWithTooltip>
              <span className="ml-1">Principal Investigator</span>
            </span>
            <span className="inline-flex items-center mr-4">
              <SuperscriptWithTooltip content="Project Coordinator">
                *
              </SuperscriptWithTooltip>
              <span className="ml-1">Project Coordinator</span>
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
        </div>
      </div>
    </TooltipProvider>
  );
}
