import { EmptyStateIcon } from "./GridIcons";
export function EmptyState({ mainMessage, secondaryMessage }) {
  return (
    <div className="flex flex-col items-center py-4 w-full">
      <EmptyStateIcon />
      <p className="mt-4 text-lg font-medium text-gray-600">{mainMessage}</p>
      <p className="text-sm text-gray-500">{secondaryMessage}</p>
    </div>
  );
}