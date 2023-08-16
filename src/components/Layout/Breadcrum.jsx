import { Breadcrumb, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const BreadCrumb = ({ links }) => {
    const [pathLinks, setPathLinks] = useState([{ title: <Link to={'/'}>Home</Link> }])
    
    useEffect(() => {
        if (links && links.length) {
            setPathLinks(links);
        }
    }, [pathLinks]);

    return (<>
        <Breadcrumb
            className='noselect'
            items={pathLinks}
            style={{
                marginBottom: '20px',
            }} 
        />
        </>
    );
}
export default BreadCrumb;