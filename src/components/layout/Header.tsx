import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <div className="border-border fixed top-0 z-10 flex w-full items-center justify-between border-b bg-white p-4">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-medium">{title}</h1>
      <div className="w-10" /> {/* Spacer for centering */}
    </div>
  );
}
