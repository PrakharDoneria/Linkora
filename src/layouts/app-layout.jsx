
// import { Outlet } from "react-router-dom";
// import Header from "../components/header"; 

// const AppLayout = () => {
//   return (
//     <div>
//        <Header />
//       <main className = "min-h-screen container">
        
//         {/*Header */}
//         <Outlet/>
//         {/*body */}
//       </main>

// <div className="p-10 text-center bg-gray-800 mt-10">
//   © {new Date().getFullYear()} Linkora — Built with ❤️ by Rimjhim Verma
// </div>

//       {/*footer */}
//     </div>
//   )
// }

// export default AppLayout;


import { Outlet } from "react-router-dom";
import Header from "../components/header";

const AppLayout = () => {
  return (
    <div className="app-shell min-h-screen flex flex-col">

      <Header />

      <main className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Linkora <span className="mx-2 text-slate-700">•</span> Shorten. Share. Track.
      </footer>

    </div>
  );
};

export default AppLayout;
