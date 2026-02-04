import { DashboardBlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';

// Route component - composes multiple blocks
export function Blank() {
  return (
    <DashboardBlock {...fixtures.dashboard} />
  );
}
