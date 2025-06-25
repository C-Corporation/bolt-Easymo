import { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useOwners } from '@/contexts/OwnerContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const OwnerSwitcher = () => {
  const { owners, selectedOwner, switchOwner } = useOwners();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex-col bg-slate-400 hover:bg-slate-500 text-white"
        >
          <span className="text-xs font-medium text-gray-200">Propriétaire</span>
          <span className="text-sm font-medium mt-0.5">
            {selectedOwner ? selectedOwner.name : 'Sélectionner'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-sm">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Sélectionner un propriétaire</DialogTitle>
        </DialogHeader>
        <Command className="px-4 pb-4">
          <CommandInput placeholder="Rechercher..." />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>Aucun propriétaire trouvé.</CommandEmpty>
            <CommandGroup>
              {owners.map((owner) => (
                <CommandItem
                  key={owner.id}
                  value={owner.id}
                  onSelect={async () => {
                    if (owner.id !== selectedOwner?.id) await switchOwner(owner.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      owner.id === selectedOwner?.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {owner.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerSwitcher;
