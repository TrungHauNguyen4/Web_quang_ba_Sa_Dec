import { motion } from "motion/react";
import { History, Globe, Users, Heart } from "lucide-react";

export function About() {
  const sections = [
    {
      title: "Lịch sử hình thành",
      icon: History,
      content: "Sa Đéc là một đô thị cổ với lịch sử hình thành và phát triển hơn 300 năm. Từ thế kỷ 18, Sa Đéc đã là một trung tâm thương mại sầm uất của vùng đồng bằng sông Cửu Long, được mệnh danh là 'Thành phố mang dáng dấp của Sài Gòn thu nhỏ'. Sự kết hợp hài hòa giữa văn hóa Việt, Hoa và Khmer đã tạo nên nét đặc trưng độc đáo cho vùng đất này.",
      image: "https://images.unsplash.com/photo-1724935451945-1f1967520d32?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Đặc điểm địa lý",
      icon: Globe,
      content: "Nằm ở vị trí trung tâm phía nam của tỉnh Đồng Tháp, được bao bọc bởi sông Tiền và sông Sa Đéc. Nhờ được thiên nhiên ưu đãi, đất đai trù phú và nguồn nước ngọt dồi dào quanh năm, Sa Đéc có điều kiện vô cùng thuận lợi để phát triển nông nghiệp, đặc biệt là nghề trồng hoa kiểng nổi tiếng.",
      image: "https://images.unsplash.com/photo-1543411789-1a67a2ac05c6?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Văn hóa & Con người",
      icon: Users,
      content: "Người dân Sa Đéc nổi tiếng với bản tính hiền hòa, hiếu khách, cần cù và tinh tế trong nghệ thuật trồng hoa. Đặc biệt, nếp sống văn hóa sông nước vẫn được gìn giữ và phát huy qua các thế hệ. Các lễ hội truyền thống, nghề thủ công và nghệ thuật ẩm thực phản ánh sự phong phú trong đời sống tinh thần của người dân địa phương.",
      image: "https://images.unsplash.com/photo-1707807562742-bf69e7feaf4e?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="w-full bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1708448341128-60d0b6cdbf12?auto=format&fit=crop&q=80&w=1920" 
            alt="About Sa Dec" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900/70" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4 text-orange-400"
          >
            <Heart size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Về Sa Đéc
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-green-100 max-w-2xl mx-auto"
          >
            Tìm hiểu về lịch sử, văn hóa và vẻ đẹp thiên nhiên của Thành phố Hoa.
          </motion.p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-24">
            {sections.map((section, index) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square">
                    <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl"></div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <section.icon size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-stone-800">{section.title}</h2>
                  <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
                  <p className="text-stone-600 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-green-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-green-800">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">300+</div>
              <div className="text-green-100 font-medium">Năm Lịch Sử</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">600+</div>
              <div className="text-green-100 font-medium">Ha Trồng Hoa</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">2000+</div>
              <div className="text-green-100 font-medium">Loài Hoa Kiểng</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">3</div>
              <div className="text-green-100 font-medium">Di Tích Quốc Gia</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
