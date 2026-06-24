import { Code2, Briefcase, Sparkles, FolderKanban, Award } from "lucide-react";

export const skills = [
  {
    category: "Software Development",
    icon: Code2,
    items: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "NestJS", "Node.js", "Flutter", "Java"],
  },
  {
    category: "Backend & APIs",
    icon: Briefcase,
    items: ["REST APIs", "Authentication", "RBAC", "Microservices"],
  },
  {
    category: "Microsoft Stack",
    icon: Sparkles,
    items: ["Entra ID (Azure AD)", "Microsoft 365", "Power Apps", "Power Automate", "Dataverse"],
  },
  {
    category: "Database & DevOps",
    icon: FolderKanban,
    items: ["PostgreSQL", "MySQL", "Docker", "Git", "Nginx", "Linux"],
  },
  {
    category: "Systems & Infrastructure",
    icon: Award,
    items: ["Linux", "Networking", "FortiGate", "UniFi", "Cloud Services"],
  },
];