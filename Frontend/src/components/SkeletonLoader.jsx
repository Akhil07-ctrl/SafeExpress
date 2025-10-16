import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Reusable Skeleton components for different UI elements

export const CardSkeleton = ({ count = 1 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 text-center">
        <Skeleton height={16} width={60} className="mb-2" />
        <Skeleton height={24} width={40} className="mx-auto" />
      </div>
    ))}
  </div>
);

export const MapSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
    <Skeleton height={24} width={200} className="mb-4" />
    <Skeleton height={400} className="rounded-lg" />
    <div className="flex flex-wrap items-center gap-4 mt-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <Skeleton circle height={12} width={12} />
          <Skeleton height={16} width={60} />
        </div>
      ))}
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
    <Skeleton height={24} width={150} className="mb-4" />
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-4 py-2">
                <Skeleton height={16} width={80} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  <Skeleton height={16} width={colIndex === 0 ? 60 : 100} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const DeliveryCardSkeleton = () => (
  <div className="bg-green-50 border border-green-200 rounded-lg shadow-sm p-4 sm:p-6">
    <Skeleton height={24} width={150} className="mb-4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-md p-3">
          <Skeleton height={14} width={60} className="mb-1" />
          <Skeleton height={16} width={120} />
        </div>
      ))}
    </div>
    <div className="flex justify-end gap-3 mb-4">
      <Skeleton height={36} width={120} />
      <Skeleton height={36} width={140} />
    </div>
    <Skeleton height={300} className="rounded-lg" />
  </div>
);

export const FormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
    <Skeleton height={24} width={200} className="mb-4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <Skeleton height={16} width={80} className="mb-2" />
        <Skeleton height={40} />
      </div>
      <div>
        <Skeleton height={16} width={80} className="mb-2" />
        <Skeleton height={40} />
      </div>
    </div>
    <div className="mb-4">
      <Skeleton height={16} width={100} className="mb-2" />
      <Skeleton height={300} className="rounded-lg" />
    </div>
    <div className="flex justify-end gap-4">
      <Skeleton height={40} width={80} />
      <Skeleton height={40} width={120} />
    </div>
  </div>
);

export const PageSkeleton = ({ children, isLoading }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          <Skeleton height={60} className="rounded-lg" />
          <CardSkeleton count={5} />
          <MapSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }
  return children;
};
