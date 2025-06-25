import React from 'react';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export const WorkspaceSwitcher = () => {
  const { workspaces, selectedWorkspace, switchWorkspace, loading } = useWorkspaces();
  const [open, setOpen] = React.useState(false);

  if (loading) {
    return <div>Chargement des espaces de travail...</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-500 hover:bg-slate-600 text-white"
        >
          {selectedWorkspace ? selectedWorkspace.name : 'Sélectionner...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher..." />
          <CommandList>
            <CommandEmpty>Aucun espace de travail trouvé.</CommandEmpty>
            <CommandGroup>
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  value={workspace.id}
                  onSelect={async (currentValue) => {
                    if (currentValue !== selectedWorkspace?.id) {
                      await switchWorkspace(currentValue);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedWorkspace?.id === workspace.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {workspace.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
