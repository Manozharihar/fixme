import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ReceiptData {
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  customerEmail: string;
  createdAt: string;
  paymentMethod?: string;
}

export function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptData: ReceiptData = location.state?.receiptData;

  // 1. Use a Ref instead of document.querySelector
  const receiptRef = useRef<HTMLDivElement>(null);

  // Clean up any lingering Razorpay checkout overlays that might intercept clicks
  useEffect(() => {
    const rzp = document.querySelector('.razorpay-container');
    if (rzp) {
      rzp.remove();
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as any).default || html2pdfModule;

      const opt = {
        margin: 0.5,
        filename: `receipt-${receiptData.paymentId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(receiptRef.current).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF.');
    }
  };

  if (!receiptData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Home</button>
        </div>
      </div>
    );
  }

  // 2. Derive totals directly from the source of truth (the 'amount' paid)
  // Avoid hardcoding '* 80' logic here; use the data passed from the gateway.
  const totalInRupees = receiptData.amount / 100;

  return (
    <div className="min-h-screen bg-gray-50 py-24 md:py-8 md:ml-48">
      {/* Print styles to hide buttons and format correctly for physical paper */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
            .shadow-lg { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
          }
        `}
      </style>
      {/* 3. Attach the ref to the specific container you want in the PDF */}
      <div ref={receiptRef} className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-green-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold">Payment Successful</h1>
          <p className="opacity-90 text-sm">ID: {receiptData.paymentId}</p>
        </div>

        {/* Amount Section */}
        <div className="p-6 text-center border-b">
          <div className="text-3xl font-bold text-orange-600">
            ₹{totalInRupees.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="px-6 py-4 bg-gray-50 border-b space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment ID</span>
            <span className="font-mono text-gray-900">{receiptData.paymentId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Method</span>
            <span className="text-gray-900">{receiptData.paymentMethod || "Online"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date & Time</span>
            <span className="text-gray-900">{new Date(receiptData.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="p-6">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4">ORDER SUMMARY</h3>
          {receiptData.items.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-2 text-sm">
              <span>{item.name} x{item.quantity}</span>
              {/* Ensure your item prices come from the backend pre-calculated */}
              <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="border-t border-dashed mt-4 pt-4 flex justify-between font-bold">
            <span>Total Paid</span>
            <span>₹{totalInRupees.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Buttons - Hidden during Print */}
        <div className="p-6 space-y-3 no-print">
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold"
          >
            Download PDF
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 bg-gray-100 py-3 rounded-lg font-bold text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Print
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 text-gray-900 text-center py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors block"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
