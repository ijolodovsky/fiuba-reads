import React, { useContext, useEffect } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/src/auth';

export const SuccessPage = () => {
    const { authState: { user } } = useContext(AuthContext);

    const navigate = useNavigate();
    // useEffect(() => {

    //     const purchaseData = {
    //         user_id,
    //         book_id,
    //         price,
    //         purchase_date: new Date().toISOString(), // Fecha de la compra actual
    //       };
    //     const addDataToTable = async () => {
    //         const { data, error } = await supabase
    //             .from('bookPurchases')
    //             .insert(purchaseData);

    //         if (error) {
    //             console.error('Error inserting data:', error);
    //         } else {
    //             console.log('Data inserted successfully:', data);
    //         }
    //     };

    //     addDataToTable();
    // }, []);

    const handleGoHome = () => {
        navigate('/');
      };
    
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center text-white py-12 px-4">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              ¡Compra Exitosa!
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              {user.username} tu pedido se ha procesado correctamente!
            </p>
            <div className="flex space-x-4 justify-center">
              {/* <Button 
                onClick={handleGoToOrders} 
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Ver Historial de Compras
              </Button> */}
              <Button
                onClick={handleGoHome} 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded"
              >
                Ir a Inicio
              </Button>
            </div>
          </div>
        </div>
      );
};
