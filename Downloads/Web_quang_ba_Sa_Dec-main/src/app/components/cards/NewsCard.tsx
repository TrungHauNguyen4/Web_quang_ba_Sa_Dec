import { motion } from "motion/react";
import { ArrowRight, Clock, User } from "lucide-react";

interface NewsCardProps {
  title: string;
  category: string;
  date: string;
  image: string;
  description: string;
  index?: number;
}

export function NewsCard({ title, category, date, image, description, index = 0 }: NewsCardProps) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100 group flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-700 uppercase tracking-wider">
          {category}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-xs font-medium text-stone-500 mb-3">
          <span className="flex items-center gap-1.5"><Clock size={14} /> {date}</span>
          <span className="flex items-center gap-1.5"><User size={14} /> Ban Biên Tập</span>
        </div>
        <h3 className="text-xl font-bold text-stone-800 mb-3 leading-snug group-hover:text-purple-700 transition-colors">
          {title}
        </h3>
        <p className="text-stone-600 line-clamp-3 mb-6 flex-1 text-sm">
          {description}
        </p>
        <button className="flex items-center gap-2 text-purple-600 font-bold hover:text-purple-800 transition-colors mt-auto group/btn w-fit">
          Đọc tiếp 
          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.article>
  );
}
