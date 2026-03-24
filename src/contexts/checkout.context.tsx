'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

export interface GuestAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country_id: number;
  state_id?: number;
}

export interface GuestContact {
  phone: string;
}

interface CheckoutState {
  selectedAddressId: number | null;
  selectedContactNumberId: number | null;
  selectedPaymentMethodId: number | null;
  deliveryDate: string | null;
  giftWrapped: string | null; // 'gift_wrapped' | 'none'
  deliveryInstructions: string | null;
  leaveAtDoor: boolean;
  couponCode: string | null;
  couponInfo: {
    code: string;
    type: 'free_shipping' | 'percent' | 'flat';
    value: number;
    discount_amount: number;
    shipping_discount: number;
  } | null;
  // Guest checkout fields
  guestEmail: string | null;
  guestAddress: GuestAddress | null;
  guestContact: GuestContact | null;
  guestPaymentMethodId: string | null; // Stripe payment method ID
}

interface CheckoutContextType extends CheckoutState {
  setSelectedAddressId: (id: number | null) => void;
  setSelectedContactNumberId: (id: number | null) => void;
  setSelectedPaymentMethodId: (id: number | null) => void;
  setDeliveryDate: (date: string | null) => void;
  setGiftWrapped: (value: string | null) => void;
  setDeliveryInstructions: (instructions: string | null) => void;
  setLeaveAtDoor: (value: boolean) => void;
  setCouponCode: (code: string | null) => void;
  setCouponInfo: (
    info: {
      code: string;
      type: 'free_shipping' | 'percent' | 'flat';
      value: number;
      discount_amount: number;
      shipping_discount: number;
    } | null,
  ) => void;
  clearCoupon: () => void;
  setGuestEmail: (email: string | null) => void;
  setGuestAddress: (address: GuestAddress | null) => void;
  setGuestContact: (contact: GuestContact | null) => void;
  setGuestPaymentMethodId: (id: string | null) => void;
  validateCheckout: (isAuthorized: boolean) => { isValid: boolean; errors: string[] };
  resetCheckout: () => void;
}

const initialState: CheckoutState = {
  selectedAddressId: null,
  selectedContactNumberId: null,
  selectedPaymentMethodId: null,
  deliveryDate: null,
  giftWrapped: null,
  deliveryInstructions: null,
  leaveAtDoor: false,
  couponCode: null,
  couponInfo: null,
  guestEmail: null,
  guestAddress: null,
  guestContact: null,
  guestPaymentMethodId: null,
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<CheckoutState>(initialState);

  // Load coupon from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('checkout_coupon');
      if (stored) {
        const parsed = JSON.parse(stored);
        setState((prev) => ({
          ...prev,
          couponCode: parsed?.couponCode ?? null,
          couponInfo: parsed?.couponInfo ?? null,
        }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const setSelectedAddressId = useCallback((id: number | null) => {
    setState((prev) => ({ ...prev, selectedAddressId: id }));
  }, []);

  const setSelectedContactNumberId = useCallback((id: number | null) => {
    setState((prev) => ({ ...prev, selectedContactNumberId: id }));
  }, []);

  const setSelectedPaymentMethodId = useCallback((id: number | null) => {
    setState((prev) => ({ ...prev, selectedPaymentMethodId: id }));
  }, []);

  const setDeliveryDate = useCallback((date: string | null) => {
    setState((prev) => ({ ...prev, deliveryDate: date }));
  }, []);

  const setGiftWrapped = useCallback((value: string | null) => {
    setState((prev) => ({ ...prev, giftWrapped: value }));
  }, []);

  const setDeliveryInstructions = useCallback((instructions: string | null) => {
    setState((prev) => ({ ...prev, deliveryInstructions: instructions }));
  }, []);

  const setLeaveAtDoor = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, leaveAtDoor: value }));
  }, []);

  const setCouponCode = useCallback((code: string | null) => {
    setState((prev) => ({ ...prev, couponCode: code }));
  }, []);

  const setCouponInfo = useCallback(
    (
      info: {
        code: string;
        type: 'free_shipping' | 'percent' | 'flat';
        value: number;
        discount_amount: number;
        shipping_discount: number;
      } | null,
    ) => {
      setState((prev) => ({ ...prev, couponInfo: info }));
    },
    [],
  );

  const clearCoupon = useCallback(() => {
    setState((prev) => ({ ...prev, couponCode: null, couponInfo: null }));
  }, []);

  const setGuestEmail = useCallback((email: string | null) => {
    setState((prev) => ({ ...prev, guestEmail: email }));
  }, []);

  const setGuestAddress = useCallback((address: GuestAddress | null) => {
    setState((prev) => ({ ...prev, guestAddress: address }));
  }, []);

  const setGuestContact = useCallback((contact: GuestContact | null) => {
    setState((prev) => ({ ...prev, guestContact: contact }));
  }, []);

  const setGuestPaymentMethodId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, guestPaymentMethodId: id }));
  }, []);

  const validateCheckout = useCallback((isAuthorized: boolean) => {
    const errors: string[] = [];

    if (!state.deliveryDate) {
      errors.push('Please select a delivery date');
    }

    if (!state.giftWrapped) {
      errors.push('Please select a gift wrap option');
    }

    if (isAuthorized) {
      // Authenticated user validation
      if (!state.selectedAddressId) {
        errors.push('Please select a delivery address');
      }

      if (!state.selectedContactNumberId) {
        errors.push('Please select a contact number');
      }

      if (!state.selectedPaymentMethodId) {
        errors.push('Please select a payment method');
      }
    } else {
      // Guest checkout validation
      if (!state.guestEmail) {
        errors.push('Please enter your email address');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.guestEmail)) {
        errors.push('Please enter a valid email address');
      }

      if (!state.guestAddress) {
        errors.push('Please enter your delivery address');
      } else {
        if (!state.guestAddress.first_name) {
          errors.push('Please enter your first name');
        }
        if (!state.guestAddress.last_name) {
          errors.push('Please enter your last name');
        }
        if (!state.guestAddress.address_line1) {
          errors.push('Please enter your address');
        }
        if (!state.guestAddress.city) {
          errors.push('Please enter your city');
        }
        if (!state.guestAddress.postal_code) {
          errors.push('Please enter your postal code');
        }
        if (!state.guestAddress.country_id) {
          errors.push('Please select your country');
        }
      }

      if (!state.guestContact) {
        errors.push('Please enter your contact number');
      } else if (!state.guestContact.phone) {
        errors.push('Please enter a valid phone number');
      }

      if (!state.guestPaymentMethodId) {
        errors.push('Please enter your payment information');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [state]);

  const resetCheckout = useCallback(() => {
    setState(initialState);
  }, []);

  // Persist coupon in localStorage so it survives reloads
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!state.couponCode && !state.couponInfo) {
      window.localStorage.removeItem('checkout_coupon');
      return;
    }

    const payload = {
      couponCode: state.couponCode,
      couponInfo: state.couponInfo,
    };

    window.localStorage.setItem('checkout_coupon', JSON.stringify(payload));
  }, [state.couponCode, state.couponInfo]);

  const value: CheckoutContextType = {
    ...state,
    setSelectedAddressId,
    setSelectedContactNumberId,
    setSelectedPaymentMethodId,
    setDeliveryDate,
    setGiftWrapped,
    setDeliveryInstructions,
    setLeaveAtDoor,
    setCouponCode,
    setCouponInfo,
    clearCoupon,
    setGuestEmail,
    setGuestAddress,
    setGuestContact,
    setGuestPaymentMethodId,
    validateCheckout,
    resetCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

