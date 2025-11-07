// useAvatar.js
import ApiService from "../ApiService";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

export const useAvatar = (avatars, setAvatars) => {
  const fetchUserAvatar = async (id) => {
    if (!id || avatars[id]) return;

    try {
      const avatarUrl = await ApiService.getUserAvatar(id);
      setAvatars(prev => ({ ...prev, [id]: avatarUrl || DEFAULT_AVATAR }));
    } catch {
      setAvatars(prev => ({ ...prev, [id]: DEFAULT_AVATAR }));
    }
  };

  return { fetchUserAvatar };
};