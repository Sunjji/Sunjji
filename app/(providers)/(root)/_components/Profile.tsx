import Link from "next/link";

function Profile() {
  return (
    <>
      <div className="w-[150px] h-[50px] rounded-[80px] bg-point">
        <Link href={"/my-page"}>프로필(대충 해놓은거임)</Link>
      </div>
    </>
  );
}

export default Profile;
