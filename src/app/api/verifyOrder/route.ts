import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_SECRET_ID as string;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export async function POST(request: NextRequest) {
    const { orderId, razorpayPaymentId, razorpaySignature} = await request.json();
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    const signature = generatedSignature(orderId, razorpayPaymentId);
    if (signature !== razorpaySignature) {
        return NextResponse.json(
        { message: "payment verification failed", isOk: false },
        { status: 400 }
        );
    }

    // Probably some database calls here to update order or add premium status to user
    const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseURL, supabaseKey);
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data) {
        return NextResponse.json(
        { message: "Payment Verification Failed User Not Present", isOk: false },
        { status: 400 }
        );
    }
    
    const userInfo = await supabase.from("roles").select("*").eq("user_id", data.user.id);
    if(userInfo.data){
        const chats_left = userInfo.data[0].chats_left;
        const { error: updateError }= await supabase.from("roles").update({role: 'paid', chats_left: chats_left + 10}).eq("user_id", data.user.id);
        if(updateError) {
            return NextResponse.json(
            { message: "Error in updating the user count", error, isOk: false },
            { status: 400 } );
        }
    }
    else {
        const insertRole = await supabase.from('roles').insert([{user_id: data.user.id, role: 'paid', chats_left: 10}])
        const insertProfiles = await supabase.from('profiles').insert([{user_id: data.user.id, username: data.user.email}])
        if(insertRole.error || insertProfiles.error) {
            console.error("Error in inserting user: Role", insertRole.error, "Profle: ", insertProfiles.error);
            return NextResponse.json({ error: 'Error in inserting user' }, { status: 500 });
        }
        else {
            console.log("User Created When Generating Token: ", insertRole, insertProfiles);
        }
    }

    

    return NextResponse.json(
        { message: "payment verified successfully", isOk: true },
        { status: 200 }
    );
}