import Box from "@/components/Box";
import Header from "@/components/Header";
import AccountContent from "./components/AccountContent";

const Account = () => {
  return (
    <Box
      className="
        h-full
        pb-20
        overflow-hidden
        overflow-y-auto
      "
    >
      <Header>
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Account Settings
          </h1>
        </div>
      </Header>
      <div className="relative z-[1]">
        <AccountContent />
      </div>
    </Box>
  );
}

export default Account;
