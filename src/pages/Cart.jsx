import axios from 'axios';

function Cart() {
  const handlePayment = async () => {
    try {
      // 1. ബാക്കെൻഡിൽ നിന്ന് ഒരു Razorpay Order ID ഉണ്ടാക്കുന്നു (വില: ₹500)
      const orderRes = await axios.post('http://localhost:5000/api/payment/order', { amount: 500 });
      const { id: order_id, currency, amount } = orderRes.data;

      // 2. Razorpay ചെക്കൗട്ട് പോപ്പ്-അപ്പ് ഓപ്ഷനുകൾ
      const options = {
        key: "rzp_test_YOUR_KEY_HERE", // നിങ്ങളുടെ Razorpay Test Key ഇവിടെ കൊടുക്കുക
        amount: amount,
        currency: currency,
        name: "My React Store",
        description: "Test E-commerce Transaction",
        order_id: order_id,
        handler: function (response) {
          alert("🔥 പെയ്‌മെന്റ് വിജയകരമായി കഴിഞ്ഞു! ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "Akhil",
          email: "akhil@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#333333",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment initiation failed. Make sure Backend is running!");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Your Cart</h2>
      <div style={{ border: '1px solid #ccc', width: '300px', margin: '20px auto', padding: '20px', borderRadius: '8px' }}>
        <h3>Nike Shoes (1 item)</h3>
        <p>Total Amount: <strong>₹ 500</strong></p>
        <button 
          onClick={handlePayment} 
          style={{ padding: '10px 20px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          Proceed to Pay (Razorpay)
        </button>
      </div>
    </div>
  );
}

export default Cart;