import { getToken } from '@framework/utils/get-token';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

const getBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_REST_API_ENDPOINT || '';
  return base.endsWith('/api') ? base.slice(0, -4) : base;
};

export async function downloadOrderInvoice(orderId: number): Promise<void> {
  const token = getToken();
  const url = `${getBaseUrl()}${API_ENDPOINTS.ORDER_INVOICE(orderId)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/pdf',
    },
  });
  if (!res.ok) throw new Error('Failed to download invoice');
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = `invoice-${orderId}.pdf`;
  a.click();
  URL.revokeObjectURL(objectUrl);
}

export async function downloadGuestOrderInvoice(
  orderId: number,
  email: string
): Promise<void> {
  const url = `${getBaseUrl()}${API_ENDPOINTS.ORDER_INVOICE_GUEST(orderId)}?email=${encodeURIComponent(email)}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/pdf' },
  });
  if (!res.ok) throw new Error('Failed to download invoice');
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = `invoice-${orderId}.pdf`;
  a.click();
  URL.revokeObjectURL(objectUrl);
}
