'use client'

import React, { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, House, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/src/auth';

export const FailurePage = () => {
    const { authState: { user } } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const bookId = searchParams.get('bookId');
    

    const handleGoHome = () => {
        navigate('/');
    };

    const handleTryAgain = () => {
        navigate(`/books/${bookId}`);
    };

    return (
        <div className="h-[calc(100vh-72px)] bg-gradient-to-br from-gray-900 to-red-900 flex flex-col items-center justify-center text-white py-12 px-4">
            <div className="text-center">
                <XCircle className="h-20 w-20 text-red-400 mx-auto mb-6" />
                <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-600 mb-4">
                    ¡Compra Fallida!
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                    {user?.username}, lo sentimos, ha ocurrido un error al procesar tu compra del libro con ISBN #{bookId}.
                </p>
                <div className="flex space-x-4 justify-center">
                    <Button
                        onClick={handleTryAgain} 
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        <RefreshCcw className="inline-block mr-2" />
                        Intentar de nuevo
                    </Button>
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
