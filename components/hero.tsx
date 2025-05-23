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

const SuperscriptWithTooltip = ({
  children,
  content,
}: SuperscriptWithTooltipProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <sup>{children}</sup>
    </TooltipTrigger>
    <TooltipContent>
      <p className="text-sm">{content}</p>
    </TooltipContent>
  </Tooltip>
);

interface AuthorProps {
  children: React.ReactNode;
}

const Author: React.FC<AuthorProps> = ({ children }) => (
  <span className="whitespace-nowrap inline-block">{children}</span>
);

const AuthorList = () => {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="text-foreground text-center text-lg p-4 flex flex-wrap justify-center gap-x-1">
          <Author>
            <Link href="https://yocodeyo.github.io">Ella Minzhi Li</Link>
            <SuperscriptWithTooltip content="Equal Contribution, Stanford University">
              * †
            </SuperscriptWithTooltip>
            ,
          </Author>
          <Author>
            <Link href="https://williamheld.com">Will Held</Link>
            <SuperscriptWithTooltip content="Equal Contribution, Stanford University">
              * †
            </SuperscriptWithTooltip>
            ,
          </Author>
          <Author>
            <Link href="https://michryan.com">Michael J. Ryan</Link>
            <SuperscriptWithTooltip content="Stanford University">
              †
            </SuperscriptWithTooltip>
            ,
          </Author>
          <Author>
            <Link href="https://th.linkedin.com/in/kunat-pipatanakul-37772a12b">
              Kunat Pipatanakul
            </Link>
            <SuperscriptWithTooltip content="SCB 10X">^</SuperscriptWithTooltip>
            ,
          </Author>
          <Author>
            <Link href="https://potsawee.github.io">Potsawee Manakul</Link>
            <SuperscriptWithTooltip content="SCB 10X">^</SuperscriptWithTooltip>
            ,
          </Author>
          <Author>
            <Link href="https://zhuhao.me">Hao Zhu</Link>
            <SuperscriptWithTooltip content="Stanford University">
              †
            </SuperscriptWithTooltip>
            ,
          </Author>
          <Author>
            <Link href="https://cs.stanford.edu/~diyiy/">Diyi Yang</Link>
            <SuperscriptWithTooltip content="Stanford University">
              †
            </SuperscriptWithTooltip>
          </Author>
        </div>
        <div className="text-foreground text-center p-4">
          <SuperscriptWithTooltip content="Stanford University">
            †
          </SuperscriptWithTooltip>
          Stanford University,
          <SuperscriptWithTooltip content="SCB 10X">^</SuperscriptWithTooltip>
          SCB 10X,
          <SuperscriptWithTooltip content="Equal Contribution">
            *
          </SuperscriptWithTooltip>
          Equal Contribution
        </div>
      </div>
    </TooltipProvider>
  );
};

export function Hero() {
  return (
    <>
      <div className="text-primary font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-center p-4 mt-8 flex items-center justify-center space-x-4">
        <img src="/talkarena-logo.svg" alt="Logo" className="w-24 h-24" />
        Interactive Evaluation of Large Audio Models
      </div>
      <AuthorList />
    </>
  );
}
