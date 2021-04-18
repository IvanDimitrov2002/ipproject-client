import Navbar from 'components/Navbar';
import { FunctionComponent, useState } from 'react';
import { useAuth } from 'utils/useAuth';

const Index: FunctionComponent = () => {
    const { user, logout } = useAuth(undefined, '/create');

    return (
        <>
            <Navbar />
            {user?.username}
        </>
    );
};

export default Index;
