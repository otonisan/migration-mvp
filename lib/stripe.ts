import Stripe from 'stripe';

// ビルド時はダミー値を使用、実行時は実際の値を使用
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-09-30.clover',
});

// 実行時に環境変数が設定されているかチェックする関数
export const validateStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_dummy') {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
};