import './Store.css'

const StoreLocator = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-4">
        <ul className="flex gap-1">
          <li>
            <a href="/" className="hover:text-gray-700">Home</a>
          </li>
          <li>/</li>
          <li>
            <a href="/customer-services" className="hover:text-gray-700">
              Customer Services
            </a>
          </li>
          <li>/</li>
          <li className="text-gray-700">Store Locator</li>
        </ul>
      </nav>

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-black mb-6">Store Locator</h1>

      {/* Content placeholder */}
      <div className="bg-white p-6 rounded shadow">
        <p>Here you can add your store locator map or list.</p>
      </div>
    </div>
  );
};

export default StoreLocator;
