import { createClient } from "@/utils/supabase/server";

export default async function Page() {

    // Fetch blog post from Supabase
    const supabase = await createClient();
    const { data, error } = await supabase.from('blogs').select('title, url_title');
    if (error) {
        console.error('Error fetching blog post:', error.message);
    }
    // console.log(data);

    return (
        <div className=" flex flex-col items-center mt-10 p-3">
            <div className="max-w-4xl w-full">
                <h1 className="flex  text-5xl font-sans " >
                    Frequently Asked Questions
                </h1>
                <div className="flex flex-col gap-3 mt-10 ">
                    {data?.map((blog) => {
                        return (
                            <div className='border border-gray-200 rounded-xl shadow-lg p-3' key={blog.url_title}>
                                <a className='flex max-w-2xl w-full flex-col gap-2 'href={`blogs/${blog.url_title}`}>
                                    <h2 className="text-xl">{blog.title}</h2>
                                </a>
                                
                            </div>
                        );
                    })}
                </div>

            </div>
            
        </div>
    );
}