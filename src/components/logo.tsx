import { cn } from "../lib/utils";

// ─── Option 1: Two Connected Workflow Nodes ───────────────────────────────

export const Logo = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      className={cn("text-foreground h-6 w-full", className)}
      viewBox="0 0 797 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="110"
        r="30"
        stroke={uniColor ? "currentColor" : "url(#paint_triggerly)"}
        strokeWidth="14"
      />
      <circle
        cx="50"
        cy="110"
        r="12"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly)"}
      />
      <line
        x1="80"
        y1="110"
        x2="106"
        y2="110"
        stroke={uniColor ? "currentColor" : "url(#paint_triggerly)"}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <polygon
        points="106,96 116,110 106,124"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly)"}
      />
      <path
        d="M 150 74 L 186 110 L 150 146 L 114 110 Z"
        stroke={uniColor ? "currentColor" : "url(#paint_triggerly)"}
        strokeWidth="14"
        strokeLinejoin="round"
      />
      <text
        x="200"
        y="148"
        fontFamily="Geist, sans-serif"
        fontSize="80"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-1.5"
      >
        Triggerly
      </text>
      <defs>
        <linearGradient
          id="paint_triggerly"
          x1="20"
          y1="0"
          x2="180"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoIcon = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      className={cn("size-6", className)}
      viewBox="0 0 180 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="110"
        r="30"
        stroke={uniColor ? "currentColor" : "url(#paint_triggerly)"}
        strokeWidth="14"
      />
      <circle
        cx="50"
        cy="110"
        r="12"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly)"}
      />
      <line
        x1="80"
        y1="110"
        x2="106"
        y2="110"
        stroke={uniColor ? "currentColor" : "url(#paint_triggerly)"}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <polygon
        points="106,96 116,110 106,124"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly)"}
      />
      <path
        d="M 150 74 L 186 110 L 150 146 L 114 110 Z"
        stroke={uniColor ? "currentColor" : "url(#paint_triggerly)"}
        strokeWidth="14"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint_triggerly"
          x1="20"
          y1="0"
          x2="180"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ─── Option 2: Interlocking T Mark ────────────────────────────────────────

export const LogoAlt1 = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      className={cn("text-foreground h-6 w-full", className)}
      viewBox="0 0 797 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="38"
        y="55"
        width="104"
        height="30"
        rx="15"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly_alt1)"}
      />
      <rect
        x="76"
        y="78"
        width="28"
        height="96"
        rx="14"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly_alt1)"}
      />
      <circle
        cx="90"
        cy="176"
        r="10"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly_alt1)"}
      />
      <text
        x="200"
        y="148"
        fontFamily="Geist, sans-serif"
        fontSize="80"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-1.5"
      >
        Triggerly
      </text>
      <defs>
        <linearGradient
          id="paint_triggerly_alt1"
          x1="20"
          y1="0"
          x2="180"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoIconAlt1 = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      className={cn("size-6", className)}
      viewBox="0 0 180 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="38"
        y="55"
        width="104"
        height="30"
        rx="15"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly_alt1)"}
      />
      <rect
        x="76"
        y="78"
        width="28"
        height="96"
        rx="14"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly_alt1)"}
      />
      <circle
        cx="90"
        cy="176"
        r="10"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly_alt1)"}
      />
      <defs>
        <linearGradient
          id="paint_triggerly_alt1"
          x1="20"
          y1="0"
          x2="180"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ─── Option 3: Lightning Bolt in a Node ───────────────────────────────────

export const LogoAlt2 = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      className={cn("text-foreground h-6 w-full", className)}
      viewBox="0 0 797 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="90"
        cy="110"
        r="60"
        stroke={uniColor ? "currentColor" : "url(#paint_triggerly_alt2)"}
        strokeWidth="9"
      />
      <path
        d="M 102 52 L 68 108 L 94 108 L 76 168 L 112 112 L 86 112 Z"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly_alt2)"}
        strokeLinejoin="round"
      />
      <text
        x="200"
        y="148"
        fontFamily="Geist, sans-serif"
        fontSize="80"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-1.5"
      >
        Triggerly
      </text>
      <defs>
        <linearGradient
          id="paint_triggerly_alt2"
          x1="20"
          y1="0"
          x2="180"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LogoIconAlt2 = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <svg
      className={cn("size-6", className)}
      viewBox="0 0 180 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="90"
        cy="110"
        r="60"
        stroke={uniColor ? "currentColor" : "url(#paint_triggerly_alt2)"}
        strokeWidth="9"
      />
      <path
        d="M 102 52 L 68 108 L 94 108 L 76 168 L 112 112 L 86 112 Z"
        fill={uniColor ? "currentColor" : "url(#paint_triggerly_alt2)"}
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint_triggerly_alt2"
          x1="20"
          y1="0"
          x2="180"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B99FE" />
          <stop offset="1" stopColor="#2BC8B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};
