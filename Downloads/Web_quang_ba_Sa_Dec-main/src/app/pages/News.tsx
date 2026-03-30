import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";

export function News() {
  const articles = [
    {
      title: "Thông báo lịch tiếp nhận hồ sơ và trả kết quả tuần tới",
      category: "Thông báo",
      date: "15/12/2025",
      author: "Văn phòng UBND",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=800",
      excerpt: "Bộ phận một cửa tiếp nhận hồ sơ từ 07:30-11:30, 13:30-17:00 (Thứ 2-6); ưu tiên hồ sơ nộp trực tuyến và trả kết quả qua dịch vụ bưu chính công ích.",
      featured: true
    },
    {
      title: "Cập nhật tiến độ giải quyết hồ sơ trực tuyến tháng 12",
      category: "Báo cáo",
      date: "10/12/2025",
      author: "Phòng Một Cửa",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
      excerpt: "97% hồ sơ tiếp nhận qua dịch vụ công trực tuyến mức độ 3-4 đã được xử lý đúng hạn; các hồ sơ chờ bổ sung giấy tờ sẽ được nhắc qua SMS trong 24h.",
      featured: false
    },
    {
      title: "Triển khai tiếp nhận phản ánh hiện trường qua QR",
      category: "Sự kiện",
      date: "05/12/2025",
      author: "TT Hạ tầng số",
      image: "https://images.unsplash.com/photo-1520607162513-0ff2155c7b5f?auto=format&fit=crop&q=80&w=800",
      excerpt: "Người dân quét QR tại trụ sở hoặc trên website để gửi phản ánh, kèm hình ảnh/video; kết quả xử lý công khai trên cổng thông tin.",
      featured: false
    },
    {
      title: "Điều chỉnh luồng giao thông phục vụ lễ hội cuối năm",
      category: "Thông báo",
      date: "01/12/2025",
      author: "UBND TP",
      image: "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&q=80&w=800",
      excerpt: "Phân luồng tạm thời tại các nút giao chính, đề nghị người dân và phương tiện tuân thủ hướng dẫn để đảm bảo an toàn và tiến độ xử lý hồ sơ vận chuyển hàng hóa.",
      featured: false
    }
  ];

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-emerald-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Tin tức • Thông báo • Văn bản</h1>
        <p className="text-emerald-100 max-w-2xl mx-auto px-4">Cập nhật chỉ đạo điều hành, lịch tiếp dân, tiến độ hồ sơ và các thông báo quan trọng từ UBND.</p>
      </div>

      <div className="container mx-auto px-4 mt-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-12">
          {["Tất cả", "Thông báo", "Văn bản", "Sự kiện"].map((cat, i) => (
            <button 
              key={cat}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${i === 0 ? "bg-emerald-700 text-white" : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300 hover:text-emerald-700"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100 flex flex-col lg:flex-row group"
        >
          <div className="lg:w-3/5 h-80 lg:h-auto relative overflow-hidden">
            <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-6 left-6 bg-emerald-700 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
              {featuredArticle.category}
            </div>
          </div>
          <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
              <span className="flex items-center gap-1"><Calendar size={16} /> {featuredArticle.date}</span>
              <span className="flex items-center gap-1"><User size={16} /> {featuredArticle.author}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-6 group-hover:text-emerald-700 transition-colors">
              {featuredArticle.title}
            </h2>
            <p className="text-stone-600 text-lg mb-8 line-clamp-3">{featuredArticle.excerpt}</p>
            <button className="self-start bg-emerald-100 text-emerald-700 hover:bg-emerald-700 hover:text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2">
              Đọc tiếp <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article, i) => (
            <motion.div 
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-stone-100 hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-stone-600 mb-6 line-clamp-3 text-sm flex-grow">{article.excerpt}</p>
                <button className="text-emerald-700 font-semibold hover:text-emerald-900 transition-colors flex items-center gap-1 mt-auto">
                  Đọc tiếp <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-16 gap-2">
          {[1, 2, 3].map((page) => (
            <button 
              key={page}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${page === 1 ? "bg-emerald-700 text-white" : "bg-white text-stone-600 hover:bg-emerald-100 border border-stone-200"}`}
            >
              {page}
            </button>
          ))}
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-stone-600 hover:bg-purple-100 border border-stone-200 font-semibold transition-colors">
            ...
          </button>
        </div>
      </div>
    </div>
  );
}
