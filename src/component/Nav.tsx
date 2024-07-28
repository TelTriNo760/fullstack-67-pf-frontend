import { FC } from "react";

interface Props {
  searchQuery:string;
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
  
  export const Nav: FC<Props> = ({searchQuery,handleSearchInputChange}) => {
    return (
      <header>
      <div className="flex justify-between head">
        <h1 className="p-5 text-white">MyBlog</h1>
        {/* <div className="text-right p-3">Menu</div> */}
      </div>
      <div className="flex justify-center p-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="backdrop-blur-md bg-white/30 border-opacity-70 rounded-full"
        />
      </div>
    </header>
    );
  };