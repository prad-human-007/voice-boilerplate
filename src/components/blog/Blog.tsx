import React from 'react';
import ReactMarkdown from 'react-markdown';

interface BlogProps {
    id: string;
    title: string;
    content: string;
}

const Blog: React.FC<BlogProps> = ({ id, content }) => {
    
    return (
        <div key={id} className='prose max-w-none'>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};


export default Blog;