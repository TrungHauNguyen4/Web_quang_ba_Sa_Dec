import { motion } from "motion/react";
import { MapPin, Camera, Info } from "lucide-react";

interface DestinationCardProps {
  title: string;
  category: string;
  image: string;
  description: string;
  index?: number;
}

export function DestinationCard({ title, category, image, description, index = 0 }: DestinationCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 flex flex-col h-full"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-green-700 shadow-sm flex items-center gap-1.5">
          <MapPin size={14} />
          {category}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <div className="flex gap-3">
            <button className="p-2 bg-white/20 hover:bg-white text-white hover:text-stone-800 rounded-full backdrop-blur-md transition-colors">
              <Camera size={20} />
            </button>
            <button className="p-2 bg-white/20 hover:bg-white text-white hover:text-stone-800 rounded-full backdrop-blur-md transition-colors">
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-green-700 transition-colors">
          {title}
        </h3>
        <p className="text-stone-600 line-clamp-3 mb-6 flex-1">
          {description}
        </p>
        <button className="w-full py-3 rounded-xl bg-green-50 text-green-700 font-semibold group-hover:bg-green-600 group-hover:text-white transition-colors mt-auto">
          Xem chi tiết
        </button>
      </div>
    </motion.div>
  );
}
