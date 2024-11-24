import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useFollowCounts } from './useFollowCounts';

export const useNotifications = (username) => {
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const { followingUsers } = useFollowCounts(username);

    const fetchUnreadNotifications = async () => {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .or(
                `send_from.in.(${followingUsers.map((user) => user.username).join(",")}),send_to.eq.${username}`
            )
            .eq("is_read", false);

        setUnreadNotifications(data);

        if (error) {
            console.error("Error fetching notifications:", error);
        } else {
            console.log("Unread Notifications:", data);
        }

    };

    useEffect(() => {
        fetchUnreadNotifications();
    }, [followingUsers]);

    return { unreadNotifications };
};
