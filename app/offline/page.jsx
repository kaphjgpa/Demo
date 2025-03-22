// app/offline/page.jsx - Enhanced offline page
export default function OfflinePage() {
  const { cart } = useCart();

  return (
    <div className="p-4">
      <h1>Offline Mode</h1>
      <p>Showing cached content</p>

      {/* Show cached cart */}
      <div className="mt-4">
        {cart.map((item) => (
          <div key={item._id}>{item.foodName}</div>
        ))}
      </div>
    </div>
  );
}
