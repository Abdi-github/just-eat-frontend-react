// Pages
export { CheckoutPage } from './pages/CheckoutPage';
export { OrderConfirmationPage } from './pages/OrderConfirmationPage';
export { PaymentSimulationPage } from './pages/PaymentSimulationPage';

// Components
export { AddressSelector } from './components/AddressSelector';
export { PaymentMethods } from './components/PaymentMethods';
export { CouponInput } from './components/CouponInput';
export { TipSelector } from './components/TipSelector';
export { OrderSummary } from './components/OrderSummary';
export { StripeProvider } from './components/StripeProvider';
export { StripeCardForm } from './components/StripeCardForm';

// API hooks
export {
  useCreateOrderMutation,
  useInitiatePaymentMutation,
  useGetPaymentStatusQuery,
  useSimulateConfirmPaymentMutation,
  useValidateCheckoutCouponMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useSetDefaultAddressMutation,
} from './checkout.api';

// Types
export type {
  OrderType,
  PaymentMethod,
  OrderStatus,
  PaymentStatus,
  Address,
  CreateAddressRequest,
  OrderItemRequest,
  OrderItem,
  CreateOrderRequest,
  Order,
  InitiatePaymentRequest,
  PaymentTransaction,
  ValidateCouponRequest,
  CouponValidation,
} from './checkout.types';
