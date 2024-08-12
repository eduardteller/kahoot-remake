import Discord from "./Svg/Discord";

const Account = () => {
  return (
    <div className="flex h-full flex-1 items-center justify-end">
      <a
        href="http://localhost:5090/auth/discord"
        className="btn btn-outline btn-md mr-4 flex items-center justify-center gap-2"
      >
        <Discord styles="w-6 h-6"></Discord>
        <p className="flex h-6 items-center justify-center">Discord Log In</p>
      </a>
    </div>
  );
};

export default Account;
