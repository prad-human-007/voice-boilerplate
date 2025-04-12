"use client";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ReactNode } from "react";
import { Button } from "../ui/button";

interface PayButtonProps {
  currency: 'INR' | 'USD',
  className?: string;
  children: ReactNode;
}

export function PayButton({ currency, className, children }: PayButtonProps) {
  const router = useRouter();

  const createOrder = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    const res = await fetch("/api/createOrder", {
      method: "POST",
      body: JSON.stringify({ currency })
    });
    const data = await res.json();

    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.id,

      handler: async function (response: any) {
        // verify payment
        const res = await fetch("/api/verifyOrder", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        const data = await res.json();
        console.log(data);
        if (data.isOk) {
          // do whatever page transition you want here as payment was successful
          // alert("Payment successful");
          window.location.reload();
        } else {
          alert("Payment failed");
        }
        
      },
    };

    const payment = new (window as any).Razorpay(paymentData);
    payment.open();
  };

  return (
    <div>
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Button
        variant={'ghost'}
        className={` ${className}`}
        onClick={createOrder}
      >
        {children}
      </Button>
    </div>
  );
}