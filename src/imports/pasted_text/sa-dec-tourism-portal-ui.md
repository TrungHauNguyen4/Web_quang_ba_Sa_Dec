Design a complete, modern, responsive web application UI for a tourism and local administration portal for Sa Đéc city, Đồng Tháp, Vietnam.

IMPORTANT:
This is NOT just a landing page. It must include:

* Full Public Website UI
* Full Admin Dashboard (CMS)

---

TECH CONTEXT (VERY IMPORTANT):

* The frontend will be implemented using React.js with Next.js framework (App Router)
* Use component-based design (reusable UI components)
* Structure UI so it can map easily into:

  * pages (routes)
  * components
  * layouts
* Design with Tailwind CSS in mind (utility-first styling)
* Ensure layout is SEO-friendly (suitable for Next.js SSR/SSG)
* Use modern UI patterns suitable for scalable frontend architecture

---

GENERAL STYLE:

* Clean, modern, minimal
* Tourism + government hybrid style
* Colors:

  * Green (nature)
  * Blue (river)
  * Orange (culture)
* Rounded corners, card-based layout
* Soft shadows, clear hierarchy
* Responsive: mobile-first → tablet → desktop

---

PART 1: PUBLIC WEBSITE

Pages:

* Trang chủ
* Địa danh
* Ẩm thực
* Bản đồ
* Tin tức
* Giới thiệu
* Thư viện
* Liên hệ
* Dịch vụ hành chính

---

HOME PAGE:

* Hero banner (large image Sa Đéc)
* Title: "Khám phá Sa Đéc - Thành phố hoa Đồng Tháp"
* CTA buttons
* Sections:

  * Featured destinations (card components)
  * Cuisine highlights
  * News preview
  * Quick navigation icons

---

DESTINATIONS PAGE:

* Card grid (reusable component)
* Filters (tabs or dropdown)
* Detail page:

  * Image gallery
  * Description
  * Map section

---

CUISINE PAGE:

* Food cards
* Highlight specialties

---

MAP PAGE:

* Map layout (Google Maps placeholder)
* Marker UI

---

NEWS PAGE:

* Article list (card or list layout)
* Detail page

---

ABOUT PAGE:

* Text + icons + images

---

GALLERY PAGE:

* Image grid
* Video section

---

CONTACT PAGE:

* Form UI (input, textarea, button)
* Info + map

---

SERVICES PAGE:

* List of services
* Form submission UI
* Status tracking UI

---

PART 2: ADMIN DASHBOARD (CMS)

ROLES:

* Admin
* Editor
* Viewer

---

LAYOUT:

* Sidebar (component)
* Topbar (component)
* Main content area

---

PAGES:

1. Dashboard:

* Stats cards
* Charts (placeholder)
* Activity list

---

2. Destinations Management:

* Table UI (data table component)
* CRUD actions
* Form:

  * Title
  * Description (rich text editor placeholder)
  * Image upload
  * Category
  * Map picker

---

3. Cuisine Management:

* Same structure as destinations

---

4. News Management:

* Article list + filters
* Editor form
* Publish status toggle

---

5. Services Management:

* Service list
* Application list
* Status update UI

---

6. Media Library:

* Grid UI
* Upload component

---

7. Comments:

* Moderation table
* Approve/reject buttons

---

8. Users:

* User table
* Role assignment UI

---

9. Settings:

* Form layout for config

---

COMPONENT SYSTEM (VERY IMPORTANT):

Design reusable components that can map to React components:

* Navbar
* Footer
* Sidebar
* Card (Destination, Food, News)
* Table
* Form (Input, Select, Textarea)
* Button (primary, secondary)
* Modal
* Badge (status)
* File Upload UI

---

DESIGN OUTPUT REQUIREMENTS:

* Organize into:

  * Public pages
  * Admin pages
  * Components (design system)
* Clearly structured layout (easy to convert into Next.js project)
* Naming should reflect React components (e.g., DestinationCard, AdminSidebar)
* Maintain consistency across all pages

---

GOAL:

Create a UI design that is directly translatable into a real-world React + Next.js frontend project.
