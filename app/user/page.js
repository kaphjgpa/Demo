import Header from "@/components/Header";
import { getServerSession } from "next-auth";

export default async function () {
  const session = await getServerSession();
  return (
    <div>
      <Header />
      User Component
      {JSON.stringify(session)}
    </div>
  );
}

//This is how we can acess the user details on the server coomponents.
