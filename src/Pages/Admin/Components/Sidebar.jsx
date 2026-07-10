import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();


  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="p-4 border-b border-blue-700">
        { }
        <span className="text-2xl font-bold hidden lg:block text-center">
          {user ? capitalize(user.role) : "Guest"}
        </span>
      </div>
      <nav className="p-4 space-y-2">

        { }
        {user?.permission?.includes("dashboard.page") && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🏠</span>
            <span className="menu-text hidden lg:inline">Dashboard</span>
          </NavLink>
        )}

        { }
        {user?.permission?.includes("mahasiswa.page") && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🎓</span>
            <span className="menu-text hidden lg:inline">Mahasiswa</span>
          </NavLink>
        )}
        {user?.permission?.includes("rencana-studi.page") && (
          <NavLink
            to="/admin/rencana-studi"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-blue-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <span className="text-lg">📚</span>
            <span className="menu-text hidden lg:inline font-medium">Rencana Studi</span>
          </NavLink>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;