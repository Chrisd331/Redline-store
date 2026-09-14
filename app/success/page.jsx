export default function Success() {
  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 40 }}>
      <div className="success">
        <img
          src="/logo.jpg"
          alt="Redline"
          style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 20px' }}
        />
        <h1>Order confirmed</h1>
        <p>
          Thanks — your payment went through. You'll get a receipt by email,
          and we'll be in touch with shipping details shortly.
        </p>
        <a href="/products">Back to the shop</a>
      </div>
    </main>
  );
}
