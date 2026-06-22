type ProjectAvatarProps = {
  color1?: string
  color2?: string
  color3?: string
  color4?: string
}

export const ProjectAvatar = ({
  color1 = "#C7D2FE",
  color2 = "#4F46E5",
  color3 = "#818CF8",
  color4 = "#312E81",
}: ProjectAvatarProps) => (
  <svg viewBox="0 0 18 18" className="size-full">
    <rect x="0" y="0" width="9" height="9" fill={color1} />
    <rect x="9" y="0" width="9" height="9" fill={color2} />
    <rect x="0" y="9" width="9" height="9" fill={color3} />
    <rect x="9" y="9" width="9" height="9" fill={color4} />
  </svg>
)
