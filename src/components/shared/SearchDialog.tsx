
import { useState, useEffect, useMemo } from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Zap,
  BookOpen,
  Users,
  Target,
  FileText,
  ArrowRight,
  Command as CommandIcon,
  X,
  LayoutGrid,
  Heart,
  Globe,
  Scale
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Redesigned Search Component - CLEAN, FAST, INTUITIVE
export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Data Fetching
  const programsQuery = useQuery(api.programs.get, {});
  const newsQuery = useQuery(api.news.get, {});
  const storiesQuery = useQuery(api.stories.get, {});
  const paralegalsQuery = useQuery(api.paralegals.listApprovedParalegals, {});

  // Safe Data Fallbacks
  const programs = Array.isArray(programsQuery) ? programsQuery : [];
  const news = Array.isArray(newsQuery) ? newsQuery : [];
  const stories = Array.isArray(storiesQuery) ? storiesQuery : [];
  const paralegals = Array.isArray(paralegalsQuery) ? paralegalsQuery : [];

  // Comprehensive Static Navigation Index
  // This ensures "Resources", "Strategies", "Focus Areas" are all searchable
  const navigationItems = [
    // Main Pages
    { title: "Home", href: "/", group: "Pages", icon: <LayoutGrid className="mr-2 h-4 w-4" /> },
    { title: "About Us", href: "/about", group: "Pages", icon: <Users className="mr-2 h-4 w-4" /> },
    { title: "Our Approaches", href: "/approaches", group: "Pages", icon: <Target className="mr-2 h-4 w-4" /> },
    { title: "Strategic Focuses", href: "/strategic-focuses", group: "Pages", icon: <Target className="mr-2 h-4 w-4" /> },
    { title: "Contact Us", href: "/contact", group: "Pages", icon: <User className="mr-2 h-4 w-4" /> },
    { title: "Donate", href: "/donate", group: "Pages", icon: <Heart className="mr-2 h-4 w-4 text-red-500" /> },

    // Resources Section
    { title: "Resources Center", href: "/resources", group: "Resources", icon: <BookOpen className="mr-2 h-4 w-4" /> },
    { title: "Climate Justice Resources", href: "/resources/climate-justice", group: "Resources", icon: <Globe className="mr-2 h-4 w-4" /> },
    { title: "Gender Justice Resources", href: "/resources/gender-justice", group: "Resources", icon: <Users className="mr-2 h-4 w-4" /> },
    { title: "Legal Empowerment Resources", href: "/resources/legal-empowerment", group: "Resources", icon: <Scale className="mr-2 h-4 w-4" /> },
    { title: "News & Updates", href: "/news", group: "Resources", icon: <FileText className="mr-2 h-4 w-4" /> },
    { title: "Publications", href: "/publications", group: "Resources", icon: <FileText className="mr-2 h-4 w-4" /> },

    // What We Do (Strategies)
    { title: "Grant Making", href: "/what-we-do/grant-making", group: "Strategies", icon: <Target className="mr-2 h-4 w-4" /> },
    { title: "Direct Implementation", href: "/what-we-do/direct-implementation", group: "Strategies", icon: <Target className="mr-2 h-4 w-4" /> },
    { title: "Advocacy & Policy", href: "/what-we-do/advocacy-policy", group: "Strategies", icon: <Target className="mr-2 h-4 w-4" /> },
    { title: "Capacity Building", href: "/what-we-do/capacity-building", group: "Strategies", icon: <Target className="mr-2 h-4 w-4" /> },
    { title: "Learning & Research", href: "/what-we-do/learning-research", group: "Strategies", icon: <Target className="mr-2 h-4 w-4" /> },

    // Focus Areas
    { title: "Accessible Legal Aid", href: "/focus-areas/accessible-legal-aid", group: "Focus Areas", icon: <Scale className="mr-2 h-4 w-4" /> },
    { title: "Empowered Communities", href: "/focus-areas/empowered-communities", group: "Focus Areas", icon: <Users className="mr-2 h-4 w-4" /> },
    { title: "Conducive Environment", href: "/focus-areas/conducive-environment", group: "Focus Areas", icon: <Globe className="mr-2 h-4 w-4" /> },
    { title: "Institutional Development", href: "/focus-areas/institutional-development", group: "Focus Areas", icon: <Settings className="mr-2 h-4 w-4" /> },
  ];

  // Toggle Logic
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handlers
  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10 bg-transparent text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="max-h-[500px] overflow-y-auto custom-scrollbar">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* --- FLAGSHIP PROGRAMS (Top Priority) --- */}
          <CommandGroup heading="Flagship Programs">
            <CommandItem onSelect={() => runCommand(() => navigate("/programs/sauti-ya-mwanamke"))}>
              <Target className="mr-2 h-4 w-4 text-primary" />
              <span>Sauti ya Mwanamke</span>
              <CommandShortcut>Gold</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/programs/wanawake-tunaweza"))}>
              <Target className="mr-2 h-4 w-4 text-primary" />
              <span>Wanawake Tunaweza</span>
              <CommandShortcut>Gold</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          {/* --- PAGES & NAVIGATION --- */}
          <CommandGroup heading="Pages">
            {navigationItems.filter(i => i.group === 'Pages').map((item, idx) => (
              <CommandItem key={idx} onSelect={() => runCommand(() => navigate(item.href))}>
                {item.icon}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Resources">
            {navigationItems.filter(i => i.group === 'Resources').map((item, idx) => (
              <CommandItem key={idx} onSelect={() => runCommand(() => navigate(item.href))}>
                {item.icon}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Strategies & Focus Areas">
            {navigationItems.filter(i => ['Strategies', 'Focus Areas'].includes(i.group)).map((item, idx) => (
              <CommandItem key={idx} onSelect={() => runCommand(() => navigate(item.href))}>
                {item.icon}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* --- IMPACT STORIES --- */}
          <CommandGroup heading="Impact Stories">
            {stories.slice(0, 3).map((story: any) => (
              <CommandItem key={story._id} onSelect={() => runCommand(() => navigate(`/stories/${story._id}`))}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>{story.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          {/* --- LAST NEWS --- */}
          <CommandGroup heading="Latest News">
            {news.slice(0, 3).map((item: any) => (
              <CommandItem key={item._id} onSelect={() => runCommand(() => navigate(`/news/${item.slug || item._id}`))}>
                <FileText className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

        </CommandList>

        {/* Footer Hint */}
        <div className="border-t p-2 text-xs text-muted-foreground text-center bg-gray-50 flex items-center justify-center gap-2">
          <span className="opacity-50">Search everything on LSF</span>
        </div>
      </CommandDialog>
    </>
  );
}
