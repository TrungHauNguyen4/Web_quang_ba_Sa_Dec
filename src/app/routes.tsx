import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const Layout = lazy(async () => ({
  default: (await import("./components/Layout")).Layout,
}));

const AdminLayout = lazy(async () => ({
  default: (await import("./components/AdminLayout")).AdminLayout,
}));

const Home = lazy(async () => ({
  default: (await import("./pages/Home")).Home,
}));
const Destinations = lazy(async () => ({
  default: (await import("./pages/Destinations")).Destinations,
}));
const Cuisine = lazy(async () => ({
  default: (await import("./pages/Cuisine")).Cuisine,
}));
const MapPage = lazy(async () => ({
  default: (await import("./pages/MapPage")).MapPage,
}));
const News = lazy(async () => ({
  default: (await import("./pages/News")).News,
}));
const About = lazy(async () => ({
  default: (await import("./pages/About")).About,
}));
const Gallery = lazy(async () => ({
  default: (await import("./pages/Gallery")).Gallery,
}));
const Contact = lazy(async () => ({
  default: (await import("./pages/Contact")).Contact,
}));
const Services = lazy(async () => ({
  default: (await import("./pages/Services")).Services,
}));

const Dashboard = lazy(async () => ({
  default: (await import("./pages/admin/Dashboard")).Dashboard,
}));
const AdminDestinations = lazy(async () => ({
  default: (await import("./pages/admin/AdminDestinations")).AdminDestinations,
}));
const AdminCuisine = lazy(async () => ({
  default: (await import("./pages/admin/AdminCuisine")).AdminCuisine,
}));
const AdminNews = lazy(async () => ({
  default: (await import("./pages/admin/AdminNews")).AdminNews,
}));
const AdminServices = lazy(async () => ({
  default: (await import("./pages/admin/AdminServices")).AdminServices,
}));
const AdminMedia = lazy(async () => ({
  default: (await import("./pages/admin/AdminMedia")).AdminMedia,
}));
const AdminComments = lazy(async () => ({
  default: (await import("./pages/admin/AdminComments")).AdminComments,
}));
const AdminUsers = lazy(async () => ({
  default: (await import("./pages/admin/AdminUsers")).AdminUsers,
}));
const AdminSettings = lazy(async () => ({
  default: (await import("./pages/admin/AdminSettings")).AdminSettings,
}));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "dia-danh", Component: Destinations },
      { path: "am-thuc", Component: Cuisine },
      { path: "ban-do", Component: MapPage },
      { path: "tin-tuc", Component: News },
      { path: "gioi-thieu", Component: About },
      { path: "thu-vien", Component: Gallery },
      { path: "lien-he", Component: Contact },
      { path: "dich-vu", Component: Services },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "destinations", Component: AdminDestinations },
      { path: "cuisine", Component: AdminCuisine },
      { path: "news", Component: AdminNews },
      { path: "services", Component: AdminServices },
      { path: "media", Component: AdminMedia },
      { path: "comments", Component: AdminComments },
      { path: "users", Component: AdminUsers },
      { path: "settings", Component: AdminSettings },
    ],
  },
]);
