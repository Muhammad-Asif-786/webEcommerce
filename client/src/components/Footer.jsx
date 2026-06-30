import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-900 text-gray-300 py-3 px-6 hidden md:flex items-center justify-between">
      {/* Left: Copyright */}
      <p className="text-sm">
        © {new Date().getFullYear()} MyStore — All Rights Reserved.
      </p>

      {/* Center: Empty Space */}
      <div></div>

      {/* Right: Social Icons */}
      <div className="flex items-center gap-4">
        <a
          href="https://www.facebook.com/mystore"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition"
        >
          <Facebook size={20} />
        </a>

        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-500 transition"
        >
          <MessageCircle size={20} />
        </a>

        <a
          href="https://www.instagram.com/mystore"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition"
        >
          <Instagram size={20} />
        </a>
      </div>
    </footer>
  );
}


// import { Facebook, Instagram, MessageCircle } from "lucide-react";

// export default function Footer() {
//   return (
//     <footer className="fixed bottom-0 w-full bg-gray-900 text-gray-300 py-3 px-6 flex items-center justify-between hidden md:flex">
//       {/* Left: Copyright */}
//       <p className="text-sm">© {new Date().getFullYear()} MyStore — All Rights Reserved.</p>

//       {/* Center: Empty Space */}
//       <div></div>

//       {/* Right: Social Icons */}
//       <div className="flex items-center gap-4 ">
//         <a
//           href="https://www.facebook.com/mystore"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-blue-500 transition"
//         >
//           <Facebook  size={20} />
//         </a>

//         <a
//           href="https://wa.me/1234567890"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-green-500 transition"
//         >
//           <MessageCircle size={20} />
//         </a>

//         <a
//           href="https://www.instagram.com/mystore"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="hover:text-pink-500 transition"
//         >
//           <Instagram size={20} />
//         </a>
//       </div>
//     </footer>
//   );
// }
