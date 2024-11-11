import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase-client';

export const useFollowCounts = (userID) => {
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
    const fetchFollowCountsAndUsers = async () => {
      try {
        // Fetching following data
        const { data: followingData } = await supabase
          .from('follows')
          .select('followed_id')
          .eq('follower_id', userID);

        // Fetching followers data
        const { data: followersData } = await supabase
          .from('follows')
          .select('follower_id')
          .eq('followed_id', userID);

        setFollowingCount(followingData.length);
        setFollowersCount(followersData.length);

        // Fetching followed users' details
        const followedUserIds = followingData.map((follow) => follow.followed_id);
        const { data: followedUserDetails } = await supabase
          .from('users')
          .select('username, first_name, last_name, profile_picture')
          .in('username', followedUserIds);

        setFollowedUsers(followedUserDetails);

        // Fetching following users' details
        const followerUserIds = followersData.map((follow) => follow.follower_id);
        const { data: followingUserDetails } = await supabase
          .from('users')
          .select('username, first_name, last_name, profile_picture')
          .in('username', followerUserIds);

        setFollowingUsers(followingUserDetails);
      } catch (error) {
        console.error("Error fetching follow data:", error);
      }
    };

    fetchFollowCountsAndUsers();
  }, [userID]);

  return { followingCount, followersCount, followedUsers, followingUsers };
};
