import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {

    const { visaType } = await req.json();
    let instructions = `You are an Customer survey agent form Mcdonalds. Introduce yourself as, Hello I'm calling from Mcdonalds. You are calling to get the 
                            feedback from the customer. The customer has purchased a Double Cheese Burger.
                            Before asking the feedback, ask the customer to confirm the order and if they are free to talk.
                            If they are not free then ask just a small feedback not all the long points. 
                            Don't mention about the small feedback part until the customer says they are buzy.
                            Ask the customer about the feedback. Ask questions like how was the burger,
                            how was the service, how was the staff, how was the restaurant, how was the price,
                            how was the taste, how was the quality, how was the quantity, how was the packaging,
                            how was the delivery, how was the order, how was the payment, how was the experience.
                            Ask all the questions in an incremental way don't ask all the queqstions at once.`
    
    if( visaType == 'Nike') {
        instructions = `You are an Customer survey agent form Nike. Introduce yourself as, Hello I'm calling from Nike. You are calling to get the 
                            feedback from the customer. The customer has purchased a Nike Air Max.
                            Before asking the feedback, ask the customer to confirm the order and if they are free to talk.
                            If they are not free then ask just a small feedback not all the long points. 
                            Don't mention about the small feedback part until the customer says they are buzy. 
                            Ask the customer about the feedback. Ask questions like how was the shoe,
                            how was the service, how was the staff, how was the store, how was the price,
                            how was the fit, how was the quality, how was the comfort, how was the style,
                            how was the delivery, how was the order, how was the payment, how was the experience.
                            Ask all the questions in an incremental way don't ask all the queqstions at once.`
    }
                            

    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: process.env.NEXT_PUBLIC_REALTIME_MODEL_NAME,
            voice: "alloy",
            instructions: instructions,
            "input_audio_transcription": {
                "model": "whisper-1"
            }
        }),
    });
    const { client_secret } = await r.json();

    console.log("Client secret: ", client_secret);
    return NextResponse.json({ client_secret});
}