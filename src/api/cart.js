// api/cart.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    // محاكاة استرجاع بيانات السلة
    const cartData = {
      items: [
        { id: 1, name: 'Milano Luxury Sofa', desc: 'Beige Fabric', qty: 1, price: 2499.00, img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/bbfc080f99-9a262e7b28390510d644.png' },
        { id: 2, name: 'Walnut Dining Table', desc: 'Natural Wood', qty: 1, price: 1899.00, img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/1b8c72839f-d44af22d32197ed4839f.png' },
        { id: 3, name: 'Executive Office Chair', desc: 'Black Leather', qty: 1, price: 899.00, img: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/80381d916d-9af6adfa8290e1dea3df.png' }
      ],
      subtotal: 5297.00,
      shipping: 149.00,
      tax: 423.68,
      total: 5869.68
    };
    return res.status(200).json(cartData);
  }

  if (req.method === 'POST') {
    // محاكاة إضافة منتج للسلة
    const { productId, quantity } = req.body;
    return res.status(200).json({ message: 'Product added to cart', productId, quantity });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
