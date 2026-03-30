import { motion } from "motion/react";
import { Star, MapPin } from "lucide-react";

interface FoodCardProps {
  title: string;
  category: string;
  image: string;
  description: string;
  rating?: number;
  index?: number;
}

export function FoodCard({ title, category, image, description, rating = 5, index = 0 }: FoodCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group"
    >
      <div className="relative h-60 overflow-hidden p-4">
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
              {category}
            </span>
            <div className="flex text-yellow-400 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-2">
        <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
        <p className="text-stone-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-orange-100 text-orange-600 font-semibold hover:bg-orange-50 transition-colors">
          <MapPin size={18} /> Tìm quán ngon
        </button>
      </div>
    </motion.div>
  );
}
