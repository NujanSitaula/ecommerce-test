import { Order } from '@framework/order/use-place-order';

// Status mapping from backend status to frontend status format
const STATUS_MAP: Record<string, { name: string; color: string; serial: number }> = {
  pending: {
    name: 'Order Received',
    color: '#02B290',
    serial: 1,
  },
  confirmed: {
    name: 'Order placed',
    color: '#02B290',
    serial: 2,
  },
  processing: {
    name: 'Order placed',
    color: '#A6B1BD',
    serial: 2,
  },
  shipped: {
    name: 'On the way',
    color: '#FED030',
    serial: 3,
  },
  delivered: {
    name: 'Delivered',
    color: '#02B290',
    serial: 4,
  },
  cancelled: {
    name: 'Cancelled',
    color: '#F35C5C',
    serial: 0,
  },
};

export const mapOrderStatus = (status: string) => {
  return STATUS_MAP[status.toLowerCase()] || {
    name: status.charAt(0).toUpperCase() + status.slice(1),
    color: '#666666',
    serial: 0,
  };
};

// Format delivery date to match original format (e.g., "25 May, 2021")
const formatDeliveryDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  } catch {
    return dateString;
  }
};

// Transform backend order to frontend format matching original JSON structure
export const transformOrderForTable = (order: Order) => {
  const status = mapOrderStatus(order.status);
  const now = new Date().toISOString();
  
  // Transform address to match original format
  const shippingAddress = order.address ? {
    street_address: [
      order.address.address_line1,
      order.address.address_line2
    ].filter(Boolean).join(', '),
    country: order.address.country || '',
    city: order.address.city || '',
    state: order.address.state || '',
    zip: order.address.postal_code || '',
  } : null;
  
  return {
    id: order.id,
    tracking_number: String(order.id), // Match original format (string, not #id)
    amount: order.subtotal, // Subtotal amount
    total: order.total,
    delivery_fee: order.shipping_fee,
    discount: 0, // Not implemented yet
    status: {
      id: status.serial,
      name: status.name,
      serial: status.serial,
      color: status.color,
      created_at: now,
      updated_at: now,
    },
    delivery_time: formatDeliveryDate(order.delivery_date),
    created_at: order.created_at,
    products: order.items?.map((item) => ({
      id: item.product_id || item.id,
      name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      image: {
        id: item.product_id || item.id,
        thumbnail: null, // Backend doesn't provide image yet
      },
    })) || [],
    shipping_address: shippingAddress,
  };
};

