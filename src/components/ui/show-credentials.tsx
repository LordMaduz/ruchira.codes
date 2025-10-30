import { ExternalLink } from "lucide-react";

interface ShowCredentialsProps {
  url: string;
}

export default function ShowCredentials({ url }: ShowCredentialsProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
              inline-flex items-center gap-2
              px-5 py-3
              bg-gradient-to-r from-purple-700 to-blue-700
              text-white font-semibold text-medium
              rounded-2xl
              shadow-lg shadow-purple-900/30
              hover:shadow-purple-900/50 hover:scale-105
              transition-all duration-300
            "
    >
      View Certificate
      <ExternalLink className="w-4 h-4" />
    </a>
  );
}
