
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Typography from "../shared/Typography";

interface FocusAreaImageCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
}

const FocusAreaImageCard = ({
  image,
  title,
  description,
  link,
}: FocusAreaImageCardProps) => (
  <div className="flex flex-col group cursor-pointer">
    <Link to={link} className="relative block overflow-hidden rounded-xl aspect-[4/3] mb-6 transition-shadow shadow-xl hover:shadow-2xl">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Optional overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
    </Link>
    <Typography variant="h3" className="font-bold text-neutral-dark mb-2 text-xl">
      {title}
    </Typography>
    <Typography variant="body" className="mb-4 text-neutral-gray">
      {description}
    </Typography>
    <Link
      to={link}
      className="inline-flex items-center text-secondary-orange font-extrabold text-lg tracking-wide hover:underline group"
    >
      READ MORE
      <ArrowRight className="ml-2 h-5 w-5" />
    </Link>
  </div>
);

export default FocusAreaImageCard;

