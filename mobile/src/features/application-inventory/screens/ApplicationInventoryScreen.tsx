import { useState } from 'react';

import AppScreenContainer from '../../../shared/components/app/AppScreenContainer';
import AppPageHeader from '../../../shared/components/app/AppPageHeader';
import SegmentedControl from '../../../shared/components/ui/SegmentedControl';

export default function ApplicationInventoryScreen() {
  const filterOptions = [
    { label: 'Installed', value: 'installed' },
    { label: 'Uninstalled', value: 'uninstalled' },
  ];

  const [filterOption, setFilterOption] = useState(filterOptions[0].value);

  return (
    <AppScreenContainer>
      <AppPageHeader
        title="Application Inventory"
        subtitle="Monitor and manage installed apps"
      />
      <SegmentedControl
        options={filterOptions}
        value={filterOption}
        onChange={setFilterOption}
      />
    </AppScreenContainer>
  );
}
