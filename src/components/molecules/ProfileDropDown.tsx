type ProfileDropdownProps = {
  onShowFavorites: () => void;
};

export default function ProfileDropdown({ onShowFavorites }: ProfileDropdownProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
      <ul className="py-1">
        <li><a href="#" className="block px-4 py-2 text-sm hover:bg-gray-700">View Profile</a></li>
        <li><button onClick={onShowFavorites} className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-700">Favorite Messages</button></li>
      </ul>
    </div>
  );
}