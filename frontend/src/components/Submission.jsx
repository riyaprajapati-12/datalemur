// Is component ko ab state ki zarurat nahi, yeh sirf props se data lega
const ResultTable = ({ title, data }) => {
  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
      <div className="px-4 py-2 border-b bg-gray-100">
        <h3 className="font-semibold text-gray-800 text-sm">
          {title}
        </h3>
      </div>

      {!data || !data.columns || !data.values ? (
        <p className="p-4 text-gray-500 text-sm">
          No data to display.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {data.columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 border-b text-left text-xs font-bold text-gray-700 uppercase"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.values.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-2 border-b text-sm text-gray-900 whitespace-nowrap"
                    >
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Submission = ({ data }) => {
  if (!data) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Loading submission result...
      </div>
    );
  }

  const { userResult, expectedResult, isCorrect } = data;

  return (
    <div className="p-4 space-y-6">
      {/* Status Banner */}
      <div
        className={`p-4 rounded-lg text-center font-semibold text-lg border ${
          isCorrect
            ? "bg-green-50 text-green-700 border-green-300"
            : "bg-red-50 text-red-700 border-red-300"
        }`}
      >
        {isCorrect ? "Accepted 🎉 Correct Answer" : "Wrong Answer ❌"}
      </div>

      {/* Result Tables */}
      <div className="grid gap-6">
        <ResultTable title="Your Output" data={userResult} />
        <ResultTable title="Expected Output" data={expectedResult} />
      </div>
    </div>
  );
};

export default Submission;
