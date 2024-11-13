import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

export const FollowedUsersModal = ({ users, followersCount, title }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='mr-2 btn border-1 rounded-lg shadow-2xl text-blue-400'
        >
          <Users className='mr-2 h-4 w-4' />
          {followersCount} {title}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-gray-800 text-white border border-gray-700'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center text-blue-400'>
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='h-[60vh] pr-4'>
          {users.length > 0 ? (
            <ul className='space-y-4'>
              {users.map((user) => (
                <Link
                  to={`/users/${user.username}`}
                  className='flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors'
                  key={user.username}
                >
                  <li className='flex items-center space-x-4 p-4'>
                    <Avatar className='w-12 h-12 border-2 border-blue-500'>
                      <AvatarImage
                        src={user.profile_picture}
                        alt={user.username}
                      />
                      <AvatarFallback className='bg-blue-600 text-white'>
                        {user.first_name}
                        {user.last_name}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className='text-lg font-semibold text-blue-300'>
                        {user.username}
                      </h3>
                      <p className='text-gray-300'>
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className='text-center text-gray-400'>
              No hay usuarios en esta lista.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
