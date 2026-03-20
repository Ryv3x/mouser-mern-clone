import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendOrderStatusEmail } from '../utils/emailService.js';

export const createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;
    const order = new Order({ user: req.user._id, products, totalPrice, status: 'pending' });
    const created = await order.save();

    // Notify each unique seller by email (if seller info present on product entries)
    try {
      const sellerIds = Array.from(new Set((products || []).map((p) => p.seller).filter(Boolean)));
      for (const sid of sellerIds) {
        const seller = await User.findById(sid);
        if (seller && seller.email) {
          const messageHtml = `
            <p>Hi ${seller.name || 'Seller'},</p>
            <p>You have received a new order (Order ID: ${created._id}). Please review and prepare the items for shipping.</p>
            <p><strong>Total:</strong> $${(totalPrice || 0).toFixed(2)}</p>
          `;
          await sendOrderStatusEmail(seller.email, 'New Order Received', messageHtml);
        }
      }

      // Notify buyer as confirmation
      const buyer = await User.findById(req.user._id);
      if (buyer && buyer.email) {
        const msg = `
          <p>Hi ${buyer.name || 'Customer'},</p>
          <p>Thanks for your order! Your order id is <strong>${created._id}</strong>. We'll notify you when the seller updates the status.</p>
          <p><strong>Total:</strong> $${(totalPrice || 0).toFixed(2)}</p>
        `;
        await sendOrderStatusEmail(buyer.email, 'Order Confirmation', msg);
      }
    } catch (notifyErr) {
      console.error('Order notification error:', notifyErr);
    }

    return res.status(201).json(created);
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Failed to create order: ' + (err.message || err) });
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('products.product');
  res.json(orders);
};
