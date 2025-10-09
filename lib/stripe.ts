import Stripe from 'stripe';

// ビルド時にエラーを出さないように、実行時にチェック
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || '', 
  {
    apiVersion: '2025-09-30.clover',
  }
);

// 実行時に環境変数が設定されているかチェックする関数
export const validateStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }
};