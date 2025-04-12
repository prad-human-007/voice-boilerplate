import { createClient } from '@/utils/supabase/server';
import Blog from '@/components/blog/Blog';
import '@/app/blogs/blog.css';
import { VisaOfficerImage } from '@/components/blog/VisaOfficer';



export default async function BlogPage({ params }: { params: { name: string } }) {

    // Fetch blog post from Supabase
    const supabase = await createClient();
    console.log("PARAMS", params.name);
    const { data, error } = await supabase.from('blogs').select('title, content').eq('url_title', params.name);
    const { data: randomBlogs, error: randomBlogsError } = await supabase
        .from('blogs')
        .select('title, url_title')
        .limit(5);

    if (randomBlogsError) {
        console.error('Error fetching random blog posts:', randomBlogsError.message);
    }
    // console.log("RANDOM BLOGS", randomBlogs);
    if (error) {
        console.error('Error fetching blog post:', error.message);
    }
    if (!data || error) {
        return <div>Blog not found</div>;
    }
    // console.log("DATA!!!!!!", data);
    const { title, content } = data[0];
    
    return (
        <div className="flex flex-col lg:flex-row lg:justify-center mt-20 p-3 gap-3">
            <div className="max-w-4xl w-full lg:border-r-2 p-1"> 
                <VisaOfficerImage />
                <Blog id={params.name} title={title} content={content} />
            </div>
            <div className='flex flex-col borde rounded-xl h-32 lg:max-w-60 w-full p-4 gap-3'> 
                <div className='border border-gray-200 shadow-xl rounded-xl shadow-lg p-3' >
                    <a className='flex max-w-2xl w-full flex-col gap-2 'href={`/`}>
                        <h2 className="text-xl italic">🚀 Prepare With AI Interviewer ✨</h2>
                    </a>
                </div>
                {randomBlogs && randomBlogs.map((blog) => {
                    return (
                        <div className='border border-gray-200 rounded-xl shadow-lg p-3' key={blog.url_title}>
                            <a className='flex max-w-2xl w-full flex-col gap-2 'href={`${blog.url_title}`}>
                                <h2 className="text-xl">{blog.title}</h2>
                            </a>
                        </div>
                    );
                }) } 
            </div>
        </div>
    );
};

