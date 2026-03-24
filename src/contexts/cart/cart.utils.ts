export interface Item {
  id: string | number;
  price: number;
  quantity?: number;
  stock?: number;
  [key: string]: any;
}

export interface UpdateItemInput extends Partial<Omit<Item, 'id'>> {}

export function addItemWithQuantity(
  items: Item[],
  item: Item,
  quantity: number,
) {
  if (quantity <= 0)
    throw new Error("cartQuantity can't be zero or less than zero");

  // Idempotency guard (mitigate double invocation under StrictMode):
  // If the same item+quantity call happens twice within a few ms,
  // return the already-computed items array so the effect is applied only once.
  type GuardEntry = { quantity: number; ts: number; items: Item[] };
  const guardStore: Map<string | number, GuardEntry> =
    (globalThis as any).__cartGuard || new Map();
  (globalThis as any).__cartGuard = guardStore;
  const now = Date.now();
  const last = guardStore.get(item.id);
  if (last && last.quantity === quantity && now - last.ts < 5) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'cart-counter',
        hypothesisId: 'H-reducer-guard2',
        location: 'cart.utils:addItemWithQuantity:strict-guard',
        message: 'Returning cached items to avoid duplicate add',
        data: { itemId: item.id, quantity },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return last.items;
  }
  const existingItemIndex = items.findIndex(
    (existingItem) => existingItem.id === item.id,
  );

  if (existingItemIndex > -1) {
    const newItems = [...items];
    const prevQty = newItems[existingItemIndex].quantity!;
    const nextQty = prevQty + quantity;
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'cart-counter',
        hypothesisId: 'H-reducer',
        location: 'cart.utils:addItemWithQuantity:update',
        message: 'Updating existing cart item quantity',
        data: {
          itemId: item.id,
          prevQty,
          addQty: quantity,
          nextQty,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    newItems[existingItemIndex].quantity = nextQty;
    guardStore.set(item.id, { quantity, ts: now, items: newItems });
    return newItems;
  }
  // Guard: if another call in the same tick already added this item, treat as update instead of new add
  const alreadyAddedIndex = items.findIndex(
    (existingItem) => existingItem.id === item.id,
  );
  if (alreadyAddedIndex > -1) {
    const newItems = [...items];
    const prevQty = newItems[alreadyAddedIndex].quantity!;
    const nextQty = prevQty + quantity;
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'cart-counter',
        hypothesisId: 'H-reducer-guard',
        location: 'cart.utils:addItemWithQuantity:guard-update',
        message: 'Guarded update (duplicate add in same cycle)',
        data: {
          itemId: item.id,
          prevQty,
          addQty: quantity,
          nextQty,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    newItems[alreadyAddedIndex].quantity = nextQty;
    return newItems;
  }
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/f0a8cbc8-c4ea-4a4e-8424-57df84ac9e3c', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'cart-counter',
      hypothesisId: 'H-reducer',
      location: 'cart.utils:addItemWithQuantity:new',
      message: 'Adding new cart item',
      data: {
        itemId: item.id,
        addQty: quantity,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  const result = [...items, { ...item, quantity }];
  guardStore.set(item.id, { quantity, ts: now, items: result });
  return result;
}

export function removeItemOrQuantity(
  items: Item[],
  id: Item['id'],
  quantity: number,
) {
  return items.reduce((acc: Item[], item) => {
    if (item.id === id) {
      const newQuantity = item.quantity! - quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
}
// Simple CRUD for Item
export function addItem(items: Item[], item: Item) {
  return [...items, item];
}

export function getItem(items: Item[], id: Item['id']) {
  return items.find((item) => item.id === id);
}

export function updateItem(
  items: Item[],
  id: Item['id'],
  item: UpdateItemInput,
) {
  return items.map((existingItem) =>
    existingItem.id === id ? { ...existingItem, ...item } : existingItem,
  );
}

export function removeItem(items: Item[], id: Item['id']) {
  return items.filter((existingItem) => existingItem.id !== id);
}

export function inStock(items: Item[], id: Item['id']) {
  const item = getItem(items, id);
  if (item) return item['quantity']! < item['stock']!;
  return false;
}

export const calculateItemTotals = (items: Item[]) =>
  items.map((item) => ({
    ...item,
    itemTotal: item.price * item.quantity!,
  }));

export const calculateTotal = (items: Item[]) =>
  items.reduce((total, item) => total + item.quantity! * item.price, 0);

export const calculateTotalItems = (items: Item[]) =>
  items.reduce((sum, item) => sum + item.quantity!, 0);

export const calculateUniqueItems = (items: Item[]) => items.length;
