'use client'

import React, { useContext } from 'react';
import { Clock, House } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/src/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const PendingPage = () => {
    const { authState: { user } } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const bookId = searchParams.get('bookId');

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="h-[calc(100vh-72px)] bg-gradient-to-br from-gray-900 to-yellow-900 flex flex-col items-center justify-center text-white py-12 px-4">
            <div className="text-center">
                <Clock className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600 mb-4">
                    Compra Pendiente
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                    {user?.username}, tu compra del libro con ISBN #{bookId} está siendo procesada. Por favor, espera un momento.
                </p>
                <div className="flex space-x-4 justify-center">
                    <Button
                        onClick={handleGoHome} 
                        className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold py-2 px-4 rounded"
                    >
                        <House className="inline-block mr-2" />
                        Ir a Inicio
                    </Button>
                </div>
            </div>
        </div>
    );
};

