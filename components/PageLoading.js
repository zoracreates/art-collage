import React from 'react';
import { ActivityIndicator } from 'react-native';
import { MainContainer } from '../components/Containers';

export default PageLoading = () => {
    return (
        <MainContainer style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size='large' />
        </MainContainer>
    );
}

