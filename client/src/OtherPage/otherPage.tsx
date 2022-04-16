import React from 'react';
import { Link } from 'react-router-dom';

export const OtherPage : React.FC = ()=> {
    return (
        <div>
            Im some other page!
            <Link to="/">Go Back Home</Link>
        </div>
    )
}

export default OtherPage;
