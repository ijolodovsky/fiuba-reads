import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { FrownIcon, HomeIcon } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-2 border-blue-500 text-white">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
          <CardTitle className="text-3xl font-bold">404 - No Encontrado</CardTitle>
          <CardDescription className="text-blue-200">Lo sentimos, no pudimos encontrar lo que buscas.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 mt-4">
          <FrownIcon className="w-20 h-20 text-blue-400" />
          <p className="text-center text-gray-300">
            La página o recurso que estás buscando no existe o ha sido movido.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/" >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <HomeIcon className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}