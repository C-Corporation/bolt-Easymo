import React, { useState } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { Users } from 'lucide-react';
import OwnerCreateModal from './OwnerCreateModal';
import { useOwners } from '@/contexts/OwnerContext';

const OwnerEmptyState: React.FC = () => {
  const { noOwners } = useOwners();
  const [open, setOpen] = useState(noOwners);

  return (
    <>
      <EmptyState
        title="Aucun propriétaire"
        description="Créez votre premier propriétaire pour commencer à gérer vos biens."
        buttonText="Nouveau propriétaire"
        onButtonClick={() => setOpen(true)}
        icon={<Users className="h-12 w-12" />}

      />
      <OwnerCreateModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default OwnerEmptyState;
