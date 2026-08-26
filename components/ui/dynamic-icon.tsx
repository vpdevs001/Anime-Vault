import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import React from "react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[
      name
    ] || LucideIcons.Folder;

  return <IconComponent {...props} />;
}
