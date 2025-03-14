
export function EmptyGames() {
  return (
    <div className="text-center py-12 px-4 bg-white">
      <h3 className="text-xl font-medium mb-2 text-gray-900">No upcoming games found</h3>
      <p className="text-gray-600 mb-6">
        There are no scheduled games for this team in the near future.
      </p>
    </div>
  );
}
