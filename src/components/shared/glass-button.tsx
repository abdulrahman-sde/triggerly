"use client"

import React from "react"
import { ProjectAvatar } from "@/components/shared/avatar-project"
import { cn } from "@/lib/utils"

interface GlassButtonProps {
  children: React.ReactNode
  href?: string
  iconType?: "arrow" | "avatar" | "none"
  avatarColors?: string[]
  onClick?: () => void
  className?: string
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  href = "#",
  iconType = "arrow",
  avatarColors = ["#C7D2FE", "#4F46E5", "#818CF8", "#312E81"],
  onClick,
  className = "",
}) => {
  const buttonStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    textShadow: "rgba(128, 128, 128, 0.15) 0px 0px 4px",
    lineHeight: 1.2,
    borderStyle: "solid",
    borderWidth: "1.5px",
    borderRadius: "10px",
    padding: "12px 24px",
    backgroundColor: "var(--primary)",
    borderColor: "color-mix(in oklch, var(--primary) 62%, transparent)",
    color: "var(--primary-foreground)",
    boxShadow:
      "inset 0 0 5px 2px rgba(255,255,255,0.25), 0 4px 15px rgba(0,0,0,0.12)",
    transition:
      "background-color 0.3s ease, border-color 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease",
    willChange: "transform, box-shadow, background-color",
    userSelect: "none",
    overflow: "hidden",
    position: "relative",
  }

  const hoverAndActiveStyles = `
    .glass-react-btn:hover {
      transform: translateY(-1px);
      background-color: color-mix(in oklch, var(--primary) 90%, white) !important;
      border-color: color-mix(in oklch, var(--primary) 80%, transparent) !important;
      box-shadow: inset 0 -3px 8px 2px rgba(255,255,255,0.25), 0 6px 20px rgba(0,0,0,0.18) !important;
    }
    .glass-react-btn:active {
      transform: scale(0.96) translateY(0);
      box-shadow: inset 0 0 4px 1.5px rgba(255,255,255,0.25), 0 2px 8px rgba(0,0,0,0.08) !important;
    }

    .glass-react-btn .react-btn-icon {
      width: 0;
      height: 18px;
      opacity: 0;
      transform: translateX(-6px) scale(0.85);
      margin-left: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: width 0.3s ease, opacity 0.3s ease, transform 0.3s ease, margin-left 0.3s ease;
      fill: none;
    }
    .glass-react-btn:hover .react-btn-icon {
      width: 18px;
      opacity: 1;
      transform: translateX(0) scale(1);
      margin-left: 8px;
    }
    .glass-react-btn .react-btn-icon path {
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .glass-react-btn .react-btn-avatar {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
    .glass-react-btn:hover .react-btn-avatar {
      transform: rotate(30deg) scale(1.1);
    }
  `

  const Tag = href ? "a" : "button"

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: hoverAndActiveStyles }} />
      <Tag
        href={href}
        onClick={onClick}
        style={buttonStyle}
        className={cn("glass-react-btn", className)}
      >
        <span>{children}</span>
        {iconType === "arrow" && (
          <svg className="react-btn-icon" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
        {iconType === "avatar" && (
          <span className="react-btn-avatar">
            <ProjectAvatar
              color1={avatarColors[0]}
              color2={avatarColors[1]}
              color3={avatarColors[2]}
              color4={avatarColors[3]}
            />
          </span>
        )}
      </Tag>
    </>
  )
}
