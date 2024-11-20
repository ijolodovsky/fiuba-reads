import React, { useEffect } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useSearchParams } from 'react-router-dom';

const Success = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const purchaseData = {
            user_id: searchParams.get('user_id'),
            book_id: searchParams.get('book_id'),
            price: Number(searchParams.get('price')),
            purchase_date: new Date().toISOString(), // Fecha actual
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
    }, [searchParams]);

    return (
        <div>
            <h1>Success</h1>
        </div>
    );
};

export default Success;
