import SummaryTable from "./SummaryTable";
import Download from "./Download";

const User = () => {
  return (
    <div>
      <div className="flex justify-between mx-10 my-5">
        <h1 className="text-2xl font-bold font-serif">Task Summary Page</h1>
        <Download />
      </div>

      <SummaryTable />
    </div>
  );
};

export default User;
