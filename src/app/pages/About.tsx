import { motion } from "motion/react";
import { History, Globe, Users, Landmark } from "lucide-react";

export function About() {
  const sections = [
    {
      title: "Lịch sử hình thành đơn vị hành chính",
      icon: History,
      content:
        "Đơn vị hành chính địa phương được hình thành và điều chỉnh qua nhiều giai đoạn, gắn với quá trình phát triển dân cư và hạ tầng đô thị. Công tác quản lý nhà nước được kiện toàn theo hướng minh bạch và phục vụ người dân.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Vị trí địa lý và kết cấu hạ tầng",
      icon: Globe,
      content:
        "Địa bàn nằm trên trục kết nối liên phường, có hệ thống giao thông và các công trình công cộng đang được đầu tư đồng bộ. Địa phương ưu tiên hạ tầng số, cải cách hành chính và nâng cao chất lượng cung cấp dịch vụ công.",
      image: "https://images.unsplash.com/photo-1462899006636-339e08d1844e?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Dân cư và đời sống cộng đồng",
      icon: Users,
      content:
        "Cộng đồng dân cư ổn định, trình độ tiếp cận số ngày càng cao. Địa phương đẩy mạnh cơ chế một cửa, tiếp nhận ý kiến người dân và công khai kết quả xử lý để nâng cao hiệu quả phục vụ.",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="w-full bg-slate-100 min-h-screen">
      <section className="relative h-[56vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1920"
            alt="About"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/75" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-4 text-blue-300">
            <Landmark size={32} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold mb-4">
            Giới thiệu địa phương
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-200 max-w-2xl mx-auto">
            Tổng quan về tổ chức hành chính, hạ tầng và định hướng phát triển phục vụ người dân.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-24">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-14 items-center`}
              >
                <div className="w-full md:w-1/2">
                  <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square border border-slate-200">
                    <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                  <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                    <section.icon size={28} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
                  <div className="w-12 h-1 bg-blue-700 rounded-full"></div>
                  <p className="text-slate-600 leading-relaxed text-lg">{section.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">04</div>
              <div className="text-slate-300 font-medium">Bộ phận nghiệp vụ</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">20+</div>
              <div className="text-slate-300 font-medium">Thủ tục mức độ 3,4</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">24/7</div>
              <div className="text-slate-300 font-medium">Tiếp nhận online</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-300 mb-2">100%</div>
              <div className="text-slate-300 font-medium">Công khai tiến độ</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




