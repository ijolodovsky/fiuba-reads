import React, { useEffect } from 'react';
import { supabase } from '../../utils/supabase-client';

const Success = () => {
    useEffect(() => {

        const purchaseData = {
            user_id,
            book_id,
            price,
            purchase_date: new Date().toISOString(), // Fecha de la compra actual
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

    return (
        <div>
            <h1>Success</h1>
        </div>
    );
};

export default Success;