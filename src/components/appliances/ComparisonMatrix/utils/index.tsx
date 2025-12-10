export const parseThroughput = (throughput: string): number => {
  const match = throughput.match(/(\d+(?:\.\d+)?)\s*(Mbps|Gbps)/i);
  if (!match) {
    return 0;
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  return unit === 'gbps' ? value * 1000 : value;
};

export const getCategoryBadgeColor = (category: string) => {
  switch (category) {
    case 'physical':
      return 'bg-blue-100 text-blue-800';
    case 'virtual':
      return 'bg-green-100 text-green-800';
    case 'cloud':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getFeatureIcon = (supported: boolean) => {
  return supported ? (
    <span className="text-green-500" title="Supported">
      ✓
    </span>
  ) : (
    <span className="text-gray-300 dark:text-gray-200" title="Not supported">
      ✗
    </span>
  );
};
