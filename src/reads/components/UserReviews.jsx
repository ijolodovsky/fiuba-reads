import React from 'react';
import {
    Card,
    CardContent,
  } from '@/components/ui/card';
import { Star } from 'lucide-react';


export  const UserReviews = ({ reviews }) => {
    return <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="bg-gray-700 border-blue-400">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold text-blue-300">
              {review.title}
            </h4>
            <div className="flex items-center mt-2">
              <Star className="text-yellow-400 mr-1" />
              <span className="text-yellow-400">
                {review.rating}/5
              </span>
            </div>
            <p className="mt-2 text-gray-300">{review.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>;
  }