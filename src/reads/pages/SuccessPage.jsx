import React, { useContext, useEffect } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, House } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/src/auth';

export const SuccessPage = () => {
    const { authState: { user } } = useContext(AuthContext);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const userId = searchParams.get('userId');
    const bookId = searchParams.get('bookId');
    const price = searchParams.get('price');

    useEffect(() => {
        const purchaseData = {
            username: userId,
            book_id: bookId,
            price: parseFloat(price),
            purchase_date: new Date().toISOString(),
        };

        const addDataToTable = async () => {
            const { data, error } = await supabase
                .from('bookPurchases')
                .insert(purchaseData);

            if (error) {
                console.error('Error inserting data:', error);
            } else {
                console.log('Data inserted successfully:', data);
            }
        };

        addDataToTable();
    }, []);

    const handleGoHome = () => {
        navigate('/');
      };
    
      return (
        <div className="h-[calc(100vh-72px)] bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center text-white py-12 px-4">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              ¡Compra Exitosa!
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              {user.username} tu pedido de ISBN #{bookId} se ha procesado correctamente!
            </p>
            <div className="flex space-x-4 justify-center">
              <Button
                onClick={handleGoHome} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded"
              >
                <House className="inline-block mr-2" />
                Ir a Inicio
              </Button>
            </div>
          </div>
        </div>
      );
};
