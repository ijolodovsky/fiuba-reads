import React from 'react';
import { Mail, User, Calendar } from 'lucide-react';
import { FollowedUsersModal } from './FollowedUsersModal';

export const UserInformation = ({
  fullName,
  age,
  email,
  profile_picture,
  followingCount,
  followersCount,
  followersUsers,
  followingUsers,
}) => {
  return (
    <>
      <div className='flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10'>
        <div className='w-full md:w-1/3 flex flex-col items-center'>
          <div className='w-40 h-40 rounded-full border-4 border-blue-500 overflow-hidden mb-4'>
            <img
              src={profile_picture}
              alt='Profile'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
        <div className='text-right'>
          <FollowedUsersModal
            users={followersUsers}
            followersCount={followersCount}
            title={"Seguidores"}
          />
          <FollowedUsersModal
            users={followingUsers}
            followersCount={followingCount}
            title={"Seguidos"}
          />
        </div>
        <div className='w-full md:w-2/3'>
          <h3 className='text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600'>
            Información Personal
          </h3>
          <ul className='space-y-4'>
            <li className='flex items-center space-x-3'>
              <Mail className='text-blue-400' />
              <span>
                <strong className='text-blue-300'>Email:</strong>{" "}
                <span className='text-gray-300'>{email}</span>
              </span>
            </li>
            <li className='flex items-center space-x-3'>
              <User className='text-blue-400' />
              <span>
                <strong className='text-blue-300'>Nombre:</strong>{" "}
                <span className='text-gray-300'>{fullName}</span>
              </span>
            </li>
            <li className='flex items-center space-x-3'>
              <Calendar className='text-blue-400' />
              <span>
                <strong className='text-blue-300'>Edad:</strong>{" "}
                <span className='text-gray-300'>{age}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
