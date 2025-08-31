import { LinkPreviewData } from "@/models/Messages";
import { LinkIcon } from "lucide-react";

type LinkPreviewProps = {
  data: LinkPreviewData;
};

export default function LinkPreview({ data }: LinkPreviewProps) {
  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-start gap-3 rounded-lg bg-black/30 p-3 max-w-xs">
      <img src={data.image} alt={data.title} className="h-16 w-16 rounded-md object-cover" />
      <div className="flex-1 overflow-hidden">
        <p className="font-bold text-sm truncate">{data.title}</p>
        <p className="text-xs text-gray-300 line-clamp-2">{data.description}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <LinkIcon size={12} />
          {new URL(data.url).hostname}
        </p>
      </div>
    </a>
  );
}