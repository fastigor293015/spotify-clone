import Box from "@/components/Box";
import Header from "@/components/Header";
import QueueContent from "./components/QueueContent";

const Queue = () => {
  return (
    <Box
      className="
        h-full
        overflow-hidden
        overflow-y-auto
      "
    >
      <Header className="text-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Queue
          </h1>
        </div>
      </Header>
      <QueueContent />
    </Box>
  );
}

export default Queue;
