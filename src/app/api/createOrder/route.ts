import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});

export async function POST(req: Request) {
  const { currency } = await req.json();

  if (currency !== "INR" && currency !== "USD") {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  if(currency=='INR') {

    const order = await razorpay.orders.create({
      amount: 50000,
      currency: "INR",
    });
    return NextResponse.json(order);

  }
  else if(currency=='USD') {
    const order = await razorpay.orders.create({
      amount: 500,
      currency: "USD",
    });
    return NextResponse.json(order);
  }
  
}