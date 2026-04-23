# Run and deploy 

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e320eb9e-a432-4ee8-bc7e-195095e8ed5d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
## Razorpay Setup

### Environment Variables

Make sure your `.env` file contains valid Razorpay credentials:

```env
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
```

### Testing Razorpay Integration

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/api/test-razorpay` to test the connection
3. Add items to cart and try checkout

### Common Issues

- **401 Authentication Error**: Check your API keys in `.env`
- **Payment Popup Not Opening**: Ensure Razorpay script loads (check browser console)
- **Signature Verification Failed**: Backend secret key mismatch

### Getting Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Copy your Live/Test keys (use Test keys for development)
