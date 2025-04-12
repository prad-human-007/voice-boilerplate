import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);


export async function GET(request: Request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'No Token' }, { status: 401 });

    const { data, error } = await supabase.auth.getUser(token);
    if(error || !data || data.user.role != 'authenticated') {
        console.error('Failed to authenticate user: ', token, "Error: ", error);   
        return  NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
    }

    const insertRole = await supabase.from('roles').insert([{user_id: data.user.id, role: 'user', chats_left: 1}])
    const insertProfiles = await supabase.from('profiles').insert([{user_id: data.user.id, username: data.user.email}])

    console.log("Insert Role: ", insertRole, "Inserted Profiles", insertProfiles)
    
    return NextResponse.json({ message: 'User Created' });
}