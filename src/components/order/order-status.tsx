import ProgressBox from './progress-box';

interface Props {
  status: number;
}

// Static status data matching the original format
const ORDER_STATUS_DATA = [
  {
    id: 1,
    name: 'Order Received',
    serial: 1,
    color: '#02B290',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Order placed',
    serial: 2,
    color: '#02B290',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'On the way',
    serial: 3,
    color: '#FED030',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Delivered',
    serial: 4,
    color: '#02B290',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const OrderStatus = ({ status }: Props) => {
  return (
    <ProgressBox
      data={{ data: ORDER_STATUS_DATA }}
      status={status || 0}
    />
  );
};

export default OrderStatus;
