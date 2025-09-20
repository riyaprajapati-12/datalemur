// Is component ko ab state ki zarurat nahi, yeh sirf props se data lega
const ResultTable = ({ title, data }) => {
  if (!data || !data.columns || !data.values) {
    return (
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-gray-500">No data to display.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            {data.columns.map((col) => (
              <th key={col} className="px-4 py-2 border text-left text-xs font-bold text-gray-700 uppercase">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.values.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 border text-sm text-gray-900">
                  {String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Submission = ({ data }) => {
  // useEffect aur states hata diye gaye hain
  if (!data) {
    return <div className="p-4">Loading submission result...</div>;
  }

  const { userResult, expectedResult, isCorrect } = data;

  const message = isCorrect
    ? "Accepted 🎉 Correct Answer! Loading next question..."
    : "Wrong Answer ❌";

  return (
    <div className="p-4 mt-4">
      <div
        className={`p-3 rounded-lg text-center font-bold text-lg mb-4 ${
          isCorrect
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {message}
      </div>

      <div className="mt-4 grid md:grid-cols-1 gap-6">
        <ResultTable title="Your Output" data={userResult} />
        <ResultTable title="Expected Output" data={expectedResult} />
      </div>
    </div>
  );
};

export default Submission;