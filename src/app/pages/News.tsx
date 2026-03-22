import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";

export function News() {
  const articles = [
    {
      title: "Lễ hội Hoa Xuân Sa Đéc 2026: Rực rỡ ngàn hoa khoe sắc",
      category: "Sự kiện",
      date: "15/12/2025",
      author: "Ban Biên Tập",
      image: "https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=800",
      excerpt: "Chuẩn bị chào đón Lễ hội Hoa Xuân lớn nhất trong năm, Làng Hoa Sa Đéc dự kiến đón hàng trăm ngàn lượt khách tham quan với nhiều hoạt động văn hóa đặc sắc.",
      featured: true
    },
    {
      title: "Phát triển du lịch sinh thái gắn liền với bảo tồn di sản",
      category: "Tin mới",
      date: "10/12/2025",
      author: "Nguyễn Văn A",
      image: "https://images.unsplash.com/photo-1707807562742-bf69e7feaf4e?auto=format&fit=crop&q=80&w=800",
      excerpt: "Hội thảo chuyên đề về việc kết hợp hài hòa giữa phát triển kinh tế du lịch và bảo vệ các giá trị di sản văn hóa truyền thống của vùng đất Sa Đéc.",
      featured: false
    },
    {
      title: "Khai mạc tuần lễ Ẩm thực Đồng Tháp Mười",
      category: "Sự kiện",
      date: "05/12/2025",
      author: "Trần Thị B",
      image: "https://images.unsplash.com/photo-1558722199-56eabc94fb69?auto=format&fit=crop&q=80&w=800",
      excerpt: "Tuần lễ ẩm thực giới thiệu các món ăn đặc sản của vùng đất Đồng Tháp, với sự góp mặt của hàng trăm gian hàng ẩm thực từ các huyện thị.",
      featured: false
    },
    {
      title: "Thông báo điều chỉnh luồng giao thông dịp Tết",
      category: "Thông báo",
      date: "01/12/2025",
      author: "UBND TP",
      image: "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=800",
      excerpt: "Nhằm đảm bảo an toàn giao thông và phục vụ du khách tham quan Làng Hoa tốt hơn, UBND TP Sa Đéc thông báo phương án phân luồng mới.",
      featured: false
    }
  ];

  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <div className="bg-purple-900 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Tin Tức & Sự Kiện</h1>
        <p className="text-purple-100 max-w-2xl mx-auto px-4">Cập nhật những thông tin mới nhất về các hoạt động du lịch, văn hóa và lễ hội tại Sa Đéc.</p>
      </div>

      <div className="container mx-auto px-4 mt-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-12">
          {["Tất cả", "Tin mới", "Sự kiện", "Thông báo"].map((cat, i) => (
            <button 
              key={cat}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${i === 0 ? "bg-purple-600 text-white" : "bg-white text-stone-600 border border-stone-200 hover:border-purple-300 hover:text-purple-600"}`}
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
            <div className="absolute top-6 left-6 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
              {featuredArticle.category}
            </div>
          </div>
          <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm text-stone-500 mb-4">
              <span className="flex items-center gap-1"><Calendar size={16} /> {featuredArticle.date}</span>
              <span className="flex items-center gap-1"><User size={16} /> {featuredArticle.author}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-800 mb-6 group-hover:text-purple-700 transition-colors">
              {featuredArticle.title}
            </h2>
            <p className="text-stone-600 text-lg mb-8 line-clamp-3">{featuredArticle.excerpt}</p>
            <button className="self-start bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2">
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
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-stone-600 mb-6 line-clamp-3 text-sm flex-grow">{article.excerpt}</p>
                <button className="text-purple-600 font-semibold hover:text-orange-500 transition-colors flex items-center gap-1 mt-auto">
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
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${page === 1 ? "bg-purple-600 text-white" : "bg-white text-stone-600 hover:bg-purple-100 border border-stone-200"}`}
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
