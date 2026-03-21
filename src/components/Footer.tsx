export default function Footer() {
  return (
    <footer id="contact" className="bg-stone-900 text-stone-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">D Store</h3>
            <p className="text-sm">
              Your premium destination for curated affiliate products across Kids, Beauty, Fashion, and Home & Design.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/Kids" className="hover:text-white transition-colors">Kids</a></li>
              <li><a href="/category/Beauty" className="hover:text-white transition-colors">Beauty</a></li>
              <li><a href="/category/Fashion" className="hover:text-white transition-colors">Fashion</a></li>
              <li><a href="/category/Home & Design" className="hover:text-white transition-colors">Home & Design</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">Email: contact@dstore.com</p>
            <p className="text-sm">Follow us on social media for the latest updates and exclusive deals.</p>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-8 pt-8 flex justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} D Store. All rights reserved.</p>
          <a href="/admin" className="text-stone-800 hover:text-stone-600 transition-colors">Admin</a>
        </div>
      </div>
    </footer>
  );
}
