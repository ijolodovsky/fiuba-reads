import React, { useState } from 'react'
import { Star, Clock, BookOpen, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const defaultProps = {
  title: "El nombre del viento",
  author: "Patrick Rothfuss",
  coverImage: "/placeholder.svg?height=400&width=300",
  genre: "Fantasía",
  publicationDate: "2007",
  rating: 4.5,
  synopsis: "El nombre del viento es una novela de fantasía épica, primera entrega de la trilogía Crónica del asesino de reyes. La historia sigue a Kvothe, un legendario mago, músico y ladrón, mientras narra su vida a un cronista.",
  reviews: [
    { id: 1, user: "Ana García", avatar: "/placeholder.svg", rating: 5, comment: "Una obra maestra de la fantasía moderna. La narrativa es cautivadora y los personajes son inolvidables." },
    { id: 2, user: "Carlos Rodríguez", avatar: "/placeholder.svg", rating: 4, comment: "Una historia fascinante con un sistema de magia único. Aunque a veces el ritmo es lento, vale la pena la lectura." }
  ]
}

export default function BookProfile(props) {
  const { 
    title,
    author,
    coverImage,
    genre,
    publicationDate,
    rating,
    synopsis,
    reviews
  } = { ...defaultProps, ...props }

  const [showFullSynopsis, setShowFullSynopsis] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img src={coverImage} alt={`Portada de ${title}`} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-xl text-muted-foreground">por {author}</p>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{genre}</Badge>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{publicationDate}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Sinopsis</h2>
            <p className={`text-muted-foreground ${showFullSynopsis ? '' : 'line-clamp-3'}`}>
              {synopsis}
            </p>
            {synopsis.length > 150 && (
              <Button variant="link" onClick={() => setShowFullSynopsis(!showFullSynopsis)}>
                {showFullSynopsis ? 'Leer menos' : 'Leer más'}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Reseñas de lectores</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar>
                    <AvatarImage src={review.avatar} alt={review.user} />
                    <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.user}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}